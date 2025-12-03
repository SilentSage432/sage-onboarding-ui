"use client";

import { useState } from "react";

export default function ChatStream() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">HADRA-01</h1>
          <p className="text-xs opacity-60">Operator Companion • Online</p>
        </div>
      </div>

      {/* MESSAGE LOG */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 opacity-80">
        <p className="text-sm italic opacity-60">
          HADRA-01 initialized. How can I assist?
        </p>
      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t border-white/10">
        <input
          className="w-full p-3 rounded-md bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Message HADRA…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
}


