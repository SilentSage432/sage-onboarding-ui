// lib/hadra/operatorContext.ts

export interface OperatorContext {
  activePanel: string;        // "dashboard" | "mesh" | "agents" | ...
  lastInteraction: string;    // button pressed, panel opened, etc.
  focusLevel: number;         // 0–1 scale (future adaptive UX)
  mode: "onboarding" | "production";
}

