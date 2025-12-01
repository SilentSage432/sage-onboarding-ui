"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";

export default function WizardShell() {
  const { step, totalSteps, next, prev } = useWizardStore();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#05070c] via-[#0b0e18] to-[#06070d] text-white px-6 py-12">
      <Card className="w-full max-w-3xl border border-zinc-800 bg-black/40 backdrop-blur-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold tracking-wide">
            Initialize your SAGE Onboarding Ritual
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <p className="text-sm text-zinc-400">
            Binding operator identity with the Eldrath Mesh…
          </p>

          <div className="py-10">
            <span className="text-xl font-medium opacity-90">
              Step {step} / {totalSteps}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" disabled={step === 1} onClick={prev}>
              Prev
            </Button>
            <Button onClick={next}>
              Next Step
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



