"use client";

import { useState, useEffect, useRef } from "react";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, LogOut, CheckCircle2, XCircle, Clock } from "lucide-react";

interface SessionStatus {
  authenticated: boolean;
  userId?: string;
}

export default function GovernancePanel() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Hard execution lock for registration - prevents concurrent executions
  const registrationLockRef = useRef(false);

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

    // Acquire lock
    registrationLockRef.current = true;
    setIsRegistering(true);
    setError(null);
    setSuccess(null);

    try {
      // Step 1: Get registration options (exactly once per click)
      const optionsResponse = await fetch("/api/auth/webauthn/register/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!optionsResponse.ok) {
        const errorData = await optionsResponse.json();
        throw new Error(errorData.error || "Failed to get registration options");
      }

      const options = await optionsResponse.json();
      
      // Preserve challenge through the full flow
      // The challenge is embedded in the options object and will be included in the response

      // Step 2: Start registration with browser API
      // This will use the challenge from options
      const attestationResponse = await startRegistration(options);

      // Step 3: Verify registration with the preserved challenge
      const verifyResponse = await fetch("/api/auth/webauthn/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attestationResponse }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || "Registration verification failed");
      }

      setSuccess("YubiKey registered successfully!");
      await checkSessionStatus();
    } catch (error) {
      console.error("Registration error:", error);
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
        <CardContent>
          <Button
            onClick={handleRegister}
            disabled={isRegistering || registrationLockRef.current}
            className="w-full"
          >
            {isRegistering ? "Registering..." : "Register YubiKey"}
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
    </div>
  );
}
