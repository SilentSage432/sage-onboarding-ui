"use client";

import { useWizardStore } from "../store/useWizardStore";
import WizardStep from "./WizardStep";
import WizardNav from "./WizardNav";

export default function WizardShell() {
  const { step, totalSteps } = useWizardStore();

  return (
    <div className="flex flex-col gap-8">
      {/* Title + subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200 tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-300 animate-pulse" />
          <span>Gateway to Eldrath Mesh</span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
          Initialize your SAGE Onboarding Ritual
        </h1>
        <p className="text-sm md:text-base text-white/60 max-w-xl">
          This wizard will bind your operator identity and tenant into the SAGE mesh,
          step by step. Nothing here talks to the backend yet – this is the visual shell.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between text-xs md:text-sm text-white/50">
        <div className="flex items-center gap-2">
          <span className="font-mono text-white/70">
            Step {step} / {totalSteps}
          </span>
          <span className="h-px w-10 bg-white/15" />
          <span className="hidden sm:inline">
            {step === 1 && "Operator & path selection"}
            {step === 2 && "Tenant & realm definition"}
            {step === 3 && "Mesh access & agent roles"}
            {step === 4 && "Review & commit to the code"}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const idx = i + 1;
            const isActive = idx === step;
            return (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  isActive ? "w-6 bg-violet-300" : "w-2 bg-white/20"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main step content card */}
      <div className="rounded-2xl border border-white/10 bg-black/50 px-6 py-10 md:px-10 md:py-12">
        <WizardStep />
      </div>

      {/* Navigation row */}
      <WizardNav />
    </div>
  );
}


