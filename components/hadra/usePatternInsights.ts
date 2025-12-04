"use client";

import { useEffect, useState, useRef } from "react";
import { HadraInsight } from "@/lib/hadra/insight";
import { HadraMemory } from "@/lib/hadra/memory";

export function usePatternInsights(memory: HadraMemory) {
  const [patternInsight, setPatternInsight] = useState<HadraInsight | null>(null);
  const hasTriggeredAnomalyPattern = useRef(false);
  const hasTriggeredEscalationPattern = useRef(false);
  const lastMemoryStateRef = useRef({ anomalyCount: 0, warningCount: 0 });

  useEffect(() => {
    // Only check if memory counts have actually changed
    const memoryChanged = 
      memory.anomalyCount !== lastMemoryStateRef.current.anomalyCount ||
      memory.warningCount !== lastMemoryStateRef.current.warningCount;

    if (!memoryChanged) return;

    lastMemoryStateRef.current = {
      anomalyCount: memory.anomalyCount,
      warningCount: memory.warningCount,
    };

    // Prioritize escalation pattern (critical) over anomaly pattern (warning)
    // Trigger: escalating failures (warnings + anomalies) (only once)
    if (memory.warningCount >= 2 && memory.anomalyCount >= 2 && !hasTriggeredEscalationPattern.current) {
      hasTriggeredEscalationPattern.current = true;
      setPatternInsight({
        id: crypto.randomUUID(),
        severity: "critical",
        title: "Escalation pattern observed.",
        description: "Combined anomalies and warnings indicate a broader stability risk.",
        subsystem: "system",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Trigger: 3 anomalies within recent window (only once, if escalation not triggered)
    if (memory.anomalyCount >= 3 && !hasTriggeredAnomalyPattern.current && !hasTriggeredEscalationPattern.current) {
      hasTriggeredAnomalyPattern.current = true;
      setPatternInsight({
        id: crypto.randomUUID(),
        severity: "warning",
        title: "Repeated anomaly pattern detected.",
        description: "Multiple subsystems show deviation trends. Review recommended.",
        subsystem: "system",
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }, [memory.anomalyCount, memory.warningCount, memory.criticalCount]);

  return patternInsight;
}

