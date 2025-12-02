"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center -mt-10">
      <div className="max-w-[500px] bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] rounded-2xl py-16 px-14 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col space-y-6">
          {/* Title */}
          <h2 className="text-[28px] font-semibold text-white">
            SAGE Onboarding
          </h2>

          {/* Subtitle */}
          <p className="text-[16px] text-neutral-400 text-center">
            Let's get started.
          </p>

          {/* Step Indicator */}
          <div className="text-center text-xs tracking-wider text-neutral-400 uppercase">
            Step {currentStep} / {totalSteps}
          </div>

          {/* Button Group */}
          <div className="flex gap-3">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-medium transition-all duration-150"
            >
              ← Prev
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === totalSteps}
              className="flex-1 h-12 rounded-xl bg-white/10 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-medium transition-all duration-150"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
