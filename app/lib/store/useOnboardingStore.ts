import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Company = Record<string, unknown> | null;
type PersonalData = Record<string, unknown> | null;

interface OnboardingState {
  operator: string | null;
  registered: boolean;
  authenticated: boolean;
  company: Company;
  agents: string[];
  regions: string[];
  personalData: PersonalData;
  activeStep: string;
  setOperator: (operator: string | null) => void;
  setRegistered: (registered: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setCompany: (company: Company) => void;
  setAgents: (agents: string[]) => void;
  setRegions: (regions: string[]) => void;
  setPersonalData: (data: PersonalData) => void;
  setActiveStep: (step: string) => void;
  reset: () => void;
}

const initialState: Omit<
  OnboardingState,
  | "setOperator"
  | "setRegistered"
  | "setAuthenticated"
  | "setCompany"
  | "setAgents"
  | "setRegions"
  | "setPersonalData"
  | "setActiveStep"
  | "reset"
> = {
  operator: null,
  registered: false,
  authenticated: false,
  company: null,
  agents: [],
  regions: [],
  personalData: null,
  activeStep: "select",
};

export const useOnboardingStore = create<OnboardingState>()(
  immer((set) => ({
    ...initialState,
    setOperator: (operator) =>
      set((state) => {
        state.operator = operator;
      }),
    setRegistered: (registered) =>
      set((state) => {
        state.registered = registered;
      }),
    setAuthenticated: (authenticated) =>
      set((state) => {
        state.authenticated = authenticated;
      }),
    setCompany: (company) =>
      set((state) => {
        state.company = company;
      }),
    setAgents: (agents) =>
      set((state) => {
        state.agents = agents;
      }),
    setRegions: (regions) =>
      set((state) => {
        state.regions = regions;
      }),
    setPersonalData: (data) =>
      set((state) => {
        state.personalData = data;
      }),
    setActiveStep: (step) =>
      set((state) => {
        state.activeStep = step;
      }),
    reset: () =>
      set((state) => {
        state.operator = initialState.operator;
        state.registered = initialState.registered;
        state.authenticated = initialState.authenticated;
        state.company = initialState.company;
        state.agents = initialState.agents;
        state.regions = initialState.regions;
        state.personalData = initialState.personalData;
        state.activeStep = initialState.activeStep;
      }),
  }))
);

export default useOnboardingStore;


