"use client";

import { useEffect, useMemo } from "react";
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
  const events = useMockEvents();
  
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
        context: operatorContext.activePanel === "dashboard" ? "console" : operatorContext.activePanel,
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
    <div className="fixed inset-0 z-[var(--z-hadra)] flex items-center justify-center">
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* HADRA content container */}
      <div className="relative rounded-2xl bg-[#0b0f17] p-8 w-[64rem] max-h-[85vh] overflow-hidden shadow-2xl border border-white/10">
        {/* HADRA Live Diagnostics Space */}
        <div className="absolute inset-0 opacity-40 rounded-2xl overflow-hidden">
          <HadraDiagnosticsCanvas severity={diagnosticsSeverity} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition z-10"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-white mb-6">
          HADRA-01 Diagnostic Console
        </h2>

        {/* Two-column layout: Stream + Insights */}
        <div className="flex gap-6">
          {/* LEFT COLUMN — Diagnostic Stream */}
          <div className="w-1/3 pr-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Diagnostic Stream</h3>
            <DiagnosticStream events={events} />
          </div>

          {/* RIGHT COLUMN — Insights */}
          <div className="w-2/3 pl-6 pr-2 overflow-y-auto max-h-[65vh]">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Active Insights</h3>
            <InsightsList insights={processedInsights} />
          </div>
        </div>
      </div>
    </div>
  );
}

