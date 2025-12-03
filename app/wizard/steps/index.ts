// Enterprise Only — Business onboarding flow
import OrganizationProfile from "./business/OrganizationProfile";
import SecurityPosture from "./business/SecurityPosture";
import { Rho2VerificationCard } from "./security/Rho2VerificationCard";
import OperationalPriorities from "./business/OperationalPriorities";
import AgentMarketplaceStep from "./business/AgentMarketplaceStep";
import { BusinessSummaryStep } from "./business";
import FinalSetup from "./FinalSetup";

export interface WizardStepConfig {
  id: string;
  label: string;
  description: string;
  mode: "business";
  // React component type, but we keep it as any to avoid import type issues here.
  // The actual components are React.FC and used in client components.
  Component: any;
  showNext?: boolean; // default: true, but we'll turn it off for special steps
}

// Enterprise Step ID constants for navigation
export const ENTERPRISE_COUNTED_STEPS = [
  "business-industry", // Step 1: ORG_PROFILE
  "business-security", // Step 2: SECURITY_POSTURE
  "rho2-verification", // Step 3: RHO2_VERIFICATION
  "operational-priorities", // Step 4: OPERATIONAL_PRIORITIES
  "business-agent-marketplace", // Step 5: AGENT_MARKETPLACE
  "business-summary", // Step 6: FINAL_REVIEW
];

// System steps (not counted in progress)
export const SYSTEM_STEPS = [
  "final-setup",           // INITIALIZE_ENVIRONMENT
];

export function isSystemStep(stepId: string): boolean {
  return SYSTEM_STEPS.includes(stepId);
}

export function isCountedStep(stepId: string): boolean {
  return ENTERPRISE_COUNTED_STEPS.includes(stepId);
}

// Navigation helpers (Enterprise only)
export function getNextStepId(currentStepId: string): string | null {
  const index = ENTERPRISE_COUNTED_STEPS.indexOf(currentStepId);
  
  if (index === -1) return null;
  if (index === ENTERPRISE_COUNTED_STEPS.length - 1) return "final-setup"; // Jump to initialization
  return ENTERPRISE_COUNTED_STEPS[index + 1];
}

export function getPreviousStepId(currentStepId: string): string | null {
  const index = ENTERPRISE_COUNTED_STEPS.indexOf(currentStepId);
  
  if (index <= 0) return null;
  return ENTERPRISE_COUNTED_STEPS[index - 1];
}

export function getFirstStepId(): string | null {
  return ENTERPRISE_COUNTED_STEPS[0] || null;
}

export function getStepIndex(stepId: string): number {
  return ENTERPRISE_COUNTED_STEPS.indexOf(stepId);
}

export function getCountedStepsCount(): number {
  return ENTERPRISE_COUNTED_STEPS.length;
}

// Enterprise flow only - no account selection, starts directly with organization profile
export function getEnterpriseSteps(): WizardStepConfig[] {
  return [
    {
      id: "business-industry",
      label: "Organization profile",
      description:
        "Describe the company SAGE will support so we can align automations and playbooks.",
      mode: "business",
      Component: OrganizationProfile,
    },
    {
      id: "business-security",
      label: "Security posture",
      description:
        "Capture how strict your environment should be and what SAGE is allowed to touch.",
      mode: "business",
      Component: SecurityPosture,
    },
    {
      id: "rho2-verification",
      label: "Rho² Sovereign Identity Verification",
      description:
        "Mandatory cryptographic identity layer for SAGE ecosystem integrity.",
      mode: "business",
      Component: Rho2VerificationCard,
      showNext: false, // Navigation handled inside the card
    },
    {
      id: "operational-priorities",
      label: "Operational Priorities",
      description:
        "Select the outcomes your organization wants SAGE to focus on. These choices help shape recommendations in the Agent Marketplace.",
      mode: "business",
      Component: OperationalPriorities,
    },
    {
      id: "business-agent-marketplace",
      label: "Agent Marketplace",
      description:
        "Browse and select agents from the SAGE agent marketplace.",
      mode: "business",
      Component: AgentMarketplaceStep,
    },
    {
      id: "business-summary",
      label: "Review & initialize",
      description:
        "Final review before we generate your organization's baseline configuration.",
      mode: "business",
      Component: BusinessSummaryStep,
      showNext: false, // show Finish
    },
    {
      id: "final-setup",
      label: "Preparing your environment",
      description: "Setting up your SAGE environment…",
      mode: "business",
      Component: FinalSetup,
      showNext: false,
    },
  ];
}
