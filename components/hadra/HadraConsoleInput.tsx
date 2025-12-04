"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { hadraBus } from "@/lib/hadra/hadraEventBus";
import type { HadraConsoleMessage } from "@/types/hadra";

/**
 * HadraConsoleInput
 * Terminal-like input component for operator to communicate with HADRA
 * Features: Glowing caret, command history, Enter to send
 */
export default function HadraConsoleInput() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = () => {
    if (!input.trim()) return;

    const command = input.trim();

    // Add to history
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);

    // Emit operator message - mock engine will handle response
    hadraBus.emit("consoleMessage", {
      role: "operator",
      content: command,
      ts: Date.now(),
    } as HadraConsoleMessage);

    setInput("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Arrow up - previous history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 
          ? history.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
    // Arrow down - next history
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  // Focus input when console opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="flex items-center gap-2 p-4 border-t border-white/10 bg-black/30 backdrop-blur-xl"
    >
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm font-mono">
          ➤
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          placeholder="Type a command for HADRA…"
          className="
            w-full
            pl-8 pr-4 py-2
            bg-transparent
            border border-white/10 rounded-lg
            text-sm text-white placeholder-white/40
            outline-none
            focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30
            transition-all
            font-mono
          "
        />
      </div>
      <button
        type="submit"
        disabled={!input.trim()}
        className="
          px-4 py-2
          bg-purple-600 hover:bg-purple-700
          disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
          text-white rounded-lg
          transition-all
          font-medium text-sm
        "
      >
        Send
      </button>
    </form>
  );
}

