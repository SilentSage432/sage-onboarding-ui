/**
 * Session Management
 * 
 * Production-grade server-side session management with database persistence.
 * Sessions are stored in Postgres and validated on every request.
 */

import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { query, transaction } from '@/lib/db/client';

const SESSION_COOKIE_NAME = 'sage_architect_session';
const SESSION_TTL_HOURS = 12; // Maximum session lifetime
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required');
}

/**
 * Generate a secure random session ID
 */
function generateSessionId(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);

  await query(
    `INSERT INTO auth_sessions (session_id, user_id, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [sessionId, userId, expiresAt, ipAddress || null, userAgent || null]
  );

  return sessionId;
}

/**
 * Validate a session and return user ID if valid
 */
export async function validateSession(sessionId: string): Promise<string | null> {
  const result = await query<{
    user_id: string;
    expires_at: Date;
    revoked_at: Date | null;
  }>(
    `SELECT user_id, expires_at, revoked_at
     FROM auth_sessions
     WHERE session_id = $1
     AND expires_at > NOW()
     AND revoked_at IS NULL`,
    [sessionId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].user_id;
}

/**
 * Revoke a session (logout)
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await query(
    `UPDATE auth_sessions
     SET revoked_at = NOW()
     WHERE session_id = $1`,
    [sessionId]
  );
}

/**
 * Revoke all sessions for a user
 */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  await query(
    `UPDATE auth_sessions
     SET revoked_at = NOW()
     WHERE user_id = $1
     AND revoked_at IS NULL`,
    [userId]
  );
}

/**
 * Clean up expired sessions (maintenance task)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await query<{ count: string }>(
    `DELETE FROM auth_sessions
     WHERE expires_at < NOW()
     RETURNING id`
  );
  return result.rows.length;
}

/**
 * Get session from cookie
 */
export async function getSessionFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }
  return await validateSession(sessionCookie.value);
}

/**
 * Set session cookie
 */
export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_TTL_HOURS * 60 * 60,
    path: '/',
  });
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME, SESSION_TTL_HOURS };
