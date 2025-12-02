import { create } from "zustand";

type PersonalData = {
  preferences?: string | null;
  region?: string | null;
};

type BusinessData = {
  industry?: string | null;
  securityProfile?: string | null;
};

type WizardData = {
  personal?: PersonalData;
  business?: BusinessData;
};

export interface WizardState {
  mode: "personal" | "business" | null;
  flow: "personal" | "business" | null;
  step: number;
  totalSteps: number;
  data: WizardData;
  next: () => void;
  prev: () => void;
  setMode: (mode: "personal" | "business") => void;
  setFlow: (flow: "personal" | "business" | null) => void;
  updateField: (path: string, value: string | null) => void;
  reset: () => void;
}

function getTotalSteps(mode: "personal" | "business" | null): number {
  if (mode === "business") return 5;
  if (mode === "personal") return 3;
  return 0;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  mode: null,
  flow: null,
  step: 1,
  totalSteps: 0,
  data: {},

  setMode: (mode) => {
    set({
      mode,
      flow: mode,
      step: 1,
      totalSteps: getTotalSteps(mode),
    });
  },

  setFlow: (flow) => {
    if (!flow) {
      set({
        flow: null,
        mode: null,
        step: 1,
        totalSteps: 0,
      });
      return;
    }
    get().setMode(flow);
  },

  next: () => {
    const { step, totalSteps } = get();
    if (!totalSteps) return;
    set({
      step: Math.min(step + 1, totalSteps),
    });
  },

  prev: () => {
    const { step } = get();
    set({
      step: Math.max(step - 1, 1),
    });
  },

  updateField: (path, value) => {
    if (!path) return;
    const keys = path.split(".").filter(Boolean);
    if (!keys.length) return;

    set((state) => {
      const newData: WizardData = {
        personal: { ...(state.data.personal ?? {}) },
        business: { ...(state.data.business ?? {}) },
      };

      let target: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (target[key] == null || typeof target[key] !== "object") {
          target[key] = {};
        } else {
          target[key] = { ...target[key] };
        }
        target = target[key];
      }

      const lastKey = keys[keys.length - 1];
      target[lastKey] = value;

      return { data: newData };
    });
  },

  reset: () => {
    set({
      mode: null,
      flow: null,
      step: 1,
      totalSteps: 0,
      data: {},
    });
  },
}));
