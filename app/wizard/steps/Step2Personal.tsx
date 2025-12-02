"use client";

import { Input } from "@/components/ui/input";
import { useOnboardingDataStore } from "../store/useOnboardingDataStore";

export default function Step2Personal() {
  const { personal, setPersonal } = useOnboardingDataStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-300">Full Name</label>
        <Input
          placeholder="Full Name"
          value={personal.name}
          onChange={(e) => setPersonal({ name: e.target.value })}
          className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
        />
        {!personal.name && (
          <span className="text-xs text-red-400">Required</span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-300">Email</label>
        <Input
          type="email"
          placeholder="Email Address"
          value={personal.email}
          onChange={(e) => setPersonal({ email: e.target.value })}
          className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
        />
        {!personal.email && (
          <span className="text-xs text-red-400">Required</span>
        )}
      </div>

      {/* Role */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-neutral-300">Role</label>
        <select
          value={personal.role}
          onChange={(e) => setPersonal({ role: e.target.value })}
          className="h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" className="bg-black text-white">Select role...</option>
          <option value="Individual" className="bg-black text-white">Individual</option>
          <option value="Student" className="bg-black text-white">Student</option>
          <option value="Collector" className="bg-black text-white">Collector</option>
          <option value="Hobbyist" className="bg-black text-white">Hobbyist</option>
        </select>
        {!personal.role && (
          <span className="text-xs text-red-400">Required</span>
        )}
      </div>
    </div>
  );
}

