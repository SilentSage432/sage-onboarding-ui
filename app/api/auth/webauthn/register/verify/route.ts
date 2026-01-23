/**
 * WebAuthn Registration Verify Endpoint
 * 
 * Verifies registration response and stores credential if valid.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db/client';
import {
  verifyRegResponse,
  isAAGUIDAllowed,
} from '@/lib/auth/webauthn';
import { logAuditEvent } from '@/lib/auth/audit';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/auth/rate-limit';

const ARCHITECT_USER_ID = 'architect'; // Single architect identity for now

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = await getRateLimitIdentifier();
    const endpoint = '/api/auth/webauthn/register/verify';
    if (!(await checkRateLimit(endpoint, identifier))) {
      await logAuditEvent('REG_VERIFY_FAIL', undefined, { rateLimited: true });
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { response } = body;

    if (!response) {
      await logAuditEvent('REG_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Missing response',
      });
      return NextResponse.json({ error: 'Missing response' }, { status: 400 });
    }

    // Extract challenge from clientDataJSON (WebAuthn response format)
    // The challenge is base64url encoded in the clientDataJSON
    let challengeFromResponse: string;
    try {
      if (response.response?.clientDataJSON) {
        // Decode base64url clientDataJSON to get the challenge
        const clientDataJSON = Buffer.from(response.response.clientDataJSON, 'base64url').toString('utf-8');
        const clientData = JSON.parse(clientDataJSON);
        challengeFromResponse = clientData.challenge;
      } else if (response.challenge) {
        // Fallback: challenge might be at top level (for testing)
        challengeFromResponse = response.challenge;
      } else {
        throw new Error('Challenge not found in response');
      }
    } catch (error) {
      await logAuditEvent('REG_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Failed to extract challenge from response',
      });
      return NextResponse.json({ error: 'Invalid response format' }, { status: 400 });
    }

    // Get and validate challenge from database
    const challengeResult = await query<{
      id: string;
      challenge: string;
      expires_at: Date;
      used_at: Date | null;
    }>(
      `SELECT id, challenge, expires_at, used_at
       FROM auth_webauthn_challenges
       WHERE challenge = $1
       AND purpose = 'registration'
       AND user_id = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [challengeFromResponse, ARCHITECT_USER_ID]
    );

    if (challengeResult.rows.length === 0) {
      await logAuditEvent('REG_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Challenge not found',
      });
      return NextResponse.json({ error: 'Invalid challenge' }, { status: 400 });
    }

    const challenge = challengeResult.rows[0];

    if (challenge.used_at) {
      await logAuditEvent('REG_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Challenge already used',
      });
      return NextResponse.json({ error: 'Challenge already used' }, { status: 400 });
    }

    if (new Date(challenge.expires_at) < new Date()) {
      await logAuditEvent('REG_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: 'Challenge expired',
      });
      return NextResponse.json({ error: 'Challenge expired' }, { status: 400 });
    }

    // Verify registration response
    const verification = await verifyRegResponse(
      response,
      challenge.challenge
    );

    if (!verification.verified) {
      await logAuditEvent('REG_VERIFY_FAIL', ARCHITECT_USER_ID, {
        error: verification.error?.message || 'Verification failed',
      });
      return NextResponse.json(
        { error: 'Verification failed', details: verification.error?.message },
        { status: 400 }
      );
    }

    // Check AAGUID allowlist (YubiKey attestation policy)
    const aaguid = verification.registrationInfo?.aaguid;
    if (!isAAGUIDAllowed(aaguid)) {
      const actualAaguid = aaguid || 'missing';
      await logAuditEvent('REG_VERIFY_ATTESTATION_DENIED', ARCHITECT_USER_ID, {
        aaguid: actualAaguid,
        error: 'AAGUID not in allowlist',
      });
      return NextResponse.json(
        { 
          error: 'Authenticator not allowed (AAGUID not in allowlist)',
          aaguid: actualAaguid,
          message: actualAaguid !== 'missing' 
            ? `Your YubiKey's AAGUID (${actualAaguid}) is not in the allowlist. Add it to WEBAUTHN_AAGUID_ALLOWLIST in .env.local`
            : 'AAGUID was not provided by the authenticator'
        },
        { status: 403 }
      );
    }

    // Store credential in database
    await transaction(async (client) => {
      // Mark challenge as used
      await client.query(
        `UPDATE auth_webauthn_challenges
         SET used_at = NOW()
         WHERE id = $1`,
        [challenge.id]
      );

      // Store credential
      const credentialId = Buffer.from(verification.registrationInfo!.credentialID);
      const publicKey = Buffer.from(verification.registrationInfo!.credentialPublicKey);
      const transports = verification.registrationInfo!.counter
        ? JSON.stringify(verification.registrationInfo!.transports || [])
        : null;

      await client.query(
        `INSERT INTO auth_webauthn_credentials
         (user_id, credential_id, public_key, counter, transports, aaguid)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          ARCHITECT_USER_ID,
          credentialId,
          publicKey,
          verification.registrationInfo!.counter || 0,
          transports,
          aaguid || null,
        ]
      );
    });

    await logAuditEvent('REG_VERIFY_OK', ARCHITECT_USER_ID, {
      aaguid: aaguid || null,
      credentialId: verification.registrationInfo!.credentialID.toString('base64'),
    });

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Registration verify error:', error);
    await logAuditEvent('REG_VERIFY_FAIL', ARCHITECT_USER_ID, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Registration verification failed' },
      { status: 500 }
    );
  }
}
