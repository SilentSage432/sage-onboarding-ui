/**
 * WebAuthn Authentication Options Endpoint
 * 
 * Generates authentication challenge for existing YubiKey.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/client';
import { generateAuthOptions } from '@/lib/auth/webauthn';
import { logAuditEvent } from '@/lib/auth/audit';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/auth/rate-limit';

const ARCHITECT_USER_ID = 'architect'; // Single architect identity for now

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = await getRateLimitIdentifier();
    const endpoint = '/api/auth/webauthn/authenticate/options';
    if (!(await checkRateLimit(endpoint, identifier))) {
      await logAuditEvent('AUTH_OPTIONS', undefined, { rateLimited: true });
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Get active credentials for this user
    const credentialsResult = await query<{
      credential_id: Buffer;
      transports: string | null;
    }>(
      `SELECT credential_id, transports
       FROM auth_webauthn_credentials
       WHERE user_id = $1
       AND revoked_at IS NULL`,
      [ARCHITECT_USER_ID]
    );

    if (credentialsResult.rows.length === 0) {
      await logAuditEvent('AUTH_OPTIONS', ARCHITECT_USER_ID, {
        error: 'No credentials found',
      });
      return NextResponse.json(
        { error: 'No registered credentials found' },
        { status: 404 }
      );
    }

    const credentials = credentialsResult.rows.map((row) => {
      let transports: string[] | undefined = undefined;
      
      if (row.transports) {
        try {
          // Try parsing as JSON array first
          transports = JSON.parse(row.transports);
        } catch (error) {
          // Fallback: handle comma-separated string format (backwards compatibility)
          if (typeof row.transports === 'string') {
            transports = row.transports.split(',').map(t => t.trim()).filter(Boolean);
          }
        }
      }
      
      // credential_id is stored as BYTEA in database, convert to base64url for WebAuthn
      // The library expects the id as a Buffer or base64url string
      const credentialIdBuffer = Buffer.isBuffer(row.credential_id) 
        ? row.credential_id 
        : Buffer.from(row.credential_id);
      
      return {
        id: credentialIdBuffer,
        transports,
      };
    });

    // Generate authentication options
    const options = await generateAuthOptions(credentials);

    // Store challenge in database
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await query(
      `INSERT INTO auth_webauthn_challenges (challenge, purpose, user_id, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [options.challenge, 'authentication', ARCHITECT_USER_ID, expiresAt]
    );

    await logAuditEvent('AUTH_OPTIONS', ARCHITECT_USER_ID, {
      challenge: options.challenge,
      credentialCount: credentials.length,
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Authentication options error:', error);
    await logAuditEvent('AUTH_OPTIONS', undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json(
      { error: 'Failed to generate authentication options' },
      { status: 500 }
    );
  }
}
