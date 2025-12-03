import React from "react";

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50 flex items-center justify-center overflow-hidden">
      {/* Neural Mesh Background */}
      <div className="sage-mesh-bg" />
      <div className="sage-mesh-glow" />
      
      {/* Soft vignette / focus area */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Subtle radial glow behind the wizard shell */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl opacity-60" />
        </div>
        {/* Content */}
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
