"use client";

import { useEffect, useRef } from "react";
import { HadraEvent } from "@/lib/hadra/event";
import { eventStyles } from "@/lib/hadra/eventStyle";
import { cn } from "@/lib/utils";

export default function DiagnosticStream({ events }: { events: HadraEvent[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [events]);

  return (
    <div
      ref={containerRef}
      className="h-[65vh] overflow-y-auto px-3 py-2 text-xs font-mono text-gray-300 select-none
                 backdrop-blur-md rounded-lg bg-black/20 border border-white/5"
    >
      {events.map((e) => (
        <div key={e.id} className={cn("mb-1", eventStyles[e.level])}>
          <span className="text-gray-500 mr-2">
            {new Date(e.timestamp).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" })}
          </span>
          <span className="text-gray-400 mr-2">[{e.subsystem}]</span>
          <span>{e.message}</span>
        </div>
      ))}
    </div>
  );
}

