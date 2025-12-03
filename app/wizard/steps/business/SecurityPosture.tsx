"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

export default function SecurityPosture() {
  const { register, watch, setValue } = useFormContext();
  const posture = watch("security.posture");
  const allowAutomation = watch("security.allowAutomation");
  const allowExternal = watch("security.allowExternal");

  return (
    <div className="flex flex-col sage-stack-xl">
      <div className="sage-stack">
        <label className="sage-label text-white/80 tracking-wide">
          Security Posture
        </label>
        <select
          {...register("security.posture")}
          className="sage-input"
        >
          <option value="low">Low — relaxed environment</option>
          <option value="moderate">Moderate — balanced protection</option>
          <option value="strict">Strict — maximum control & auditing</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allowAutomation || false}
          onChange={(checked) => setValue("security.allowAutomation", checked)}
        />
        <label className="sage-label text-white/80 cursor-pointer" onClick={() => setValue("security.allowAutomation", !allowAutomation)}>
          Allow SAGE Autonomous Automation
        </label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allowExternal || false}
          onChange={(checked) => setValue("security.allowExternal", checked)}
        />
        <label className="sage-label text-white/80 cursor-pointer" onClick={() => setValue("security.allowExternal", !allowExternal)}>
          Allow External Integrations (Optional)
        </label>
      </div>
    </div>
  );
}

