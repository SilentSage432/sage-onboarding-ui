/**
 * Server-Side Authorization
 * 
 * Production-grade authorization enforcement for architect-only routes.
 * This is the security boundary - client-side checks are for UX only.
 */

import { redirect } from 'next/navigation';
import { getSessionFromCookie } from './session';
import { logAuditEvent } from './audit';

/**
 * Require architect session - throws error or redirects if not authenticated
 * Use this in API routes and server components to enforce authorization.
 */
export async function requireArchitectSession(): Promise<string> {
  const userId = await getSessionFromCookie();

  if (!userId) {
    await logAuditEvent('SESSION_VALIDATION_FAIL');
    redirect('/api/auth/webauthn/authenticate/options');
  }

  return userId;
}

/**
 * Get architect session if exists (does not throw)
 * Use this when you need to check session but allow unauthenticated access.
 */
export async function getArchitectSession(): Promise<string | null> {
  return await getSessionFromCookie();
}
