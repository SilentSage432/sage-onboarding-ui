/**
 * WebAuthn Authentication Verify Endpoint
 * 
 * Verifies authentication response and creates session if valid.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db/client';
import { verifyAuthResponse, ORIGIN, RP_ID } from '@/lib/auth/webauthn';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/auth/rate-limit';
import { headers } from 'next/headers';

const ARCHITECT_USER_ID = 'architect'; // Single architect identity for now

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = await getRateLimitIdentifier();
    const endpoint = '/api/auth/webauthn/authenticate/verify';
    if (!(await checkRateLimit(endpoint, identifier))) {
      await logAuditEvent('AUTH_VERIFY_FAIL', undefined, { rateLimited: true });
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { response } = body;

    if (!response) {
      await logAuditEvent('AUTH_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Missing response',
      });
      return NextResponse.json({ error: 'Missing response' }, { status: 400 });
    }

    // Get and validate challenge
    const challengeResult = await query<{
      id: string;
      challenge: string;
      expires_at: Date;
      used_at: Date | null;
    }>(
      `SELECT id, challenge, expires_at, used_at
       FROM auth_webauthn_challenges
       WHERE challenge = $1
       AND purpose = 'authentication'
       AND user_id = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [response.challenge, ARCHITECT_USER_ID]
    );

    if (challengeResult.rows.length === 0) {
      await logAuditEvent('AUTH_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Challenge not found',
      });
      return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
    }

    const challenge = challengeResult.rows[0];

    if (challenge.used_at) {
      await logAuditEvent('AUTH_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Challenge already used',
      });
      return NextResponse.json({ error: 'Challenge already used' }, { status: 400 });
    }

    if (new Date(challenge.expires_at) < new Date()) {
      await logAuditEvent('AUTH_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Challenge expired',
      });
      return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
    }

    // Get credential from database
    const credentialId = Buffer.from(response.id, 'base64');
    const credentialResult = await query<{
      id: string;
      credential_id: Buffer;
      public_key: Buffer;
      counter: number;
    }>(
      `SELECT id, credential_id, public_key, counter
       FROM auth_webauthn_credentials
       WHERE credential_id = $1
       AND user_id = $2
       AND revoked_at IS NULL`,
      [credentialId, ARCHITECT_USER_ID]
    );

    if (credentialResult.rows.length === 0) {
      await logAuditEvent('AUTH_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Credential not found',
      });
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 });
    }

    const credential = credentialResult.rows[0];

    // Verify authentication response
    const verification = await verifyAuthResponse(
      response,
      challenge.challenge,
      ORIGIN,
      RP_ID,
      {
        id: Buffer.from(credential.credential_id),
        publicKey: Buffer.from(credential.public_key),
        counter: credential.counter,
      }
    );

    if (!verification.verified) {
      await logAuditEvent('AUTH_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: verification.error?.message || 'Verification failed',
      });
      return NextResponse.json(
        { error: 'Verification failed', details: verification.error?.message },
        { status: 400 }
      );
    }

    // Check counter (replay attack protection)
    const newCounter = verification.authenticationInfo.newCounter;
    if (newCounter <= credential.counter) {
      await logAuditEvent('AUTH_VERIFY_COUNTER_MISMATCH', ARCHITECT_USER_ID, {
        oldCounter: credential.counter,
        newCounter,
        error: 'Counter did not increase',
      });
      return NextResponse.json(
        { error: 'Counter mismatch - possible replay attack' },
        { status: 400 }
      );
    }

    // Update credential counter and mark challenge as used
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      undefined;
    const userAgent = headersList.get('user-agent') || undefined;

    await transaction(async (client) => {
      // Mark challenge as used
      await client.query(
        `UPDATE auth_webauthn_challenges
         SET used_at = NOW()
         WHERE id = $1`,
        [challenge.id]
      );

      // Update credential counter and last_used_at
      await client.query(
        `UPDATE auth_webauthn_credentials
         SET counter = $1, last_used_at = NOW()
         WHERE id = $2`,
        [newCounter, credential.id]
      );
    });

    // Create session
    const sessionId = await createSession(ARCHITECT_USER_ID, ip, userAgent);
    await setSessionCookie(sessionId);

    await logAuditEvent('AUTH_VERIFY_OK', ARCHITECT_USER_ID, {
      credentialId: response.id,
      newCounter,
    });
    await logAuditEvent('SESSION_CREATED', ARCHITECT_USER_ID, {
      sessionId,
    });

    return NextResponse.json({ verified: true, sessionId });
  } catch (error) {
    console.error('Authentication verify error:', error);
    await logAuditEvent('AUTH_VERIFY_FAIL', ARCHITECT_USER_ID, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Authentication verification failed' },
      { status: 500 }
    );
  }
}
