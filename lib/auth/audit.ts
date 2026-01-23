/**
 * Audit Logging
 * 
 * Comprehensive audit trail for all authentication events.
 */

import { query } from '@/lib/db/client';
import { headers } from 'next/headers';

export type AuditEventType =
  | 'REG_OPTIONS'
  | 'REG_VERIFY_OK'
  | 'REG_VERIFY_FAIL'
  | 'REG_VERIFY_ATTESTATION_DENIED'
  | 'AUTH_OPTIONS'
  | 'AUTH_VERIFY_OK'
  | 'AUTH_VERIFY_FAIL'
  | 'AUTH_VERIFY_COUNTER_MISMATCH'
  | 'SESSION_CREATED'
  | 'SESSION_REVOKED'
  | 'SESSION_EXPIRED'
  | 'SESSION_VALIDATION_FAIL'
  | 'LOGOUT';

/**
 * Get client IP and user agent from request headers
 */
async function getRequestMetadata(): Promise<{ ip: string | null; userAgent: string | null }> {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    null;
  const userAgent = headersList.get('user-agent') || null;
  return { ip, userAgent };
}

/**
 * Log an audit event
 * Silently fails if database is unavailable (development mode)
 */
export async function logAuditEvent(
  eventType: AuditEventType,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const { ip, userAgent } = await getRequestMetadata();

    await query(
      `INSERT INTO auth_audit_log (event_type, user_id, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [eventType, userId || null, ip, userAgent, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (error) {
    // If database is unavailable, log to console instead
    // In production, DATABASE_URL should always be set
    console.warn('Audit logging unavailable (database error):', {
      eventType,
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
