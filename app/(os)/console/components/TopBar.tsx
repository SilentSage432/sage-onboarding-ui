"use client";

import { Signal, Lock } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full h-12 border-b border-neutral-800 bg-neutral-900/40 backdrop-blur-md flex items-center justify-between px-6">
      <div className="flex items-center space-x-2 text-gray-300">
        <Signal className="h-4 w-4 text-blue-400" />
        <span className="text-sm">
          Rho² Secure Channel:{" "}
          <span className="text-blue-300">Active</span>
        </span>
      </div>
      <div className="flex items-center space-x-3 text-gray-400 text-sm">
        <Lock className="h-4 w-4" />
        <span>Federation Verified</span>
      </div>
    </div>
  );
}


