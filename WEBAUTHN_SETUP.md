# WebAuthn Authentication Setup Guide

## Overview

Production-grade WebAuthn (YubiKey) authentication for Architect perspective access. This implementation provides server-enforced authorization with database-backed sessions.

## Prerequisites

1. **PostgreSQL Database**: `sage_os` database must be accessible
2. **Dependencies**: Install required packages (see below)
3. **Environment Variables**: Configure all required env vars (see below)
4. **HTTPS**: WebAuthn requires HTTPS in production (localhost is allowed for development)

## Installation

### 1. Install Dependencies

```bash
npm install @simplewebauthn/server pg @types/pg
```

### 2. Database Setup

Run the schema migration:

```bash
psql -d sage_os -f lib/db/schema.sql
```

Or manually execute the SQL in `lib/db/schema.sql` to create:
- `auth_webauthn_challenges` - Temporary challenge storage
- `auth_webauthn_credentials` - Registered YubiKey credentials
- `auth_sessions` - Server-side session records
- `auth_audit_log` - Comprehensive audit trail

### 3. Environment Variables

Create a `.env.local` file (or set in your deployment environment):

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sage_os

# WebAuthn Configuration
WEBAUTHN_RP_ID=localhost                    # For localhost development
# WEBAUTHN_RP_ID=yourdomain.com             # For production
WEBAUTHN_RP_NAME=SAGE OS
WEBAUTHN_ORIGIN=http://localhost:3000      # For localhost development
# WEBAUTHN_ORIGIN=https://yourdomain.com     # For production

# Session Security
SESSION_SECRET=your-random-secret-here-min-32-chars

# YubiKey AAGUID Allowlist (comma-separated)
# Get AAGUIDs from: https://fidoalliance.org/metadata/
# Example YubiKey 5 AAGUID: f8a011f3-8c0a-4b2f-9b7c-4e8d9e0f1a2b
WEBAUTHN_AAGUID_ALLOWLIST=f8a011f3-8c0a-4b2f-9b7c-4e8d9e0f1a2b,another-aaguid-here
```

**Important Security Notes:**
- `SESSION_SECRET` must be at least 32 characters, randomly generated
- `WEBAUTHN_AAGUID_ALLOWLIST` must be set - empty allowlist = deny all (fail closed)
- In production, use HTTPS and set `WEBAUTHN_ORIGIN` to your actual domain
- `WEBAUTHN_RP_ID` must match your domain (without protocol/port)

## Architecture

### Database Schema

All tables use the `public` schema (search_path enforced):

- **auth_webauthn_challenges**: Temporary challenges (5-minute expiry)
- **auth_webauthn_credentials**: Registered YubiKey credentials with counter
- **auth_sessions**: Server-side sessions (12-hour TTL, httpOnly cookies)
- **auth_audit_log**: Complete audit trail of all auth events

### API Endpoints

#### Registration Flow
1. `POST /api/auth/webauthn/register/options` - Generate registration challenge
2. `POST /api/auth/webauthn/register/verify` - Verify and store credential

#### Authentication Flow
1. `POST /api/auth/webauthn/authenticate/options` - Generate authentication challenge
2. `POST /api/auth/webauthn/authenticate/verify` - Verify and create session

#### Session Management
- `GET /api/auth/session` - Check session status
- `POST /api/auth/logout` - Revoke session
- `GET /api/architect/bootstrap` - Server-side architect check (used by console layout)

#### Protected Routes
- `GET /api/architect/protected` - Example protected route (requires architect session)

### Security Features

1. **Rate Limiting**: All auth endpoints have rate limits (5-20 requests/minute)
2. **Challenge Expiry**: Challenges expire after 5 minutes
3. **Counter Validation**: Prevents replay attacks (counter must increase)
4. **AAGUID Allowlist**: Only YubiKeys in allowlist can register (fail-closed)
5. **Session Security**: httpOnly, Secure, SameSite=Strict cookies
6. **Server-Side Enforcement**: `requireArchitectSession()` protects routes
7. **Audit Logging**: All events logged with IP, user agent, metadata

## Usage

### 1. Register YubiKey

1. Navigate to Console → Governance panel
2. Click "Register YubiKey"
3. Insert and touch your YubiKey when prompted
4. If AAGUID is in allowlist, registration succeeds

### 2. Authenticate

1. Navigate to Console → Governance panel
2. Click "Authenticate with YubiKey"
3. Insert and touch your YubiKey when prompted
4. Session is created and `systemPerspective` is set to `'architect'`
5. Architect-only modules (e.g., Rho² Keyring) become visible

### 3. Logout

1. Navigate to Console → Governance panel
2. Click "Logout"
3. Session is revoked and `systemPerspective` returns to `'operator'`

## Testing

### Localhost Testing

1. **Setup**: Use `WEBAUTHN_RP_ID=localhost` and `WEBAUTHN_ORIGIN=http://localhost:3000`
2. **Browser**: Chrome/Edge recommended (best WebAuthn support)
3. **YubiKey**: Insert YubiKey, touch when prompted

### Production Testing (HTTPS Required)

1. **Setup**: Use your actual domain for `WEBAUTHN_RP_ID` and `WEBAUTHN_ORIGIN`
2. **HTTPS**: WebAuthn requires HTTPS (except localhost)
3. **YubiKey**: Same as localhost - insert and touch

### Test Scenarios

