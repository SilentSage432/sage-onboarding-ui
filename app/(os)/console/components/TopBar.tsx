"use client";

export default function TopBar() {
  return (
    <div className="w-full h-12 flex justify-between items-center px-6 border-b border-white/5 bg-[#080b11]/60 backdrop-blur-md select-none">
      <div className="flex items-center gap-2 text-slate-300">
        <div className="flex items-center gap-1">
          <span className="text-[10px] tracking-wider uppercase text-slate-500">Rho² Secure Channel</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <span className="text-xs text-green-400/90 font-medium">Active</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Federation Verified</span>
        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(80,130,255,0.6)] animate-[sage-verified-pulse_2.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}


