"use client";

import { useState } from "react";
import HADRAIntro from "./HADRAIntro";
import HADRADiagnostics from "./HADRADiagnostics";
import { Button } from "../ui/button";

export default function HADRA() {
  const [mode, setMode] = useState<"intro" | "diag">("intro");

  return (
    <div className="relative w-full h-full bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl p-6">
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant={mode === "intro" ? "default" : "outline"}
          onClick={() => setMode("intro")}
        >
          Overview
        </Button>
        <Button
          variant={mode === "diag" ? "default" : "outline"}
          onClick={() => setMode("diag")}
        >
          Diagnostics
        </Button>
      </div>

      {mode === "intro" && <HADRAIntro />}
      {mode === "diag" && <HADRADiagnostics />}
    </div>
  );
}
