/**
 * Logout Endpoint
 * 
 * Revokes session and clears session cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeSession, clearSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';
import { checkRateLimit, getRateLimitIdentifier } from '@/lib/auth/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = await getRateLimitIdentifier();
    const endpoint = '/api/auth/logout';
    if (!(await checkRateLimit(endpoint, identifier))) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (sessionCookie?.value) {
      await revokeSession(sessionCookie.value);
      await logAuditEvent('SESSION_REVOKED', undefined, {
        sessionId: sessionCookie.value,
      });
    }

    await clearSessionCookie();
    await logAuditEvent('LOGOUT');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    await logAuditEvent('LOGOUT', undefined, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
