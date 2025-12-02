"use client";

import { Button } from "@/components/ui/button";

export default function ConsolePage() {
  return (
    <div className="flex min-h-screen items-center justify-center -mt-10 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[600px] w-full px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] rounded-2xl py-16 px-14">
          <div className="flex flex-col space-y-8">
            {/* Title */}
            <div className="text-center space-y-3 animate-fade-in">
              <h1 className="text-[32px] font-semibold text-white">
                Welcome to SAGE
              </h1>
              <p className="text-[16px] text-neutral-400">
                Your system is ready.
              </p>
            </div>

            {/* Command Bar */}
            <div className="animate-fade-in" style={{ "--delay": "100ms" } as React.CSSProperties}>
              <div className="w-full h-12 rounded-xl bg-white/5 border border-white/10 flex items-center px-4 text-neutral-400 text-sm">
                Enter a command…
              </div>
            </div>

            {/* Button Tiles */}
            <div className="grid grid-cols-1 gap-3 animate-fade-in" style={{ "--delay": "150ms" } as React.CSSProperties}>
              <Button
                className="w-full h-14 rounded-xl bg-white/10 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white text-[15px] font-medium transition-all duration-150 justify-start px-6"
              >
                <span className="flex-1 text-left">Command Console</span>
                <span className="text-neutral-400">→</span>
              </Button>
              
              <Button
                className="w-full h-14 rounded-xl bg-white/10 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white text-[15px] font-medium transition-all duration-150 justify-start px-6"
              >
                <span className="flex-1 text-left">Modules</span>
                <span className="text-neutral-400">→</span>
              </Button>
              
              <Button
                className="w-full h-14 rounded-xl bg-white/10 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white text-[15px] font-medium transition-all duration-150 justify-start px-6"
              >
                <span className="flex-1 text-left">Settings</span>
                <span className="text-neutral-400">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


