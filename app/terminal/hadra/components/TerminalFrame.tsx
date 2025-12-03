"use client";

import ModuleSidebar from "./ModuleSidebar";
import ChatStream from "./ChatStream";
import InsightPanel from "./InsightPanel";

export default function TerminalFrame() {
  return (
    <div className="flex h-full w-full">
      {/* LEFT SIDEBAR */}
      <ModuleSidebar />

      {/* CENTER TERMINAL */}
      <div className="flex flex-col flex-1 border-x border-white/10 bg-black/40 backdrop-blur-xl">
        <ChatStream />
      </div>

      {/* RIGHT PANEL */}
      <InsightPanel />
    </div>
  );
}


