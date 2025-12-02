"use client";

import WizardShell from "@/app/wizard/components/WizardShell";

export default function WizardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center -mt-10">
      <div className="max-w-[500px] w-full px-4 animate-in fade-in zoom-in duration-300">
        <WizardShell />
      </div>
    </div>
  );
}
