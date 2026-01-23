"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import HadraOrb from "@/components/hadra/HadraOrb";
import HadraPanel from "@/components/hadra/HadraPanel";
import HadraConsole from "@/components/hadra/HadraConsole";
import ConsoleArrival from "./components/ConsoleArrival";
import ConsoleAtmosphere from "./components/ConsoleAtmosphere";
import ConsoleFrame from "./components/ConsoleFrame";
import DesktopPanel from "./components/DesktopPanel";
import SystemStatusStrip from "./components/SystemStatusStrip";
import SovereignBackground from "@/components/core/SovereignBackground";
import { useMockInsights } from "@/components/hadra/useMockInsights";
import { useOrbStatus } from "@/components/hadra/useOrbStatus";
import { useOperatorContext } from "@/components/hadra/useOperatorContext";
import { useSystemContext } from "@/components/hadra/useSystemContext";
import { useMockEvents } from "@/components/hadra/useMockEvents";
import { useHadraMemory } from "@/components/hadra/useHadraMemory";
import { usePatternInsights } from "@/components/hadra/usePatternInsights";
import { useContextualInsight } from "@/components/hadra/useContextualInsight";
import { OrbStatus } from "@/lib/hadra/orbPulse";
import { useObservationBridge } from "@/lib/console/useObservationBridge";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";
import { observeRuntimeHealth } from "@/lib/infrastructure/useRuntimeHealth";
// Auto-start HADRA mock engine
import "@/components/hadra/hadraMockEngine";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const [hadraOpen, setHadraOpen] = useState(false);
  const [hadraSync, setHadraSync] = useState(false);
  const [orbStatus, setOrbStatus] = useState<OrbStatus>("idle");
  const { setCurrentSessionStartTime, setSystemPerspective } = useReadinessStore();
  const insights = useMockInsights();
  const events = useMockEvents();
  const operatorContext = useOperatorContext();
  const systemContext = useSystemContext();
  
  // Set session start time when console mounts (temporal boundary marker)
  useEffect(() => {
    setCurrentSessionStartTime(Date.now());
  }, [setCurrentSessionStartTime]);

  // Check architect session on boot and set systemPerspective
  useEffect(() => {
    const checkArchitectSession = async () => {
      try {
        const response = await fetch("/api/architect/bootstrap");
        const data = await response.json();
        if (data.isArchitect) {
          setSystemPerspective("architect");
        } else {
          setSystemPerspective("operator");
        }
      } catch (error) {
        console.error("Failed to check architect session:", error);
        setSystemPerspective("operator"); // Default to operator on error
      }
    };
    checkArchitectSession();
  }, [setSystemPerspective]);

  // Passive observation bridge - records HADRA events into readiness store
  // This is pure data flow: observation → memory, no interpretation or control
  useObservationBridge();

  // Observe runtime health and readiness once per session (passive observation only)
  const healthObservedRef = useRef(false);
  useEffect(() => {
    // Only observe once per session (tracked via ref to prevent re-observation on re-renders)
    if (!healthObservedRef.current) {
      healthObservedRef.current = true;
      observeRuntimeHealth();
    }
  }, []);

  // Compute full HADRA intelligence for orb status
  const memory = useHadraMemory(events, insights);
  const patternInsight = usePatternInsights(memory);
  const contextualInsight = useContextualInsight(operatorContext, systemContext);

  // Compute full orb status with all context
  const computedOrbStatus = useOrbStatus(
    insights,
    patternInsight,
    contextualInsight,
    operatorContext,
    systemContext
  );

  useEffect(() => {
    setOrbStatus(computedOrbStatus);
  }, [computedOrbStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("%cHADRA-01 connected", "color:#b388ff;font-weight:bold;");
      setHadraSync(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ConsoleArrival>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">
        {/* Sovereign OS Background v3 - Static, minimal, enterprise-grade */}
        <SovereignBackground />
        
        {/* Prevent ANY inherited padding/margins from shifting UI */}
        <div className="absolute inset-0 w-full h-full overflow-hidden text-white flex flex-col">
          {/* Atmospheric layer */}
          <ConsoleAtmosphere />
          
          {/* Top Navigation Bar */}
          <TopBar />

          {/* Console Frame Grid */}
          <ConsoleFrame>
            {/* Sidebar */}
            <Sidebar />

            {/* Main View */}
            <DesktopPanel>
              {children}
            </DesktopPanel>
          </ConsoleFrame>

      {/* HADRA-01 Floating Orb Launcher */}
      <HadraOrb 
        open={hadraOpen} 
        setOpen={setHadraOpen} 
        status={orbStatus}
        setStatus={setOrbStatus}
      />

      {/* HADRA-01 Console */}
      <HadraConsole open={hadraOpen} />

          {/* HADRA-01 Cinematic System Panel */}
          {hadraOpen && (
            <HadraPanel 
              onClose={() => setHadraOpen(false)} 
              insights={insights}
              operatorContext={operatorContext}
              systemContext={systemContext}
              patternInsight={patternInsight}
              contextualInsight={contextualInsight}
              memory={memory}
              setOrbStatus={setOrbStatus}
            />
          )}

          {/* System Status Strip */}
          <SystemStatusStrip />
        </div>
      </div>
    </ConsoleArrival>
  );
}

