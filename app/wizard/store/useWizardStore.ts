import { create } from "zustand";

interface WizardState {
  flow: "business";
  stepIndex: number;
  agents: string[];
  recommendedAgents: string[];
  beginEnterpriseFlow: () => void;
  setStepIndex: (index: number) => void;
  addAgent: (agent: string) => void;
  setRecommendedAgents: (ids: string[]) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  flow: "business",
  stepIndex: 0,
  agents: [],
  recommendedAgents: [],
  beginEnterpriseFlow: () =>
    set({
      flow: "business",
      stepIndex: 0,
    }),
  setStepIndex: (index) =>
    set({
      stepIndex: index,
    }),
  addAgent: (agent: string) =>
    set((state) => ({
      agents: [...state.agents, agent],
    })),
  setRecommendedAgents: (ids: string[]) =>
    set({
      recommendedAgents: ids,
    }),
  reset: () =>
    set({
      flow: "business",
      stepIndex: 0,
      agents: [],
      recommendedAgents: [],
    }),
}));
