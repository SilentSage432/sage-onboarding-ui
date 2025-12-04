"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TerminalFrame from "@/app/(init)/init-screen/components/TerminalFrame";
import LogStream from "@/app/(init)/init-screen/components/LogStream";
import ProgressBar from "@/app/(init)/init-screen/components/ProgressBar";
import Rho2Pulse from "@/app/(init)/init-screen/components/Rho2Pulse";
import WireframeOverlay from "@/app/(init)/init-screen/components/WireframeOverlay";
import TransitionOverlay from "@/app/(init)/init-screen/components/TransitionOverlay";
import InstabilityPulse from "@/app/(init)/init-screen/components/InstabilityPulse";
import HadraPulse from "@/app/(init)/init-screen/components/HadraPulse";
import { baseBootSequence } from "@/app/(init)/init-screen/boot-sequences/baseBoot";
import { generateAgentBootSequence } from "@/app/(init)/init-screen/boot-sequences/agentBoot";
import { rho2Handshake } from "@/app/(init)/init-screen/boot-sequences/rho2Handshake";
import { softErrors } from "@/app/(init)/init-screen/boot-sequences/softErrors";
import { environmentAssembly } from "@/app/(init)/init-screen/boot-sequences/environmentAssembly";
import { hadraEmergence } from "@/app/(init)/init-screen/boot-sequences/hadraEmergence";

export default function InitializingPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    // Get selected agents from localStorage
    let selectedAgents: string[] = [];
    
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sage_selected_agents");
      if (stored) {
        try {
          selectedAgents = JSON.parse(stored);
        } catch (e) {
          selectedAgents = [];
        }
      }
    }

    // Generate agent boot sequence
    const agentBoot = generateAgentBootSequence(selectedAgents);
    
    // Merge base, agent, Rho² handshake, soft errors, environment assembly, and HADRA emergence sequences
    const fullSeq = [
      ...baseBootSequence,
      ...agentBoot,
      ...rho2Handshake,
      ...softErrors,
      ...environmentAssembly,
      ...hadraEmergence,
    ];

    let index = 0;
    let total = fullSeq.length;
    let timeoutIds: NodeJS.Timeout[] = [];
    let handshakeCompleteAdded = false;
    let softErrorsCompleteAdded = false;
    let environmentReadyAdded = false;

    const runStep = () => {
      if (index >= total) {
        // Boot sequence complete, navigate to console after a brief delay
        const finalTimeout = setTimeout(() => {
          router.push("/console");
        }, 2000);
        timeoutIds.push(finalTimeout);
        return;
      }

      const step = fullSeq[index];
      const timeout = setTimeout(() => {
        setLogs((prev) => [...prev, step.msg]);
        
        // Add final handshake moment after handshake complete
        if (step.msg.includes("handshake complete") && !handshakeCompleteAdded) {
          handshakeCompleteAdded = true;
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              "Sovereign identity established — workspace cryptographically bound.",
            ]);
          }, 800);
        }

        // Add integrity check message after soft errors complete
        if (
          step.msg.includes("normalized ✔") &&
          step.msg.includes("Latency") &&
          !softErrorsCompleteAdded
        ) {
          softErrorsCompleteAdded = true;
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              "Integrity checks passed — continuing environment assembly…",
            ]);
          }, 1000);
        }

        // Add launch handoff messages after environment ready
        if (step.msg.includes("environment ready") && !environmentReadyAdded) {
          environmentReadyAdded = true;
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              "Initiating console handoff…",
              "Establishing operator session…",
              "Launching SAGE OS Console →",
            ]);
          }, 800);
          
          // Trigger transition and redirect
          setTimeout(() => {
            setLaunching(true); // fade-out transition
          }, 2000);
          
          setTimeout(() => {
            router.push("/console"); // enter SAGE OS Console
          }, 2500);
        }
        
        setProgress(Math.round(((index + 1) / total) * 100));
        index++;
        runStep(); // next step
      }, step.delay);

      timeoutIds.push(timeout);
    };

    runStep();

    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [router]);

  // Track handshake activity (roughly 60-80% progress based on sequence position)
  const isHandshakeActive = progress > 60 && progress < 80;
  // Track environment build activity (roughly 80-100% progress)
  const isEnvBuildActive = progress > 80 && progress < 100;
  // Track soft error activity (check if any warnings or variances are in logs)
  const softErrorActive = logs.some(
    (l) => l.includes("Warning") || l.includes("variance")
  );
  // Track HADRA activity (check if any HADRA, heartbeat, AIDR, or diagnostic logs are present)
  const hadraActive = logs.some(
    (l) =>
      l.includes("HADRA") ||
      l.includes("heartbeat") ||
      l.includes("AIDR") ||
      l.includes("diagnostic")
  );

  return (
    <div className="w-full h-screen bg-[#05070d] text-white p-8 relative">
      <TransitionOverlay active={launching} />
      <div className="relative flex justify-center pt-24 pb-16 px-6 min-h-[80vh]">
        <Rho2Pulse active={isHandshakeActive} />
        <TerminalFrame>
          <InstabilityPulse active={softErrorActive} />
          <HadraPulse active={hadraActive} />
          <WireframeOverlay active={isEnvBuildActive} />
          <ProgressBar value={progress} />
          <LogStream logs={logs} />
        </TerminalFrame>
      </div>
    </div>
  );
}

