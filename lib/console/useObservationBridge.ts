"use client";

import { useEffect } from "react";
import { hadraBus } from "@/lib/hadra/hadraEventBus";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";
import type { HadraInsight, HadraConsoleMessage } from "@/types/hadra";
import type {
  ObservationEvent,
  ObservationEventType,
  ObservationSubsystem,
  ObservationSeverity,
} from "@/lib/console/observationVocabulary";

/**
 * Passive Observation Bridge
 * 
 * This hook creates a one-way data flow from HADRA events to readiness store observations.
 * It does NOT:
 * - Interpret events
 * - Change behavior
 * - Trigger automation
 * - Modify unlock logic
 * - Add control paths
 * 
 * It ONLY:
 * - Listens to HADRA event bus
 * - Records observations into readiness store
 * - Preserves temporal order
 * - Maintains truth without adding intent
 * 
 * This is pure observation persistence - memory without cognition.
 */
export function useObservationBridge() {
  const { addObservationEvent } = useReadinessStore();

  useEffect(() => {
    // Subscribe to HADRA insights
    const unbindInsight = hadraBus.on("insight", (insight: HadraInsight) => {
      // Record insight as observation - no interpretation, just persistence
      // Use vocabulary types for semantic structure
      const event: ObservationEvent = {
        id: crypto.randomUUID(),
        type: "hadra_insight" as ObservationEventType,
        timestamp: insight.ts || Date.now(),
        data: {
          source: "hadra",
          subsystem: insight.subsystem as ObservationSubsystem | undefined,
          severity: insight.severity as ObservationSeverity | undefined,
          content: insight.content,
        },
      };
      addObservationEvent(event);
    });

    // Subscribe to console messages (operator input and HADRA responses)
    const unbindMessage = hadraBus.on("consoleMessage", (message: HadraConsoleMessage) => {
      // Record console message as observation - neutral recording only
      // Use vocabulary types for semantic structure
      const event: ObservationEvent = {
        id: crypto.randomUUID(),
        type: "console_message" as ObservationEventType,
        timestamp: message.ts || Date.now(),
        data: {
          source: "hadra_console",
          role: message.role,
          content: message.content,
        },
      };
      addObservationEvent(event);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unbindInsight();
      unbindMessage();
    };
  }, [addObservationEvent]);
}
