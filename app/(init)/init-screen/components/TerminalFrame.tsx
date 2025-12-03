"use client";

export default function TerminalFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-4xl bg-[#0a0d14] border border-white/10 rounded-lg shadow-[0_0_40px_rgba(120,70,255,0.2)] overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <div className="ml-4 text-xs text-white/60 font-mono">
          SAGE Federation Initialization
        </div>
      </div>

      {/* Terminal Content */}
      <div className="bg-[#05070d] relative">{children}</div>
    </div>
  );
}