1. **Registration**: Register new YubiKey → Should succeed if AAGUID allowed
2. **Authentication**: Authenticate with registered key → Should create session
3. **Replay Attack**: Reuse old challenge → Should fail (challenge already used)
4. **Expired Challenge**: Use challenge after 5 minutes → Should fail
5. **Counter Mismatch**: Replay authentication response → Should fail
6. **Wrong Origin**: Modify origin in request → Should fail (WebAuthn verification)
7. **Unauthorized AAGUID**: Register key not in allowlist → Should fail (403)
8. **Session Validation**: Access protected route without session → Should redirect/login

## YubiKey AAGUID Lookup

To find your YubiKey's AAGUID:

1. Register the key (will fail if not in allowlist)
2. Check audit log: `SELECT * FROM auth_audit_log WHERE event_type = 'REG_VERIFY_ATTESTATION_DENIED' ORDER BY ts DESC LIMIT 1;`
3. The `metadata` JSONB field will contain the AAGUID
4. Add AAGUID to `WEBAUTHN_AAGUID_ALLOWLIST`

Or use FIDO Alliance metadata service:
- https://fidoalliance.org/metadata/

## Troubleshooting

### "Challenge not found" Error
- Challenge expired (5-minute TTL)
- Challenge already used (one-time use)
- Wrong challenge value in request

### "AAGUID not in allowlist" Error
- YubiKey AAGUID not in `WEBAUTHN_AAGUID_ALLOWLIST`
- Check audit log for actual AAGUID
- Add AAGUID to allowlist and retry

### "Counter mismatch" Error
- Replay attack detected
- Credential counter did not increase
- Check credential counter in database

### "Rate limit exceeded" Error
- Too many requests in short time window
- Wait 1 minute and retry
- Check rate limit config in `lib/auth/rate-limit.ts`

### Session Not Persisting
- Check cookie settings (httpOnly, Secure, SameSite)
- Verify `SESSION_SECRET` is set
- Check database connection
- Verify session exists in `auth_sessions` table

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Verify database `sage_os` exists
- Check `search_path` is set to `public`

## Security Checklist

- [ ] `SESSION_SECRET` is 32+ random characters
- [ ] `WEBAUTHN_AAGUID_ALLOWLIST` is set (not empty)
- [ ] HTTPS enabled in production
- [ ] `WEBAUTHN_RP_ID` matches your domain
- [ ] `WEBAUTHN_ORIGIN` matches your domain
- [ ] Database credentials are secure
- [ ] Rate limiting is enabled
- [ ] Audit logging is working
- [ ] Sessions expire after 12 hours
- [ ] Server-side authorization is enforced

## Files Changed/Added

### Database
- `lib/db/schema.sql` - Complete database schema
- `lib/db/migrations/001_initial_webauthn.sql` - Migration file
- `lib/db/client.ts` - Postgres client with connection pooling

### Authentication Core
- `lib/auth/webauthn.ts` - WebAuthn configuration and utilities
- `lib/auth/session.ts` - Session management (DB-backed)
- `lib/auth/audit.ts` - Audit logging
- `lib/auth/authorization.ts` - Server-side authorization helpers
- `lib/auth/rate-limit.ts` - Rate limiting

### API Routes
- `app/api/auth/webauthn/register/options/route.ts` - Registration options
- `app/api/auth/webauthn/register/verify/route.ts` - Registration verification
- `app/api/auth/webauthn/authenticate/options/route.ts` - Authentication options
- `app/api/auth/webauthn/authenticate/verify/route.ts` - Authentication verification
- `app/api/auth/logout/route.ts` - Logout endpoint
- `app/api/auth/session/route.ts` - Session status
- `app/api/architect/bootstrap/route.ts` - Architect bootstrap (console integration)
- `app/api/architect/protected/route.ts` - Example protected route

### UI Components
- `components/console/panels/GovernancePanel.tsx` - Governance panel UI

### Integration
- `lib/console/moduleRegistry.tsx` - Added Governance module
- `app/(os)/console/layout.tsx` - Added architect session check on boot

## Observational Layers

**Confirmed**: No modifications to the seven observational layers:
- ✅ `lib/console/observationVocabulary.ts` - Untouched
- ✅ `lib/console/temporalFraming.ts` - Untouched
- ✅ `lib/console/observationProvenance.ts` - Untouched
- ✅ `lib/console/queryComposition.ts` - Untouched
- ✅ `lib/console/observationAggregation.ts` - Untouched
- ✅ `lib/console/groupCharacterization.ts` - Untouched
- ✅ `lib/console/useObservationBridge.ts` - Untouched

## Next Steps

1. Install dependencies: `npm install @simplewebauthn/server pg @types/pg`
2. Run database migration: `psql -d sage_os -f lib/db/schema.sql`
3. Set environment variables (see above)
4. Test registration with YubiKey
5. Test authentication flow
6. Verify architect perspective is set correctly
7. Test protected routes

## Production Deployment

1. Use environment variables (never commit secrets)
2. Enable HTTPS (required for WebAuthn)
3. Set proper `WEBAUTHN_RP_ID` and `WEBAUTHN_ORIGIN`
4. Configure YubiKey AAGUID allowlist
5. Set strong `SESSION_SECRET`
6. Monitor audit logs for security events
7. Set up database backups
8. Configure rate limiting (consider Redis for distributed systems)
