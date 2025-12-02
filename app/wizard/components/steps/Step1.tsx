"use client";

import { Button } from "@/components/ui/button";
import { useWizardStore } from "../../store/useWizardStore";

export default function Step1() {
  const { setAccountType, next } = useWizardStore();

  const selectAndContinue = (type: "personal" | "business") => {
    setAccountType(type);
    next();
  };

  return (
    <div className="grid gap-3">
      <Button 
        onClick={() => selectAndContinue("personal")} 
        className="w-full h-14 rounded-xl bg-white/10 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white text-[15px] font-medium transition-all duration-150"
      >
        Personal
      </Button>

      <Button 
        onClick={() => selectAndContinue("business")} 
        className="w-full h-14 rounded-xl bg-white/10 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white text-[15px] font-medium transition-all duration-150"
      >
        Business / Organization
      </Button>
    </div>
  );
}

