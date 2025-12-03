"use client";

import { useOnboardingDataStore } from "@/app/wizard/store/useOnboardingDataStore";

export default function TopBar() {
  const data = useOnboardingDataStore();
  const organizationName = data.business.orgName || "SAGE Enterprise";
  const operatorName = "Operator"; // Can be enhanced later

  return (
    <header className="w-full h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl">
      {/* Org */}
      <div className="text-white/80 tracking-wide text-sm font-medium">
        {organizationName}
      </div>

      {/* Rho² Status + Operator */}
      <div className="flex items-center gap-4">
        {/* System Pulse Indicator */}
        <div className="flex items-center gap-2">
          <span className="animate-pulse text-green-400 text-xs">●</span>
          <span className="text-white/50 text-xs">Live</span>
        </div>

        {/* Rho² Status */}
        <span className="px-3 py-1 text-xs border border-white/20 rounded-full text-white/60">
          Rho² Verified
        </span>

        {/* Operator */}
        <div className="text-white/50 text-xs">
          {operatorName}
        </div>
      </div>
    </header>
  );
}

