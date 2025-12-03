"use client";

import { useFormContext } from "react-hook-form";

export default function SecurityPosture() {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col sage-stack-xl">
      <div>
        <label className="sage-label text-white/70 mb-2 block">
          Security Posture
        </label>
        <select
          {...register("security.posture")}
          className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        >
          <option value="low">Low — relaxed environment</option>
          <option value="moderate">Moderate — balanced protection</option>
          <option value="strict">Strict — maximum control & auditing</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          {...register("security.allowAutomation")} 
          className="w-4 h-4 rounded border-white/20 bg-white/10"
        />
        <label className="sage-label text-white/80">Allow SAGE Autonomous Automation</label>
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          {...register("security.allowExternal")} 
          className="w-4 h-4 rounded border-white/20 bg-white/10"
        />
        <label className="sage-label text-white/80">Allow External Integrations (Optional)</label>
      </div>
    </div>
  );
}

