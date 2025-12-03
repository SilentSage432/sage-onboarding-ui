"use client";

import { Shield, Lock, EyeOff } from "lucide-react";

export default function SecurityPanel() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-white font-bold">Security</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <Shield className="h-6 w-6 text-blue-400 mb-2" />
          <h2 className="text-white font-semibold">Integrity</h2>
          <p className="text-gray-400 text-sm">
            Validating system health & module authenticity.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <Lock className="h-6 w-6 text-green-400 mb-2" />
          <h2 className="text-white font-semibold">Access Control</h2>
          <p className="text-gray-400 text-sm">
            Role-based access & permission boundaries.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <EyeOff className="h-6 w-6 text-red-400 mb-2" />
          <h2 className="text-white font-semibold">Privacy</h2>
          <p className="text-gray-400 text-sm">
            Data minimization & local-only execution safeguards.
          </p>
        </div>
      </div>
    </div>
  );
}
