"use client";

import type { SignalEmitter } from "@/lib/signals/types";

export default function ArcTelemetryReadout({
  signal,
}: {
  signal: SignalEmitter | null;
}) {
  if (!signal) return null;

  return (
    <div className="pt-4 border-t border-white/10 space-y-2 w-full">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm">Telemetry</span>
        <span className="text-gray-500 text-xs font-mono">{signal.timestamp}</span>
      </div>
      <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words bg-black/20 border border-white/10 rounded-lg p-3 w-full">
        {JSON.stringify(signal, null, 2)}
      </pre>
    </div>
  );
}

