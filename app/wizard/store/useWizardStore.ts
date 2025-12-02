import { create } from "zustand";
import { getFlow, type FlowType } from "../steps";

type WizardMode = FlowType | null;

interface WizardState {
  mode: WizardMode;
  stepIndex: number;
  setMode: (mode: WizardMode) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  getCurrentStep: () => { id: string; title: string; component: React.ComponentType } | null;
  canGoNext: () => boolean;
  canGoPrev: () => boolean;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  mode: null,
  stepIndex: 0,
  
  setMode: (mode) => {
    set({ mode, stepIndex: 0 });
  },
  
  nextStep: () => {
    const { mode, stepIndex } = get();
    const flow = getFlow(mode);
    if (flow && stepIndex < flow.steps.length - 1) {
      set({ stepIndex: stepIndex + 1 });
    }
  },
  
  prevStep: () => {
    const { stepIndex } = get();
    if (stepIndex > 0) {
      set({ stepIndex: stepIndex - 1 });
    }
  },
  
  reset: () => {
    set({ mode: null, stepIndex: 0 });
  },
  
  getCurrentStep: () => {
    const { mode, stepIndex } = get();
    const flow = getFlow(mode);
    if (!flow) return null;
    return flow.steps[stepIndex] || null;
  },
  
  canGoNext: () => {
    const { mode, stepIndex } = get();
    const flow = getFlow(mode);
    if (!flow) return false;
    return stepIndex < flow.steps.length - 1;
  },
  
  canGoPrev: () => {
    const { stepIndex } = get();
    return stepIndex > 0;
  },
}));
