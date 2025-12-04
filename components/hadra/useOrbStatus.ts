"use client";

import { useMemo } from "react";
import { HadraInsight } from "@/lib/hadra/insight";
import { OperatorContext } from "@/lib/hadra/operatorContext";
import { SystemContext } from "@/lib/hadra/systemContext";
import { OrbStatus } from "@/lib/hadra/orbPulse";

export function useOrbStatus(
  insights: HadraInsight[],
  patternInsight: HadraInsight | null,
  contextualInsight: HadraInsight | null,
  operatorContext: OperatorContext,
  systemContext: SystemContext
): OrbStatus {
  return useMemo(() => {
    // Visual Hierarchy Rules (highest → lowest priority)
    
    // 1. Critical (highest priority)
    if (contextualInsight?.severity === "critical") return "critical";
    if (patternInsight?.severity === "critical") return "critical";
    const hasCriticalInsight = insights.some(i => i.severity === "critical");
    if (hasCriticalInsight) return "critical";

    // 2. Warning
    if (contextualInsight?.severity === "warning") return "warning";
    if (patternInsight?.severity === "warning") return "warning";
    const hasWarningInsight = insights.some(i => i.severity === "warning");
    if (hasWarningInsight) return "warning";

    // 3. Insight (info/anomaly)
    if (insights.length > 0) return "insight";

    // 4. Analyzing (high system load)
    if (systemContext.loadLevel > 0.5) return "analyzing";

    // 5. Onboarding mode (soft state)
    if (operatorContext.mode === "onboarding") return "onboarding";

    // 6. Idle (default)
    return "idle";
  }, [insights, patternInsight, contextualInsight, operatorContext.mode, systemContext.loadLevel]);
}

