"use client";

import { useEffect, useState } from "react";
import { HadraInsight } from "@/lib/hadra/insight";

export function useMockInsights() {
  const [insights, setInsights] = useState<HadraInsight[]>([]);

  useEffect(() => {
    const generateAndAdd = () => {
      const newInsight = generateInsight();
      setInsights((prev) => [...prev.slice(-20), newInsight]); // keep last 20
    };

    // Initial insight
    generateAndAdd();

    const scheduleNext = () => {
      const delay = randomDelay();
      const timeout = setTimeout(() => {
        generateAndAdd();
        scheduleNext();
      }, delay);
      return timeout;
    };

    const timeout = scheduleNext();

    return () => clearTimeout(timeout);
  }, []);

  return insights;
}

function randomDelay() {
  return 3000 + Math.random() * 4000; // 3–7 seconds
}

function generateInsight(): HadraInsight {
  const severities = ["info", "anomaly", "warning", "critical"] as const;
  const severity = weightedSeverity();

  return {
    id: crypto.randomUUID(),
    severity,
    title: titles[severity][Math.floor(Math.random() * titles[severity].length)],
    description:
      descriptions[severity][Math.floor(Math.random() * descriptions[severity].length)],
    subsystem: subsystems[Math.floor(Math.random() * subsystems.length)],
    timestamp: new Date().toISOString(),
  };
}

function weightedSeverity() {
  const r = Math.random();
  if (r > 0.97) return "critical";
  if (r > 0.85) return "warning";
  if (r > 0.55) return "anomaly";
  return "info";
}

const subsystems = ["mesh", "agents", "rho2", "system"];

const titles = {
  info: [
    "System baseline stable.",
    "Normal mesh traffic observed.",
    "Agent heartbeat verified.",
  ],
  anomaly: [
    "Latency deviation detected.",
    "Unexpected cycle delay observed.",
    "Minor inconsistency in node sync.",
  ],
  warning: [
    "Mesh node responsiveness decreased.",
    "Intermittent agent failure detected.",
    "Rho² shard rotation slower than expected.",
  ],
  critical: [
    "Critical sync failure detected.",
    "Agent cluster instability escalating.",
    "Federation trust fabric anomaly detected.",
  ],
};

const descriptions = {
  info: [
    "No irregularities present across monitored subsystems.",
    "All vitals within expected thresholds.",
  ],
  anomaly: [
    "Pattern irregularity detected. Monitoring trend.",
    "Subsystem activity varies from baseline models.",
  ],
  warning: [
    "Deviation from normal operating patterns. Further action may be required.",
    "Potential stability risk detected. Operator attention recommended.",
  ],
  critical: [
    "Federation stability compromised. Immediate review required.",
    "System integrity outside acceptable bounds. Operator involvement essential.",
  ],
};

