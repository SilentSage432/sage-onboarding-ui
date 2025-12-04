"use client";

import { useEffect, useState } from "react";
import { OperatorContext } from "@/lib/hadra/operatorContext";

export function useOperatorContext() {
  const [context, setContext] = useState<OperatorContext>({
    activePanel: "dashboard",
    lastInteraction: "none",
    focusLevel: 0.8,
    mode: "production",
  });

  useEffect(() => {
    function handlePanelChange(e: CustomEvent) {
      setContext((prev) => ({
        ...prev,
        activePanel: e.detail?.panel || prev.activePanel,
        lastInteraction: "panelChange",
      }));
    }

    function handleInteraction(e: CustomEvent) {
      setContext((prev) => ({
        ...prev,
        lastInteraction: e.detail?.action || prev.lastInteraction,
      }));
    }

    window.addEventListener("sage:panelChange", handlePanelChange as any);
    window.addEventListener("sage:interaction", handleInteraction as any);

    return () => {
      window.removeEventListener("sage:panelChange", handlePanelChange as any);
      window.removeEventListener("sage:interaction", handleInteraction as any);
    };
  }, []);

  return context;
}

