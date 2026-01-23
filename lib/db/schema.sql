-- WebAuthn Authentication Schema for SAGE OS
-- Database: sage_os
-- Schema: public (search_path must be `public`)

SET search_path TO public;

-- WebAuthn Challenge Storage
-- Stores temporary challenges for registration and authentication flows
CREATE TABLE IF NOT EXISTS auth_webauthn_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('registration', 'authentication')),
  user_id TEXT, -- For now, single architect identity (nullable)
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_expires ON auth_webauthn_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_challenges_user ON auth_webauthn_challenges(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_challenges_unused ON auth_webauthn_challenges(expires_at, used_at) WHERE used_at IS NULL;

-- WebAuthn Credential Storage
-- Stores registered authenticator credentials (YubiKeys, etc.)
CREATE TABLE IF NOT EXISTS auth_webauthn_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- For now, single architect identity
  credential_id BYTEA NOT NULL, -- Base64 encoded credential ID
  public_key BYTEA NOT NULL, -- Base64 encoded public key
  counter BIGINT NOT NULL DEFAULT 0,
  transports JSONB, -- Array of transport methods (usb, nfc, ble, internal)
  aaguid TEXT, -- Authenticator Attestation Globally Unique Identifier
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credentials_id ON auth_webauthn_credentials(credential_id);
CREATE INDEX IF NOT EXISTS idx_credentials_user ON auth_webauthn_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_credentials_active ON auth_webauthn_credentials(user_id, revoked_at) WHERE revoked_at IS NULL;

-- Session Storage
-- Server-side session records for authenticated architect sessions
CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE, -- Random session ID stored in cookie
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_id ON auth_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON auth_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON auth_sessions(session_id, expires_at, revoked_at) WHERE revoked_at IS NULL;

-- Audit Log
-- Comprehensive audit trail for all authentication events
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type TEXT NOT NULL,
  user_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_ts ON auth_audit_log(ts);
CREATE INDEX IF NOT EXISTS idx_audit_type ON auth_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_user ON auth_audit_log(user_id) WHERE user_id IS NOT NULL;

-- Event types for audit log:
-- REG_OPTIONS, REG_VERIFY_OK, REG_VERIFY_FAIL, REG_VERIFY_ATTESTATION_DENIED
-- AUTH_OPTIONS, AUTH_VERIFY_OK, AUTH_VERIFY_FAIL, AUTH_VERIFY_COUNTER_MISMATCH
-- SESSION_CREATED, SESSION_REVOKED, SESSION_EXPIRED, SESSION_VALIDATION_FAIL
-- LOGOUT
