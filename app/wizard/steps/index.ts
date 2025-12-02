import type { WizardMode } from "../store/useWizardStore";
import AccountTypeStep from "./select";
import {
  PersonalPreferencesStep,
  PersonalRegionStep,
  PersonalSummaryStep,
} from "./personal";
import {
  BusinessIndustryStep,
  BusinessSecurityProfileStep,
  BusinessSummaryStep,
} from "./business";

export interface WizardStepConfig {
  id: string;
  label: string;
  description: string;
  mode: WizardMode | "any";
  // React component type, but we keep it as any to avoid import type issues here.
  // The actual components are React.FC and used in client components.
  Component: any;
  showNext?: boolean; // default: true, but we'll turn it off for special steps
}

export function getStepsForMode(mode: WizardMode): WizardStepConfig[] {
  const base: WizardStepConfig[] = [
    {
      id: "select-account",
      label: "Choose account type",
      description:
        "Select whether you're setting up SAGE for yourself or for an organization.",
      mode: "any",
      Component: AccountTypeStep,
      showNext: false, // the cards themselves advance the wizard
    },
  ];

  if (mode === "personal") {
    return [
      ...base,
      {
        id: "personal-preferences",
        label: "Personal setup",
        description:
          "Tell SAGE how you prefer to work so your environment feels natural from day one.",
        mode: "personal",
        Component: PersonalPreferencesStep,
      },
      {
        id: "personal-region",
        label: "Region & privacy",
        description:
          "Confirm your region and baseline privacy posture so logs and automations stay aligned.",
        mode: "personal",
        Component: PersonalRegionStep,
      },
      {
        id: "personal-summary",
        label: "Review & initialize",
        description:
          "Review your personal profile before we initialize your workspace configuration.",
        mode: "personal",
        Component: PersonalSummaryStep,
        showNext: false, // show Finish instead of Next
      },
    ];
  }

  if (mode === "business") {
    return [
      ...base,
      {
        id: "business-industry",
        label: "Organization profile",
        description:
          "Describe the company SAGE will support so we can align automations and playbooks.",
        mode: "business",
        Component: BusinessIndustryStep,
      },
      {
        id: "business-security",
        label: "Security posture",
        description:
          "Capture how strict your environment should be and what SAGE is allowed to touch.",
        mode: "business",
        Component: BusinessSecurityProfileStep,
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
    ];
  }

  // No mode selected yet: only show the account-type step.
  return base;
}
