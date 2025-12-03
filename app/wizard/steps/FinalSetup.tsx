"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statusMessages = [
  "Provisioning secure environment…",
  "Configuring identity keys…",
  "Optimizing runtime modules…",
  "Activating mesh interfaces…",
  "Finalizing system parameters…",
];

export default function FinalSetup({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < statusMessages.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 1400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const complete = step === statusMessages.length - 1;

  return (
    <Card className="bg-white/10 border-white/10 backdrop-blur-xl w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Preparing your environment…
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 text-center">
        <div className="text-lg text-white/80 transition-all">
          {statusMessages[step]}
        </div>
        <div className="w-full bg-white/10 h-2 rounded overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{
              width: `${((step + 1) / statusMessages.length) * 100}%`,
            }}
          />
        </div>
        {complete && (
          <Button className="mt-6" onClick={onFinish}>
            Enter Console
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

