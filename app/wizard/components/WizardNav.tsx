"use client";

import { useWizardStore } from "../store/useWizardStore";

export default function WizardNav() {
  const { next, prev, step, totalSteps } = useWizardStore();

  return (
    <div className="flex justify-between">
      <button disabled={step === 1} onClick={prev}>
        Prev
      </button>
      <button disabled={step === totalSteps} onClick={next}>
        Next
      </button>
    </div>
  );
}


