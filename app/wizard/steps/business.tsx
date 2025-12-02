"use client";

import { Input } from "@/components/ui/input";
import WizardCard from "../components/WizardCard";

export const BusinessIndustryStep = () => (
  <WizardCard
    title="Business Industry"
    description="We adapt workflows and integrations to match industry needs."
  >
    <Input placeholder="Industry type" className="h-12" />
    <p className="text-sm text-white/50 mt-2">
      Used to configure the business operating system. Example: Retail, e-commerce, appliances, healthcare, service, etc.
    </p>
  </WizardCard>
);

export const BusinessSecurityProfileStep = () => (
  <WizardCard
    title="Security & Profile"
    description="We configure automation and protection based on operational risk."
  >
    <Input placeholder="Security level" className="h-12" />
    <p className="text-sm text-white/50 mt-2">
      Frameworks, compliance, risk score, etc.
    </p>
  </WizardCard>
);

export const BusinessSummaryStep = () => (
  <WizardCard
    title="Review & Initialize"
    description="Final review before we generate your organization's baseline configuration."
  >
    <div className="space-y-2 text-sm text-slate-200">
      <p>• Org profile seeded for future agents</p>
      <p>• Initial security posture documented</p>
      <p>• Starting point for live federation onboarding</p>
    </div>
  </WizardCard>
);
