/**
 * WebAuthn Registration Options Endpoint
 * 
 * Generates registration challenge for new YubiKey registration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db/client';
import {
  generateRegOptions,
  isAAGUIDAllowed,
} from '@/lib/auth/webauthn';
import { logAuditEvent } from '@/lib/auth/audit';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/auth/rate-limit';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';

const ARCHITECT_USER_ID = 'architect'; // Single architect identity for now

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = await getRateLimitIdentifier();
    const endpoint = '/api/auth/webauthn/register/options';
    if (!(await checkRateLimit(endpoint, identifier))) {
      await logAuditEvent('REG_OPTIONS', undefined, { rateLimited: true });
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Get existing credentials for this user
    const existingCredsResult = await query<{
      credential_id: Buffer;
      transports: string | null;
    }>(
      `SELECT credential_id, transports
       FROM auth_webauthn_credentials
       WHERE user_id = $1
       AND revoked_at IS NULL`,
      [ARCHITECT_USER_ID]
    );

    const existingCredentials = existingCredsResult.rows.map((row) => {
      // credential_id is stored as BYTEA in database
      // Postgres returns BYTEA as Buffer
      // @simplewebauthn/server expects credential ID as base64url string for excludeCredentials
      const credentialIdBuffer = Buffer.isBuffer(row.credential_id)
        ? row.credential_id
        : Buffer.from(row.credential_id);
      const credentialIdString = credentialIdBuffer.toString('base64url');
      
      return {
        type: 'public-key' as const,
        id: credentialIdString,
        transports: row.transports ? (JSON.parse(row.transports) as AuthenticatorTransportFuture[]) : undefined,
      };
    });

    // Generate registration options
    const options = await generateRegOptions(
      ARCHITECT_USER_ID,
      'SAGE Architect',
      existingCredentials
    );

    // Store challenge in database
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await query(
      `INSERT INTO auth_webauthn_challenges (challenge, purpose, user_id, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [options.challenge, 'registration', ARCHITECT_USER_ID, expiresAt]
    );

    await logAuditEvent('REG_OPTIONS', ARCHITECT_USER_ID, {
      challenge: options.challenge,
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Registration options error:', error);
    await logAuditEvent('REG_OPTIONS', undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Failed to generate registration options' },
      { status: 500 }
    );
  }
}
