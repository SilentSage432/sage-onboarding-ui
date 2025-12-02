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
  setPersonal: (data: Partial<PersonalData>) => void;
  setBusiness: (data: Partial<BusinessData>) => void;
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
  setPersonal: (data) =>
    set((state) => ({ personal: { ...state.personal, ...data } })),
  setBusiness: (data) =>
    set((state) => ({ business: { ...state.business, ...data } })),
}));

