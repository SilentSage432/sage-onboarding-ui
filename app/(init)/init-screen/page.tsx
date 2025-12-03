"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TerminalFrame from "./components/TerminalFrame";
import LogStream from "./components/LogStream";
import ProgressBar from "./components/ProgressBar";
import Rho2Pulse from "./components/Rho2Pulse";
import WireframeOverlay from "./components/WireframeOverlay";
import { baseBootSequence } from "./boot-sequences/baseBoot";
import { generateAgentBootSequence } from "./boot-sequences/agentBoot";
import { rho2Handshake } from "./boot-sequences/rho2Handshake";
import { environmentAssembly } from "./boot-sequences/environmentAssembly";

export default function InitScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Get selected agents from URL params or localStorage
    let selectedAgents: string[] = [];
    
    // Try URL params first (passed from wizard)
    const agentsParam = searchParams.get("agents");
    if (agentsParam) {
      try {
        selectedAgents = JSON.parse(agentsParam);
      } catch (e) {
        // Fallback to localStorage
        const stored = localStorage.getItem("sage_selected_agents");
        if (stored) {
          try {
            selectedAgents = JSON.parse(stored);
          } catch (e) {
            selectedAgents = [];
          }
        }
      }
    } else {
      // Fallback to localStorage
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
    
    // Merge base, agent, Rho² handshake, and environment assembly sequences
    const fullSeq = [
      ...baseBootSequence,
      ...agentBoot,
      ...rho2Handshake,
      ...environmentAssembly,
    ];

    let index = 0;
    let total = fullSeq.length;
    let timeoutIds: NodeJS.Timeout[] = [];
    let handshakeCompleteAdded = false;
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

        // Add launch handoff message after environment ready
        if (step.msg.includes("environment ready") && !environmentReadyAdded) {
          environmentReadyAdded = true;
          setTimeout(() => {
            setLogs((prev) => [...prev, "Launching SAGE OS Console…"]);
          }, 800);
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
  }, [router, searchParams]);

  // Track handshake activity (roughly 60-80% progress based on sequence position)
  const isHandshakeActive = progress > 60 && progress < 80;
  // Track environment build activity (roughly 80-100% progress)
  const isEnvBuildActive = progress > 80 && progress < 100;

  return (
    <div className="w-full h-screen bg-[#05070d] text-white p-8 flex items-center justify-center relative">
      <div className="relative w-full max-w-4xl">
        <Rho2Pulse active={isHandshakeActive} />
        <TerminalFrame>
          <WireframeOverlay active={isEnvBuildActive} />
          <ProgressBar value={progress} />
          <LogStream logs={logs} />
        </TerminalFrame>
      </div>
    </div>
  );
}

