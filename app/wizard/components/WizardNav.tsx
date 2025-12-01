"use client";

import { useWizardStore } from "../store/useWizardStore";

export default function WizardNav() {
  const { step, totalSteps, next, prev } = useWizardStore();

  const isFirst = step === 1;
  const isLast = step === totalSteps;

  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
      <button
        type="button"
        onClick={prev}
        disabled={isFirst}
        className={`px-4 py-2 rounded-full text-sm transition-all ${
          isFirst
            ? "text-white/25 border border-white/10 cursor-default"
            : "text-white/70 border border-white/25 hover:border-white/60 hover:text-white"
        }`}
      >
        Prev
      </button>

      <button
        type="button"
        onClick={next}
        className={`px-6 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-400 to-emerald-400 text-black shadow-lg shadow-violet-500/30 hover:shadow-emerald-400/40 transform hover:-translate-y-[1px] transition-all ${
          isLast ? "opacity-90" : ""
        }`}
      >
        {isLast ? "Finish ritual" : "Next step"}
      </button>
    </div>
  );
}
