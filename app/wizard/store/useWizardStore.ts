import { create } from "zustand";

export type WizardMode = "personal" | "business" | null;

interface WizardState {
  mode: WizardMode;
  stepIndex: number;
  setMode: (mode: Exclude<WizardMode, null>) => void;
  setStepIndex: (index: number) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  mode: null,
  stepIndex: 0,
  setMode: (mode) =>
    set({
      mode,
      stepIndex: 0, // always start at the beginning for a new mode
    }),
  setStepIndex: (index) =>
    set({
      stepIndex: index,
    }),
  reset: () =>
    set({
      mode: null,
      stepIndex: 0,
    }),
}));
