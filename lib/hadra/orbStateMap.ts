// lib/hadra/orbStateMap.ts
// HADRA Multimodal State Stack
// Unifies animation, pulse, and gesture classes for layered behavior

import { getOrbPulse, OrbStatus } from "./orbPulse";
import { cn } from "@/lib/utils";

export function resolveOrbClasses(status: OrbStatus): string {
  let gesture = "";

  switch (status) {
    case "idle":
      gesture = "animate-hadra-breath";
      break;
    case "insight":
      gesture = "animate-hadra-flare";
      break;
    case "warning":
      gesture = "animate-hadra-tension";
      break;
    case "critical":
      gesture = "animate-hadra-stutter";
      break;
    case "operator-focus":
      gesture = "animate-hadra-hoverlift";
      break;
    case "analyzing":
      gesture = "animate-hadra-breath";
      break;
    case "onboarding":
      gesture = "animate-hadra-breath";
      break;
    default:
      gesture = "animate-hadra-breath";
  }

  return cn(getOrbPulse(status), gesture);
}

