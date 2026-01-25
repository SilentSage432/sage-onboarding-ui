"use client";

import { useEffect, useMemo, useRef } from "react";
import InsightsList from "./InsightsList";
import DiagnosticStream from "./DiagnosticStream";
import { useMockEvents } from "./useMockEvents";
import { useInsightFilter } from "./useInsightFilter";
import { HadraInsight } from "@/lib/hadra/insight";
import { OperatorContext } from "@/lib/hadra/operatorContext";
import { SystemContext } from "@/lib/hadra/systemContext";
import { HadraMemory } from "@/lib/hadra/memory";
import { OrbStatus } from "@/lib/hadra/orbPulse";
import { hadraSpeak } from "@/lib/hadra/conversation/conversationEngine";
import HadraDiagnosticsCanvas from "./HadraDiagnosticsCanvas";
import { useSageSignal } from "@/lib/signals/useSageSignal";
import { mapReconciliationSignal, mapHealthSignal, mapCapacitySignal, mapLatencySignal, diagnosticToEvent } from "@/lib/hadra/signalToLanguage";
import type { HadraEvent } from "@/lib/hadra/event";

// Type-safe mapping from panel name to HADRA context
function mapPanelToContext(panel: string): "console" | "onboarding" | "wizard" | "mesh" | "agents" | "security" | undefined {
  // Map "dashboard" to "console"
  if (panel === "dashboard") {
    return "console";
  }
  // Check if panel matches one of the allowed context values
  const allowedContexts = ["console", "onboarding", "wizard", "mesh", "agents", "security"] as const;
  if (allowedContexts.includes(panel as typeof allowedContexts[number])) {
    return panel as typeof allowedContexts[number];
  }
  // Default fallback
  return "console";
}

