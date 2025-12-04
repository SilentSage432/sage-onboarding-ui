"use client";

import { useEffect, useState } from "react";
import { HadraEvent } from "@/lib/hadra/event";

const subsystems = ["mesh", "agents", "rho2", "system"];

export function useMockEvents() {
  const [events, setEvents] = useState<HadraEvent[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent: HadraEvent = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        subsystem: subsystems[Math.floor(Math.random() * subsystems.length)],
        level: Math.random() > 0.9
          ? "critical"
          : Math.random() > 0.75
          ? "warning"
          : Math.random() > 0.5
          ? "anomaly"
          : "normal",
        message: generateMessage(),
      };

      setEvents((prev) => [...prev.slice(-100), newEvent]); // keep last 100
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return events;
}

function generateMessage() {
  const pool = [
    "Node heartbeat received.",
    "Mesh sync stable.",
    "Agent cycle completed.",
    "Rho² rotation validated.",
    "Latency deviation detected.",
    "Anomaly pattern observed.",
    "Trust fabric handshake delayed.",
    "Subsystem self-check passed.",
    "Event correlation in progress.",
  ];

  return pool[Math.floor(Math.random() * pool.length)];
}

