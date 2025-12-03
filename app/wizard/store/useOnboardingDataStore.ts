"use client";

import { create } from "zustand";

interface PersonalData {
  name: string;
  email: string;
  role: string;
}

interface BusinessData {
  orgName: string;
  businessType: string;
  companySize: string;
}

interface OnboardingState {
  personal: PersonalData;
  business: BusinessData;
  agents: string[];
  selectedAgent: any | null;
  setPersonal: (data: Partial<PersonalData>) => void;
  setBusiness: (data: Partial<BusinessData>) => void;
  addAgent: (name: string) => void;
  removeAgent: (name: string) => void;
  setSelectedAgent: (agent: any | null) => void;
  clearSelectedAgent: () => void;
}

export const useOnboardingDataStore = create<OnboardingState>((set) => ({
  personal: {
    name: "",
    email: "",
    role: "",
  },
  business: {
    orgName: "",
    businessType: "",
    companySize: "",
  },
  agents: [],
  selectedAgent: null,
  setPersonal: (data) =>
    set((state) => ({ personal: { ...state.personal, ...data } })),
  setBusiness: (data) =>
    set((state) => ({ business: { ...state.business, ...data } })),
  addAgent: (name: string) =>
    set((s) => ({ agents: [...s.agents, name] })),
  removeAgent: (name: string) =>
    set((s) => ({
      agents: s.agents.filter((a) => a !== name),
    })),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  clearSelectedAgent: () => set({ selectedAgent: null }),
}));

