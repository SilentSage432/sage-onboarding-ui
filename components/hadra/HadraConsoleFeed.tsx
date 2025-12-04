"use client";

import { useEffect, useState, useRef } from "react";
import { hadraBus } from "@/lib/hadra/hadraEventBus";
import type { HadraMessage } from "@/types/hadra";
import HadraTypingEffect from "./HadraTypingEffect";
import { cn } from "@/lib/utils";

/**
 * HadraConsoleFeed
 * Displays HADRA's console messages with terminal-like styling
 * Features: Auto-scroll, typing effects, role-based styling
 */
export default function HadraConsoleFeed() {
  const [messages, setMessages] = useState<HadraMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "hadra",
      content: "Diagnostics online. I am HADRA-01.",
      timestamp: Date.now(),
    },
  ]);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for insights (from mock engine)
    const unbindInsight = hadraBus.on("insight", (data: any) => {
      const content = data.content || "";
      
      // If this is "Analyzing...", replace the last "Analyzing..." message if it exists
      if (content === "Analyzing...") {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.content !== "Analyzing...");
          return [
            ...filtered,
            {
              id: crypto.randomUUID(),
              role: "hadra" as const,
              content: "Analyzing...",
              timestamp: data.ts || Date.now(),
              severity: data.severity,
              subsystem: data.subsystem,
            },
          ];
        });
        return;
      }

      // Replace "Analyzing..." with actual response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.content !== "Analyzing...");
        const message: HadraMessage = {
          id: crypto.randomUUID(),
          role: "hadra",
          content: content,
          timestamp: data.ts || Date.now(),
          severity: data.severity,
          subsystem: data.subsystem,
        };
        setTypingMessageId(message.id);
        // Clear typing indicator after message is fully displayed
        setTimeout(() => setTypingMessageId(null), content.length * 20 + 500);
        return [...filtered, message];
      });
    });

    // Listen for console messages (from input)
    const unbindMessage = hadraBus.on("consoleMessage", (data: any) => {
      const message: HadraMessage = {
        id: crypto.randomUUID(),
        role: data.role || "operator",
        content: data.content || "",
        timestamp: data.ts || Date.now(),
      };
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      unbindInsight();
      unbindMessage();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 p-6 text-[14px] text-gray-300 overflow-y-auto h-full">
      {messages.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-8">
          <div className="mb-2">HADRA-01 ready.</div>
          <div className="text-xs">Type a command to begin diagnostic analysis.</div>
        </div>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed transition-all",
            msg.role === "operator"
              ? "ml-auto bg-white/5 border border-white/10 text-gray-200"
              : msg.role === "hadra"
              ? "mr-auto bg-[#8b5cf6]/10 border border-purple-500/20 text-purple-200"
              : "bg-blue-500/10 border border-blue-500/20 text-blue-200"
          )}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-gray-400 font-mono">
              {new Date(msg.timestamp).toLocaleTimeString([], { 
                hour: "2-digit", 
                minute: "2-digit", 
                second: "2-digit" 
              })}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {msg.role}
            </span>
          </div>
          <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {typingMessageId === msg.id && msg.role === "hadra" ? (
              <HadraTypingEffect text={msg.content} speed={20} />
            ) : (
              msg.content
            )}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}

