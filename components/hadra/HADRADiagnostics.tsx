"use client";

export default function HADRADiagnostics() {
  return (
    <div className="p-6 space-y-4 text-white/80">
      <h2 className="text-2xl font-semibold text-indigo-300">System Diagnostics</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
          <div className="text-sm text-white/50">CPU Load</div>
          <div className="text-xl">—</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
          <div className="text-sm text-white/50">Memory Usage</div>
          <div className="text-xl">—</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-lg col-span-2">
          <div className="text-sm text-white/50">Rho² Integrity</div>
          <div className="text-xl text-indigo-300">Verified</div>
        </div>
      </div>

      <div className="mt-6 text-sm text-white/40">
        Live telemetry will activate once onboarding is complete.
      </div>
    </div>
  );
}
