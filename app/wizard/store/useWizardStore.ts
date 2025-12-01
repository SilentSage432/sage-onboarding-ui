import { create } from "zustand";

export interface WizardState {
  step: number;
  totalSteps: number;
  next: () => void;
  prev: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  step: 1,
  totalSteps: 4,
  next: () => set((s) => ({ step: Math.min(s.step + 1, s.totalSteps) })),
  prev: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
}));


