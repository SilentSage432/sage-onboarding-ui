"use client";

import { useWizardStore } from "../store/useWizardStore";

export default function WizardStep() {
  const { step } = useWizardStore();

  return (
    <div className="space-y-4 text-center md:text-left">
      <h2 className="text-xl md:text-2xl font-semibold">
        {step === 1 && "Choose your onboarding path"}
        {step === 2 && "Describe your realm (tenant)"}
        {step === 3 && "Define agents and access lanes"}
        {step === 4 && "Review your ritual before binding"}
      </h2>
      <p className="text-sm md:text-base text-white/60 max-w-2xl mx-auto md:mx-0">
        Step {step} placeholder — this is where we will later plug in the real
        forms, toggles, and Eldrath-flavored content. For now we just need the
        layout, typography, and flow to feel right.
      </p>
    </div>
  );
}

