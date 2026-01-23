/**
 * WebAuthn Configuration and Utilities
 * 
 * Production-grade WebAuthn setup with YubiKey attestation policy.
 */

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type GenerateRegistrationOptionsOpts,
  type VerifyRegistrationResponseOpts,
  type GenerateAuthenticationOptionsOpts,
  type VerifyAuthenticationResponseOpts,
} from '@simplewebauthn/server';
import type {
  AuthenticatorTransportFuture,
  PublicKeyCredentialDescriptorFuture,
} from '@simplewebauthn/server/script/deps';

// Environment configuration
// Use runtime getters to allow for dynamic env var loading
function getRPId(): string {
  const rpId = process.env.WEBAUTHN_RP_ID || process.env.NEXT_PUBLIC_WEBAUTHN_RP_ID;
  if (!rpId) {
    throw new Error(
      'WEBAUTHN_RP_ID or NEXT_PUBLIC_WEBAUTHN_RP_ID environment variable is required. ' +
      'For localhost development, set WEBAUTHN_RP_ID=localhost in .env.local'
    );
  }
  return rpId;
}

function getOrigin(): string {
  const origin = process.env.WEBAUTHN_ORIGIN || process.env.NEXT_PUBLIC_WEBAUTHN_ORIGIN;
  if (!origin) {
    throw new Error(
      'WEBAUTHN_ORIGIN or NEXT_PUBLIC_WEBAUTHN_ORIGIN environment variable is required. ' +
      'For localhost development, set WEBAUTHN_ORIGIN=http://localhost:3000 in .env.local'
    );
  }
  return origin;
}

const RP_NAME = process.env.WEBAUTHN_RP_NAME || 'SAGE OS';

/**
 * Get allowed YubiKey AAGUIDs from environment
 * Format: comma-separated list of AAGUIDs
 * Example: "f8a011f3-8c0a-4b2f-9b7c-4e8d9e0f1a2b,12345678-1234-1234-1234-123456789abc"
 */
function getAllowedAAGUIDs(): string[] {
  const allowlist = process.env.WEBAUTHN_AAGUID_ALLOWLIST;
  if (!allowlist || allowlist.trim() === '') {
    return []; // Fail closed - empty allowlist means deny all
  }
  return allowlist.split(',').map((aaguid) => aaguid.trim()).filter(Boolean);
}

/**
 * Check if an AAGUID is allowed (YubiKey attestation policy)
 */
export function isAAGUIDAllowed(aaguid: string | undefined): boolean {
  if (!aaguid) {
    return false; // No AAGUID = deny
  }
  const allowed = getAllowedAAGUIDs();
  if (allowed.length === 0) {
    return false; // Empty allowlist = deny by default
  }
  return allowed.includes(aaguid);
}

/**
 * Generate registration options
 */
export async function generateRegOptions(
  userId: string,
  userName: string,
  existingCredentials: PublicKeyCredentialDescriptorFuture[] = []
): Promise<ReturnType<typeof generateRegistrationOptions>> {
  const opts: GenerateRegistrationOptionsOpts = {
    rpName: RP_NAME,
    rpID: getRPId(),
    userID: Buffer.from(userId),
    userName,
    timeout: 60000, // 60 seconds
    attestationType: 'direct', // Require attestation for YubiKey verification
    excludeCredentials: existingCredentials,
    authenticatorSelection: {
      authenticatorAttachment: 'cross-platform', // Allow USB keys
      userVerification: 'required',
      requireResidentKey: false,
    },
    supportedAlgorithmIDs: [-7, -257], // ES256, RS256
  };

  return generateRegistrationOptions(opts);
}

/**
 * Verify registration response
 */
export async function verifyRegResponse(
  response: any,
  expectedChallenge: string,
  expectedOrigin?: string,
  expectedRPID?: string
): Promise<ReturnType<typeof verifyRegistrationResponse>> {
  const opts: VerifyRegistrationResponseOpts = {
    response,
    expectedChallenge,
    expectedOrigin: expectedOrigin || getOrigin(),
    expectedRPID: expectedRPID || getRPId(),
    requireUserVerification: true,
  };

  return verifyRegistrationResponse(opts);
}

/**
 * Generate authentication options
 */
export async function generateAuthOptions(
  credentials: PublicKeyCredentialDescriptorFuture[]
): Promise<ReturnType<typeof generateAuthenticationOptions>> {
  const opts: GenerateAuthenticationOptionsOpts = {
    rpID: getRPId(),
    timeout: 60000, // 60 seconds
    allowCredentials: credentials,
    userVerification: 'required',
  };

  return generateAuthenticationOptions(opts);
}

/**
 * Verify authentication response
 */
export async function verifyAuthResponse(
  response: any,
  expectedChallenge: string,
  expectedOrigin?: string,
  expectedRPID?: string,
  credential?: {
    id: Buffer;
    publicKey: Buffer;
    counter: number;
  }
): Promise<ReturnType<typeof verifyAuthenticationResponse>> {
  if (!credential) {
    throw new Error('Credential is required for authentication verification');
  }
  
  const opts: VerifyAuthenticationResponseOpts = {
    response,
    expectedChallenge,
    expectedOrigin: expectedOrigin || getOrigin(),
    expectedRPID: expectedRPID || getRPId(),
    credential,
    requireUserVerification: true,
  };

  return verifyAuthenticationResponse(opts);
}

// Export getters for use in API routes (if needed)
// Most routes will use the functions directly which call these internally
export { RP_NAME };
