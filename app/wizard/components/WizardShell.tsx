"use client";

import { useWizardStore } from "../store/useWizardStore";
import WizardNav from "./WizardNav";
import WizardStep from "./WizardStep";

export default function WizardShell() {
  const { step } = useWizardStore();

  return (
    <div className="flex flex-col w-full max-w-2xl gap-6">
      <WizardStep step={step} />
      <WizardNav />
    </div>
  );
}


