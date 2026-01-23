/**
 * Startup Validation Module
 * 
 * Truthful validation of application dependencies for container readiness.
 * This module performs read-only checks and never modifies state.
 * 
 * Used by /api/ready endpoint to determine if the application is ready
 * to serve requests correctly.
 */

import { query } from '@/lib/db/client';

/**
 * Environment variable validation result
 */
export type EnvCheckResult = {
  ok: boolean;
  missing: string[];
};

/**
 * Database connectivity check result
 */
export type DatabaseCheckResult = {
  ok: boolean;
  error?: string;
};

/**
 * Complete startup validation result
 */
export type StartupValidationResult = {
  env: EnvCheckResult;
  db: DatabaseCheckResult;
  ready: boolean;
};

/**
 * List of environment variables that are required for the application to function.
 * These are checked explicitly - if missing, the app is not ready.
 * 
 * Note: Some variables are conditionally required (e.g., DATABASE_URL only if DB operations are used).
 * This list represents variables that would cause runtime failures if missing when needed.
 */
const REQUIRED_ENV_VARS = [
  // Session management (required if auth is used)
  'SESSION_SECRET',
] as const;

/**
 * Conditionally required environment variables.
 * These are only required if DATABASE_URL is present (indicating DB-backed features are enabled).
 */
const CONDITIONAL_ENV_VARS = [
  // WebAuthn configuration (required if DATABASE_URL is set, since auth uses DB)
  'WEBAUTHN_RP_ID',
  'WEBAUTHN_ORIGIN',
] as const;

/**
 * Validate required environment variables.
 * Returns list of missing variables without exposing their values.
 */
function validateEnvironmentVariables(): EnvCheckResult {
  const missing: string[] = [];

  // Check always-required variables
  for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName] || process.env[varName]!.trim() === '') {
      missing.push(varName);
    }
  }

  // Check conditionally-required variables only if DATABASE_URL is present
  // (indicating DB-backed features are enabled)
  if (process.env.DATABASE_URL) {
    for (const varName of CONDITIONAL_ENV_VARS) {
      // Check both regular and NEXT_PUBLIC_ prefixed versions
      const regular = process.env[varName];
      const publicVar = process.env[`NEXT_PUBLIC_${varName}`];
      
      if ((!regular || regular.trim() === '') && (!publicVar || publicVar.trim() === '')) {
        missing.push(varName);
      }
    }
  }

  return {
    ok: missing.length === 0,
    missing,
  };
}

/**
 * Validate database connectivity.
 * Only checks if DATABASE_URL is present - if not, database is considered optional.
 * Performs a lightweight SELECT 1 query to verify connectivity.
 * 
 * Returns safe error messages that do not expose credentials.
 */
async function validateDatabaseConnectivity(): Promise<DatabaseCheckResult> {
  // Database is optional - only check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    return {
      ok: true, // Not required, so it's "ok" (not an error)
    };
  }

  try {
    // Perform lightweight connectivity check
    await query('SELECT 1');
    
    return {
      ok: true,
    };
  } catch (error) {
    // Return safe error message (no credentials exposed)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown database error';
    
    // Sanitize error message to remove potential credential leaks
    const safeError = errorMessage
      .replace(/password[=:]\S+/gi, 'password=***')
      .replace(/user[=:]\S+/gi, 'user=***')
      .replace(/@[\w.-]+/g, '@***')
      .substring(0, 200); // Limit length
    
    return {
      ok: false,
      error: safeError,
    };
  }
}

/**
 * Run complete startup validation.
 * 
 * Performs all readiness checks:
 * - Environment variable validation
 * - Database connectivity (if DATABASE_URL is present)
 * 
 * Returns truthful validation results suitable for container orchestration.
 * 
 * This function is pure and side-effect minimal:
 * - Read-only checks
 * - No state modification
 * - No retries
 * - No writes
 */
export async function runStartupValidation(): Promise<StartupValidationResult> {
  const env = validateEnvironmentVariables();
  const db = await validateDatabaseConnectivity();

  // Application is ready if:
  // - All required environment variables are present
  // - Database is either not configured OR is reachable
  const ready = env.ok && db.ok;

  return {
    env,
    db,
    ready,
  };
}
