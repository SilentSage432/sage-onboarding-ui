"use client";

import { useWizardStore } from "../store/useWizardStore";
import WizardNav from "./WizardNav";
import WizardStep from "./WizardStep";

export default function WizardShell() {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8 bg-[#111316] p-12 rounded-xl border border-white/10 shadow-xl">
      <WizardStep />
      <WizardNav />
    </div>
  );
}


