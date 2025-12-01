"use client";

import { useWizardStore } from "../store/useWizardStore";
import WizardNav from "./WizardNav";
import WizardStep from "./WizardStep";

export default function WizardShell() {
  const { step } = useWizardStore();

  return (
    <div className="flex flex-col items-center w-full max-w-2xl space-y-6 bg-[#111316] p-10 rounded-xl border border-white/10 shadow-xl">
      <WizardStep step={step} />
      <WizardNav />
    </div>
  );
}