export default function HadraPanel({ 
  onClose,
  insights = [],
  operatorContext,
  systemContext,
  patternInsight,
  contextualInsight,
  memory,
  setOrbStatus
}: { 
  onClose: () => void;
  insights?: HadraInsight[];
  operatorContext: OperatorContext;
  systemContext: SystemContext;
  patternInsight: HadraInsight | null;
  contextualInsight: HadraInsight | null;
  memory: HadraMemory;
  setOrbStatus?: (status: OrbStatus) => void;
}) {
  const mockEvents = useMockEvents();
  const sageSignals = useSageSignal();
  const lastReconciliationStateRef = useRef<string | null>(null);
  const lastHealthStateRef = useRef<string | null>(null);
  const lastCapacityStateRef = useRef<string | null>(null);
  const lastLatencyStateRef = useRef<string | null>(null);

  // Reference implementation for real Signal → Language mapping
  // Map sage.reconciliation signals to diagnostic events
  const reconciliationEvents = useMemo((): HadraEvent[] => {
    const reconciliationSignal = sageSignals.find((s) => s.id === "sage.reconciliation");
    
    if (!reconciliationSignal) {
      lastReconciliationStateRef.current = null;
      return [];
    }

    // Only emit event if state changed (silence is valid if unchanged)
    const currentState = `${reconciliationSignal.state}-${reconciliationSignal.timestamp}`;
    if (currentState === lastReconciliationStateRef.current) {
      return [];
    }

    lastReconciliationStateRef.current = currentState;

    // Map signal to diagnostic statement
    const statement = mapReconciliationSignal(reconciliationSignal);
    if (!statement) {
      return [];
    }

    // Convert to HadraEvent
    const event = diagnosticToEvent(statement, reconciliationSignal);
    return [event];
  }, [sageSignals]);

  // Reference implementation for real Signal → Language mapping
  // Map sage.health signals to diagnostic events
  const healthEvents = useMemo((): HadraEvent[] => {
    const healthSignal = sageSignals.find((s) => s.id === "sage.health");
    
    if (!healthSignal) {
      lastHealthStateRef.current = null;
      return [];
    }

    // Only emit event if state changed (silence is valid if unchanged)
    const currentState = `${healthSignal.state}-${healthSignal.timestamp}`;
    if (currentState === lastHealthStateRef.current) {
      return [];
    }

    lastHealthStateRef.current = currentState;

    // Map signal to diagnostic statement
    const statement = mapHealthSignal(healthSignal);
    if (!statement) {
      return [];
    }

    // Convert to HadraEvent
    const event = diagnosticToEvent(statement, healthSignal);
    return [event];
  }, [sageSignals]);

  // Reference implementation for real Signal → Language mapping
  // Map sage.capacity signals to diagnostic events
  const capacityEvents = useMemo((): HadraEvent[] => {
    const capacitySignal = sageSignals.find((s) => s.id === "sage.capacity");
    
    if (!capacitySignal) {
      lastCapacityStateRef.current = null;
      return [];
    }

    // Only emit event if state changed (silence is valid if unchanged)
    const currentState = `${capacitySignal.state}-${capacitySignal.timestamp}`;
    if (currentState === lastCapacityStateRef.current) {
      return [];
    }

    lastCapacityStateRef.current = currentState;

    // Map signal to diagnostic statement
    const statement = mapCapacitySignal(capacitySignal);
    if (!statement) {
      return [];
    }

    // Convert to HadraEvent
    const event = diagnosticToEvent(statement, capacitySignal);
    return [event];
  }, [sageSignals]);

  // Reference implementation for real Signal → Language mapping
  // Map sage.latency signals to diagnostic events
  const latencyEvents = useMemo((): HadraEvent[] => {
    const latencySignal = sageSignals.find((s) => s.id === "sage.latency");
    
    if (!latencySignal) {
      lastLatencyStateRef.current = null;
      return [];
    }

    // Only emit event if state changed (silence is valid if unchanged)
    const currentState = `${latencySignal.state}-${latencySignal.timestamp}`;
    if (currentState === lastLatencyStateRef.current) {
      return [];
    }

    lastLatencyStateRef.current = currentState;

    // Map signal to diagnostic statement
    const statement = mapLatencySignal(latencySignal);
    if (!statement) {
      return [];
    }

    // Convert to HadraEvent
    const event = diagnosticToEvent(statement, latencySignal);
    return [event];
  }, [sageSignals]);

  // Combine real signal events (reconciliation + health + capacity + latency) with mock events
  // Mock events continue for all other domains
  const events = useMemo(() => {
    return [...reconciliationEvents, ...healthEvents, ...capacityEvents, ...latencyEvents, ...mockEvents];
  }, [reconciliationEvents, healthEvents, capacityEvents, latencyEvents, mockEvents]);
  
  // HADRA Panel Micro-Reaction: Soft welcome pulse when panel opens
  useEffect(() => {
    if (setOrbStatus) {
      setOrbStatus("insight");
      const timeout = setTimeout(() => {
        if (setOrbStatus) {
          setOrbStatus("idle");
        }
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [setOrbStatus]);
  
  // Combine all insights: regular + contextual + pattern
  const combinedInsights = useInsightFilter(
    [...insights, contextualInsight].filter(Boolean) as HadraInsight[],
    patternInsight
  );

  // Process insights through HADRA's conversation engine
  // This ensures all insights follow HADRA's voice and persona
  const processedInsights = useMemo(() => {
    return combinedInsights.map((insight) => {
      // Generate HADRA-formatted message for this insight
      const hadraMessage = hadraSpeak({
        severity: insight.severity,
        message: insight.description || insight.title,
        context: mapPanelToContext(operatorContext.activePanel),
        subsystem: insight.subsystem,
        isRepeated: memory.recentInsights.includes(insight.title),
        operatorInteracting: operatorContext.lastInteraction !== "none",
      });

      // Return insight with HADRA-processed description
      return {
        ...insight,
        // Use HADRA's formatted message as the description
        description: hadraMessage.text,
      };
    });
  }, [combinedInsights, operatorContext.activePanel, operatorContext.lastInteraction, memory.recentInsights]);

  // Determine severity for diagnostics canvas mood
  const diagnosticsSeverity = useMemo(() => {
    if (combinedInsights.some(i => i.severity === "critical")) return "alert";
    if (combinedInsights.some(i => i.severity === "warning")) return "elevated";
    return "stable";
  }, [combinedInsights]);

  return (
    <div className="fixed inset-0 z-[var(--z-hadra)] flex items-center justify-center p-4 max-sm:p-2">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* HADRA content container */}
      <div className="relative rounded-2xl bg-[#0b0f17] p-8 w-full max-w-4xl max-h-[85dvh] overflow-hidden shadow-2xl border border-white/10 max-md:p-6 max-sm:p-4 max-sm:max-h-[90dvh]">
        {/* HADRA Live Diagnostics Space */}
        <div className="absolute inset-0 opacity-40 rounded-2xl overflow-hidden">
          <HadraDiagnosticsCanvas severity={diagnosticsSeverity} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition z-10 w-8 h-8 flex items-center justify-center text-2xl max-sm:top-2 max-sm:right-2 max-sm:w-10 max-sm:h-10"
          aria-label="Close panel"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-white mb-6 max-md:text-lg max-sm:text-base max-sm:mb-4 pr-8">
          HADRA-01 Diagnostic Console
        </h2>

        {/* Two-column layout: Stream + Insights */}
        <div className="flex gap-6 max-md:gap-4 max-sm:flex-col max-sm:gap-3">
          {/* LEFT COLUMN — Diagnostic Stream */}
          <div className="w-1/3 pr-4 max-sm:w-full max-sm:pr-0">
            <h3 className="text-sm font-medium text-gray-300 mb-3 max-sm:text-xs max-sm:mb-2">Diagnostic Stream</h3>
            <DiagnosticStream events={events} />
          </div>

          {/* RIGHT COLUMN — Insights */}
          <div className="w-2/3 pl-6 pr-2 overflow-y-auto max-h-[65dvh] max-sm:w-full max-sm:pl-0 max-sm:pr-0 max-sm:max-h-[50dvh]">
            <h3 className="text-sm font-medium text-gray-300 mb-3 max-sm:text-xs max-sm:mb-2">Active Insights</h3>
            <InsightsList insights={processedInsights} />
          </div>
        </div>
      </div>
    </div>
  );
}

