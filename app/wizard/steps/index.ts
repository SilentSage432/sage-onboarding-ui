import { personalFlow } from "./personal";
import { businessFlow } from "./business";

export interface FlowStep {
  id: string;
  title: string;
  component: React.ComponentType;
}

export interface FlowConfig {
  id: string;
  steps: FlowStep[];
}

export const flows = {
  personal: personalFlow,
  business: businessFlow,
};

export type FlowType = keyof typeof flows;

export function getFlow(type: FlowType | null): FlowConfig | null {
  if (!type) return null;
  return flows[type] || null;
}

