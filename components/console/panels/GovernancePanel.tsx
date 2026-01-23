"use client";

import { useState, useEffect, useRef } from "react";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, LogOut, CheckCircle2, XCircle, Clock, Copy, Activity, Server, Globe } from "lucide-react";
import ArchitectOnly from "@/components/console/ArchitectOnly";

interface SessionStatus {
  authenticated: boolean;
  userId?: string;
}

type RegistrationStatus = 
  | 'idle'
  | 'awaiting_security_key'
  | 'awaiting_pin'
  | 'verifying_credential'
  | 'rejected_not_trusted'
  | 'registered';

export default function GovernancePanel() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>('idle');
  const [rejectedAaguid, setRejectedAaguid] = useState<string | null>(null);
  
  // Hard execution lock for registration - prevents concurrent executions
  const registrationLockRef = useRef(false);
  // Track active challenge to prevent reuse
  const activeChallengeRef = useRef<string | null>(null);

  // Check session status on mount
  useEffect(() => {
    checkSessionStatus();
  }, []);

  const checkSessionStatus = async () => {
    try {
      const response = await fetch("/api/auth/session");
      
      // Check if response is OK and content-type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      
      const data = await response.json();
      setSessionStatus(data);
    } catch (error) {
      console.error("Failed to check session status:", error);
      setSessionStatus({ authenticated: false });
    }
  };

  const handleRegister = async () => {
    // Hard execution lock - prevent concurrent executions
    if (registrationLockRef.current) {
      console.warn("Registration already in progress, ignoring duplicate call");
      return;
    }

    // Invalidate any previous challenge state
    activeChallengeRef.current = null;
    setRejectedAaguid(null);

    // Acquire lock
    registrationLockRef.current = true;
    setIsRegistering(true);
    setError(null);
    setSuccess(null);
    setRegistrationStatus('idle');

    try {
      // Step 1: Get registration options (exactly once per click)
      setRegistrationStatus('awaiting_security_key');
      const optionsResponse = await fetch("/api/auth/webauthn/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(errorData.error || "Failed to get registration options");
      }

      const options = await optionsResponse.json();
      
      // Store challenge to track active registration
      activeChallengeRef.current = options.challenge;
      
      // Preserve challenge through the full flow
      // The challenge is embedded in the options object and will be included in the response

      // Step 2: Start registration with browser API
      // This will use the challenge from options
      // Browser may prompt for PIN - status will show "awaiting_pin" if needed
      setRegistrationStatus('awaiting_pin');
      const attestationResponse = await startRegistration(options);

      // Step 3: Verify registration with the preserved challenge
      setRegistrationStatus('verifying_credential');
      const verifyResponse = await fetch("/api/auth/webauthn/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attestationResponse }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        
        // Invalidate challenge on any error (400, 403, etc.)
        activeChallengeRef.current = null;
        
        // Handle AAGUID allowlist rejection specially
        if (verifyResponse.status === 403 && errorData.aaguid) {
          setRejectedAaguid(errorData.aaguid);
          setRegistrationStatus('rejected_not_trusted');
          // Don't throw - let the UI show the rejection state
          return;
        }
        
        // Other errors - invalidate and show error
        let errorMessage = errorData.error || "Registration verification failed";
        if (errorData.message) {
          errorMessage += `\n\n${errorData.message}`;
        }
        throw new Error(errorMessage);
      }

      // Success - clear challenge and update status
      activeChallengeRef.current = null;
      setRegistrationStatus('registered');
      setSuccess("YubiKey registered successfully!");
      await checkSessionStatus();
    } catch (error) {
      console.error("Registration error:", error);
      // Invalidate challenge on any error
      activeChallengeRef.current = null;
      setRegistrationStatus('idle');
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      // Release lock
      registrationLockRef.current = false;
      setIsRegistering(false);
    }
  };

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Get authentication options
      const optionsResponse = await fetch("/api/auth/webauthn/authenticate/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(errorData.error || "Failed to get authentication options");
      }

      const options = await optionsResponse.json();

      // Step 2: Start authentication with browser API
      const assertionResponse = await startAuthentication(options);

      // Step 3: Verify authentication
      const verifyResponse = await fetch("/api/auth/webauthn/authenticate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: assertionResponse }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || "Authentication verification failed");
      }

      setSuccess("Authentication successful! Architect session active.");
      await checkSessionStatus();
      
      // Reload page to update systemPerspective
      window.location.reload();
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setSuccess("Logged out successfully");
      await checkSessionStatus();
      
      // Reload page to update systemPerspective
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      setError(error instanceof Error ? error.message : "Logout failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Architect Authentication</h2>
        <p className="text-muted-foreground">
          Manage YubiKey registration and architect session access.
        </p>
      </div>

      {/* Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Session Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionStatus ? (
            <div className="flex items-center gap-3">
              {sessionStatus.authenticated ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <Badge variant="default" className="bg-green-500">
                      Active Architect Session
                    </Badge>
                    {sessionStatus.userId && (
                      <p className="text-sm text-muted-foreground mt-1">
                        User: {sessionStatus.userId}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  <Badge variant="secondary">No Active Session</Badge>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Checking status...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Register YubiKey
          </CardTitle>
          <CardDescription>
            Register a new YubiKey for architect authentication. Only YubiKeys in the
            allowlist will be accepted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          {registrationStatus !== 'idle' && (
            <div className="text-sm text-muted-foreground">
              Status: {
                registrationStatus === 'awaiting_security_key' && 'Awaiting Security Key...'
                || registrationStatus === 'awaiting_pin' && 'Awaiting PIN...'
                || registrationStatus === 'verifying_credential' && 'Verifying Credential...'
                || registrationStatus === 'rejected_not_trusted' && 'Rejected (Not Trusted)'
                || registrationStatus === 'registered' && 'Registered'
                || 'Processing...'
              }
            </div>
          )}

          {/* AAGUID Rejection Message */}
          {registrationStatus === 'rejected_not_trusted' && rejectedAaguid && (
            <Card className="border-yellow-500 bg-yellow-500/10">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Shield className="h-5 w-5" />
                    <p className="font-semibold">This security key is not yet trusted by the system.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Detected AAGUID:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-background border rounded text-sm font-mono break-all">
                        {rejectedAaguid}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(rejectedAaguid);
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add this AAGUID to <code className="px-1 py-0.5 bg-background rounded text-xs">WEBAUTHN_AAGUID_ALLOWLIST</code> in <code className="px-1 py-0.5 bg-background rounded text-xs">.env.local</code> and restart the server.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleRegister}
            disabled={isRegistering || activeChallengeRef.current !== null}
            className="w-full"
          >
            {isRegistering 
              ? registrationStatus === 'awaiting_security_key' && "Awaiting Security Key..."
              || registrationStatus === 'awaiting_pin' && "Awaiting PIN..."
              || registrationStatus === 'verifying_credential' && "Verifying Credential..."
              || "Registering..."
              : "Register YubiKey"
            }
          </Button>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authenticate
          </CardTitle>
          <CardDescription>
            Authenticate with your registered YubiKey to activate architect session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleAuthenticate}
            disabled={isAuthenticating || !sessionStatus?.authenticated === false}
            className="w-full"
            variant={sessionStatus?.authenticated ? "secondary" : "default"}
          >
            {isAuthenticating
              ? "Authenticating..."
              : sessionStatus?.authenticated
              ? "Re-authenticate"
              : "Authenticate with YubiKey"}
          </Button>
        </CardContent>
      </Card>

      {/* Logout */}
      {sessionStatus?.authenticated && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Logout
            </CardTitle>
            <CardDescription>
              Revoke your architect session and return to operator perspective.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error/Success Messages */}
      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              <p>{success}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Architect Diagnostics - Architect Only */}
      <ArchitectOnly>
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Architect Diagnostics
            </CardTitle>
            <CardDescription>
              Internal system state and session metadata (read-only)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Metadata */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Session Metadata</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={sessionStatus?.authenticated ? "default" : "secondary"}>
                    {sessionStatus?.authenticated ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {sessionStatus?.userId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <code className="text-xs">{sessionStatus.userId}</code>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Check:</span>
                  <span className="text-xs text-muted-foreground">
                    {sessionStatus ? "Connected" : "Checking..."}
                  </span>
                </div>
              </div>
            </div>

            {/* WebAuthn / YubiKey Status */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">WebAuthn Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration:</span>
                  <Badge variant={registrationStatus === 'registered' ? "default" : "secondary"}>
                    {registrationStatus === 'registered' ? "Registered" : "Not Registered"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Authentication:</span>
                  <Badge variant={sessionStatus?.authenticated ? "default" : "secondary"}>
                    {sessionStatus?.authenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                </div>
                {registrationStatus === 'rejected_not_trusted' && rejectedAaguid && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AAGUID:</span>
                    <code className="text-xs text-yellow-400">{rejectedAaguid}</code>
                  </div>
                )}
              </div>
            </div>

            {/* Environment Flags */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Environment</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode:</span>
                  <Badge variant={process.env.NODE_ENV === 'production' ? "default" : "secondary"}>
                    {process.env.NODE_ENV === 'production' ? "Production" : "Development"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Origin:</span>
                  <code className="text-xs text-muted-foreground">
                    {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Localhost:</span>
                  <Badge variant={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "default" : "secondary"}>
                    {typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* System Status Snapshot */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">System Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Console:</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WebAuthn RP ID:</span>
                  <code className="text-xs text-muted-foreground">
                    {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ArchitectOnly>
    </div>
  );
}
