'use client';

import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top chrome */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/30 backdrop-blur-md">
        <div className="text-sm tracking-[0.25em] uppercase text-white/60">
          SAGE Onboarding
        </div>
        <div className="flex items-center gap-6 text-xs text-white/50">
          <span className="hidden md:inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
            <span>Mesh link idle</span>
          </span>
          <span className="hidden md:inline text-white/40">
            Operator&nbsp;prime
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}

