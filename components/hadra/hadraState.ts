"use client";

import { create } from "zustand";

/**
 * HADRA State Store
 * Global state management for HADRA-01
 */
interface HadraState {
  mode: "idle" | "analyzing" | "insight" | "warning" | "critical";
  setMode: (mode: HadraState["mode"]) => void;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
}

export const useHadraState = create<HadraState>((set) => ({
  mode: "idle",
  setMode: (mode) => set({ mode }),
  consoleOpen: false,
  setConsoleOpen: (open) => set({ consoleOpen: open }),
}));

