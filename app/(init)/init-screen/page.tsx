"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InitScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate initialization process, then navigate to console
    const timer = setTimeout(() => {
      router.push("/console");
    }, 3000); // 3 seconds initialization

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center -mt-10 animate-in fade-in zoom-in duration-300">
      <div className="max-w-[500px] bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] rounded-2xl py-16 px-14">
        <div className="flex flex-col items-center space-y-8">
          {/* Title */}
          <h2 className="text-[28px] font-semibold text-white text-center animate-fade-in">
            Initializing your SAGE Environment…
          </h2>

          {/* Loading Animation - Dot Sequence */}
          <div className="flex items-center justify-center space-x-2 animate-fade-in" style={{ "--delay": "100ms" } as React.CSSProperties}>
            <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "300ms" }}></div>
          </div>

          {/* Subtle Progress Indicator */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden animate-fade-in" style={{ "--delay": "150ms" } as React.CSSProperties}>
            <div className="h-full bg-white/20 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

