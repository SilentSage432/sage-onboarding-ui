"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WizardPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl bg-black/40 backdrop-blur border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            SAGE Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-300">
            Let's get started.
          </p>
          <div className="text-center text-gray-400 text-xs uppercase tracking-wide">
            Step 1 / 4
          </div>
          <Button className="w-full">
            Next →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
