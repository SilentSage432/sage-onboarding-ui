"use client";

export default function HadraPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* HADRA content container */}
      <div className="relative z-50 rounded-2xl bg-[#0b0f17] p-8 w-[48rem] max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-white mb-4">
          HADRA-01 Diagnostic Console
        </h2>

        {/* Placeholder for future autonomous content */}
        <p className="text-gray-400">
          HADRA-01 is initializing…  
          (Full diagnostic UI will be part of Phase D)
        </p>
      </div>
    </div>
  );
}

