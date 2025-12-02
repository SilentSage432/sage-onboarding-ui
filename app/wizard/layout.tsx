"use client";

import { type ReactNode } from "react";

export default function WizardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-3xl p-10">
        {children}
      </div>
    </div>
  );
}
