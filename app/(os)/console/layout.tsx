"use client";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
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
    </div>
  );
}

