/**
 * Rate Limiting
 * 
 * Basic rate limiting for authentication endpoints.
 * Production systems should use Redis or a dedicated rate limiting service.
 */

import { query } from '@/lib/db/client';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/auth/webauthn/register/options': { windowMs: 60000, maxRequests: 5 }, // 5 per minute
  '/api/auth/webauthn/register/verify': { windowMs: 60000, maxRequests: 5 },
  '/api/auth/webauthn/authenticate/options': { windowMs: 60000, maxRequests: 10 }, // 10 per minute
  '/api/auth/webauthn/authenticate/verify': { windowMs: 60000, maxRequests: 10 },
  '/api/auth/logout': { windowMs: 60000, maxRequests: 20 },
};

/**
 * Check rate limit for an endpoint
 * Returns true if within limit, false if rate limited
 * If database is unavailable, allows the request (development mode)
 */
export async function checkRateLimit(
  endpoint: string,
  identifier: string // IP address or user ID
): Promise<boolean> {
  const config = RATE_LIMITS[endpoint];
  if (!config) {
    return true; // No rate limit configured
  }

  try {
    const windowStart = new Date(Date.now() - config.windowMs);
    
    // Count requests in the current window
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) as count
       FROM auth_audit_log
       WHERE event_type IN ('REG_OPTIONS', 'REG_VERIFY_OK', 'REG_VERIFY_FAIL', 
                            'AUTH_OPTIONS', 'AUTH_VERIFY_OK', 'AUTH_VERIFY_FAIL',
                            'LOGOUT')
       AND ip_address = $1
       AND ts > $2`,
      [identifier, windowStart]
    );

    const count = parseInt(result.rows[0]?.count || '0', 10);
    return count < config.maxRequests;
  } catch (error) {
    // If database is unavailable, allow the request (development mode)
    // In production, DATABASE_URL should always be set
    console.warn('Rate limiting unavailable (database error):', error instanceof Error ? error.message : 'Unknown error');
    return true; // Allow request if rate limiting can't be checked
  }
}

/**
 * Get client identifier for rate limiting
 */
export async function getRateLimitIdentifier(): Promise<string> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';
  return ip;
}
