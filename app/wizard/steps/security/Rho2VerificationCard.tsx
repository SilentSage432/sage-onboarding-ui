"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useWizardStore } from "../../store/useWizardStore";

export function Rho2VerificationCard() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const { setStepIndex, stepIndex } = useWizardStore();

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
  };

  const handleContinue = () => {
    setStepIndex(stepIndex + 1);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 text-white">
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

