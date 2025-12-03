"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import HadraOrb from "@/components/hadra/HadraOrb";
import HadraPanel from "@/components/hadra/HadraPanel";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const [hadraOpen, setHadraOpen] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black text-white flex flex-col">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Body */}
      <div className="flex flex-row h-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main View */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>

      {/* HADRA-01 Floating Orb Launcher */}
      <HadraOrb open={hadraOpen} setOpen={setHadraOpen} />

      {/* HADRA-01 Cinematic System Panel */}
      {hadraOpen && (
        <HadraPanel onClose={() => setHadraOpen(false)} />
      )}
    </div>
  );
}

