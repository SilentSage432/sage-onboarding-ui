/**
 * Configuration Metadata Module
 * 
 * Read-only introspection of runtime configuration state.
 * This module provides truthful metadata about what is configured,
 * without exposing secret values or modifying state.
 * 
 * Used by /api/config endpoint for operational introspection.
 */

/**
 * Environment variable metadata (presence/absence only, no values)
 */
export type EnvVarMetadata = {
  name: string;
  present: boolean;
  required: boolean;
  conditional?: string; // e.g., "if DATABASE_URL is set"
};

/**
 * Feature flags derived from configuration
 */
export type FeatureFlags = {
  database: boolean; // DATABASE_URL is set
  webauthn: boolean; // WebAuthn is configured (RP_ID and ORIGIN present)
  sessionManagement: boolean; // SESSION_SECRET is set
};

/**
 * Runtime information (non-sensitive)
 */
export type RuntimeInfo = {
  nodeEnv: string;
  port: string | undefined;
  hostname: string | undefined;
};

/**
 * Complete configuration metadata
 */
export type ConfigMetadata = {
  env: {
    variables: EnvVarMetadata[];
    summary: {
      total: number;
      present: number;
      missing: number;
      required: number;
      requiredPresent: number;
    };
  };
  features: FeatureFlags;
  runtime: RuntimeInfo;
};

/**
 * List of all environment variables the application may use.
 * This includes required, optional, and conditional variables.
 */
const ALL_ENV_VARS: Array<{
  name: string;
  required: boolean;
  conditional?: string;
}> = [
  // Always required
  { name: 'SESSION_SECRET', required: true },
  
  // Database (optional, but enables DB-backed features)
  { name: 'DATABASE_URL', required: false },
  
  // WebAuthn (conditionally required if DATABASE_URL is set)
  { name: 'WEBAUTHN_RP_ID', required: false, conditional: 'if DATABASE_URL is set' },
  { name: 'NEXT_PUBLIC_WEBAUTHN_RP_ID', required: false, conditional: 'if DATABASE_URL is set' },
  { name: 'WEBAUTHN_ORIGIN', required: false, conditional: 'if DATABASE_URL is set' },
  { name: 'NEXT_PUBLIC_WEBAUTHN_ORIGIN', required: false, conditional: 'if DATABASE_URL is set' },
  { name: 'WEBAUTHN_RP_NAME', required: false },
  { name: 'WEBAUTHN_AAGUID_ALLOWLIST', required: false },
  
  // Runtime (set by Next.js or container)
  { name: 'NODE_ENV', required: false },
  { name: 'PORT', required: false },
  { name: 'HOSTNAME', required: false },
];

/**
 * Check if an environment variable is present (non-empty)
 */
function isEnvVarPresent(name: string): boolean {
  const value = process.env[name];
  return value !== undefined && value.trim() !== '';
}

/**
 * Get environment variable metadata
 */
function getEnvVarMetadata(): EnvVarMetadata[] {
  return ALL_ENV_VARS.map(({ name, required, conditional }) => ({
    name,
    present: isEnvVarPresent(name),
    required,
    conditional,
  }));
}

/**
 * Get feature flags based on configuration presence
 */
function getFeatureFlags(): FeatureFlags {
  const hasDatabase = isEnvVarPresent('DATABASE_URL');
  
  // WebAuthn is enabled if both RP_ID and ORIGIN are present (either regular or NEXT_PUBLIC_ versions)
  const hasWebAuthnRPId = isEnvVarPresent('WEBAUTHN_RP_ID') || isEnvVarPresent('NEXT_PUBLIC_WEBAUTHN_RP_ID');
  const hasWebAuthnOrigin = isEnvVarPresent('WEBAUTHN_ORIGIN') || isEnvVarPresent('NEXT_PUBLIC_WEBAUTHN_ORIGIN');
  const hasWebAuthn = hasDatabase && hasWebAuthnRPId && hasWebAuthnOrigin;
  
  return {
    database: hasDatabase,
    webauthn: hasWebAuthn,
    sessionManagement: isEnvVarPresent('SESSION_SECRET'),
  };
}

/**
 * Get runtime information (non-sensitive)
 */
function getRuntimeInfo(): RuntimeInfo {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    hostname: process.env.HOSTNAME,
  };
}

/**
 * Get complete configuration metadata.
 * 
 * Returns truthful, read-only metadata about runtime configuration:
 * - Which environment variables are present (not their values)
 * - Which features are enabled based on configuration
 * - Basic runtime information
 * 
 * This function is pure and side-effect minimal:
 * - Read-only checks
 * - No state modification
 * - No secrets exposed
 */
export function getConfigMetadata(): ConfigMetadata {
  const envVars = getEnvVarMetadata();
  const requiredVars = envVars.filter(v => v.required);
  const presentVars = envVars.filter(v => v.present);
  const requiredPresentVars = requiredVars.filter(v => v.present);
  
  return {
    env: {
      variables: envVars,
      summary: {
        total: envVars.length,
        present: presentVars.length,
        missing: envVars.length - presentVars.length,
        required: requiredVars.length,
        requiredPresent: requiredPresentVars.length,
      },
    },
    features: getFeatureFlags(),
    runtime: getRuntimeInfo(),
  };
}
