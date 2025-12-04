"use client";

import { useState, useEffect } from "react";
import { SystemContext } from "@/lib/hadra/systemContext";

export function useSystemContext() {
  const [system, setSystem] = useState<SystemContext>({
    loadLevel: 0.2,
    anomalyRate: 0.0,
    uptimeHours: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystem((prev) => ({
        loadLevel: Math.random() * 0.5,
        anomalyRate: Math.random() * 0.3,
        uptimeHours: prev.uptimeHours + 0.01,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return system;
}

