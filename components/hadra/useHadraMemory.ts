"use client";

import { useState, useEffect, useRef } from "react";
import { HadraInsight } from "@/lib/hadra/insight";
import { HadraEvent } from "@/lib/hadra/event";
import { HadraMemory } from "@/lib/hadra/memory";

export function useHadraMemory(events: HadraEvent[], insights: HadraInsight[]): HadraMemory {
  const [memory, setMemory] = useState<HadraMemory>({
    recentEvents: [],
    recentInsights: [],
    anomalyCount: 0,
    warningCount: 0,
    criticalCount: 0,
  });

  const lastEventIdRef = useRef<string | null>(null);
  const lastInsightIdRef = useRef<string | null>(null);

  useEffect(() => {
    const lastEvent = events[events.length - 1];
    const lastInsight = insights[insights.length - 1];

    // Only process if we have new items
    const hasNewEvent = lastEvent && lastEvent.id !== lastEventIdRef.current;
    const hasNewInsight = lastInsight && lastInsight.id !== lastInsightIdRef.current;

    if (!hasNewEvent && !hasNewInsight) return;

    setMemory((prev) => {
      const newMemory = { ...prev };

      if (hasNewEvent && lastEvent) {
        lastEventIdRef.current = lastEvent.id;
        newMemory.recentEvents = [
          ...prev.recentEvents,
          lastEvent.message,
        ].filter(Boolean).slice(-50);
      }

      if (hasNewInsight && lastInsight) {
        lastInsightIdRef.current = lastInsight.id;
        newMemory.recentInsights = [
          ...prev.recentInsights,
          lastInsight.title,
        ].filter(Boolean).slice(-50);

        // Update counts only for new insights
        if (lastInsight.severity === "anomaly") {
          newMemory.anomalyCount = prev.anomalyCount + 1;
        } else if (lastInsight.severity === "warning") {
          newMemory.warningCount = prev.warningCount + 1;
        } else if (lastInsight.severity === "critical") {
          newMemory.criticalCount = prev.criticalCount + 1;
        }
      }

      return newMemory;
    });
  }, [events.length, insights.length, events[events.length - 1]?.id, insights[insights.length - 1]?.id]);

  return memory;
}

