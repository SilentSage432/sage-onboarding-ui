"use client";

import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";

export default function Step1() {
  const { setMode } = useWizardStore();

  const choose = (mode: "personal" | "business") => {
    setMode(mode);
    // setMode automatically resets stepIndex to 0, which shows the first step of the selected flow
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full">
      <h2 className="text-3xl font-semibold">Choose account type</h2>
      <div className="flex gap-6">
        <Button
          className="text-lg px-8 py-6"
          onClick={() => choose("personal")}
        >
          Personal
        </Button>
        <Button
          variant="secondary"
          className="text-lg px-8 py-6"
          onClick={() => choose("business")}
        >
          Business
        </Button>
      </div>
    </div>
  );
}
