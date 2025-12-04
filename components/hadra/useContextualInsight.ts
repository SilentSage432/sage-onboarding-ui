"use client";

import { useEffect, useState, useRef } from "react";
import { OperatorContext } from "@/lib/hadra/operatorContext";
import { SystemContext } from "@/lib/hadra/systemContext";
import { HadraInsight } from "@/lib/hadra/insight";

export function useContextualInsight(
  operator: OperatorContext,
  system: SystemContext
) {
  const [insight, setInsight] = useState<HadraInsight | null>(null);
  const lastPanelRef = useRef<string>(operator.activePanel);
  const highLoadTriggeredRef = useRef(false);
  const lastInteractionRef = useRef<string>(operator.lastInteraction);

  useEffect(() => {
    // If operator switches panels
    if (operator.activePanel !== lastPanelRef.current && operator.lastInteraction === "panelChange" && operator.lastInteraction !== lastInteractionRef.current) {
      lastPanelRef.current = operator.activePanel;
      lastInteractionRef.current = operator.lastInteraction;
      setInsight({
        id: crypto.randomUUID(),
        severity: "info",
        title: `Context: Viewing ${operator.activePanel} panel.`,
        description: "Adjusting diagnostic filters accordingly.",
        subsystem: "system",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // If system load becomes high while operator is active (only trigger once per high-load period)
    if (system.loadLevel > 0.6 && !highLoadTriggeredRef.current) {
      highLoadTriggeredRef.current = true;
      setInsight({
        id: crypto.randomUUID(),
        severity: "warning",
        title: "Elevated system load detected.",
        description: "Performance may be affected during this session.",
        subsystem: "system",
        timestamp: new Date().toISOString(),
      });
    } else if (system.loadLevel <= 0.6) {
      // Reset trigger when load drops
      highLoadTriggeredRef.current = false;
    }
  }, [operator.activePanel, operator.lastInteraction, system.loadLevel]);

  return insight;
}

