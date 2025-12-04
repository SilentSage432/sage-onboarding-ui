"use client";

export default function TerminalFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(80,0,255,0.2)] p-6 h-[520px]">
      {/* Subtle loading glow */}
      <div className="absolute inset-0 rounded-2xl bg-purple-500/5 blur-2xl pointer-events-none" />
      
      {/* SAGE-native header */}
      <div className="text-lg font-semibold text-white/90 mb-4 tracking-wide relative z-10">
        SAGE Federation Initialization
      </div>

      {/* Terminal Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

