"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWizardStore } from "../../store/useWizardStore";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";

/**
 * Rho² Verification Card (Development Scaffolding)
 * 
 * TODO: Replace simulated Rho² attestation with real WebAuthn + server-side verification.
 * This currently establishes architect perspective for development/testing only.
 * 
 * In production, this should:
 * - Use @simplewebauthn/browser for WebAuthn credential creation/assertion
 * - Verify attestation/assertion on server-side
 * - Only set architect perspective after cryptographic proof
 */
export function Rho2VerificationCard() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const { setStepIndex, stepIndex } = useWizardStore();
  const { setSystemPerspective } = useReadinessStore();

  const handleVerify = () => {
    setVerifying(true);
    // Simulated attestation - no actual cryptographic operation
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      // Set architect perspective on simulated attestation success
      // This makes architect-only modules visible (existence, not unlocking)
      // TODO: Replace with real WebAuthn verification before setting architect perspective
      setSystemPerspective('architect');
    }, 1500);
  };

  const handleContinue = () => {
    setStepIndex(stepIndex + 1);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-medium tracking-wide flex items-center gap-2 text-white">
          <ShieldCheck className="h-6 w-6 text-green-400" />
          Rho² Sovereign Security
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-white/80">
        <p className="leading-relaxed">
          Rho² is SAGE's mandatory cryptographic identity layer.  
          It ensures integrity, authenticity, and agent identity across your entire ecosystem.  
          This step must be completed before activation can proceed.
        </p>
        <p className="text-xs text-slate-500 italic">
          Note: Currently using simulated attestation for development. Real WebAuthn verification will be implemented in production.
        </p>

        {!verified && (
          <Button
            onClick={handleVerify}
            disabled={verifying}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-semibold"
          >
            {verifying ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying Rho²…
              </span>
            ) : (
              "Begin Rho² Verification"
            )}
          </Button>
        )}

        {verified && (
          <Button
            onClick={handleContinue}
            className="w-full bg-blue-500 hover:bg-blue-400 text-black font-semibold"
          >
            Rho² Verified — Continue
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

