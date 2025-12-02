"use client";

import { Input } from "@/components/ui/input";
import WizardCard from "../components/WizardCard";

export const PersonalPreferencesStep = () => (
  <WizardCard
    title="Personal Preferences"
    description="Help us understand your ideal experience."
  >
    <Input
      placeholder="Your preferred experience"
      className="h-12"
    />
    <p className="text-sm text-white/50 mt-2">
      This helps personalize your console environment. For example: Productivity, security, automation, creative, etc.
    </p>
  </WizardCard>
);

export const PersonalRegionStep = () => (
  <WizardCard
    title="Region & Availability"
    description="We optimize based on region and availability."
  >
    <Input
      placeholder="Where are you located?"
      className="h-12"
    />
    <p className="text-sm text-white/50 mt-2">
      Used for secure routing, privacy and resource optimization.
    </p>
  </WizardCard>
);

export const PersonalSummaryStep = () => (
  <WizardCard
    title="Review & Initialize"
    description="Review your personal profile before we initialize your workspace configuration."
  >
    <div className="space-y-2 text-sm text-slate-200">
      <p>• Workspace layout preset</p>
      <p>• Notification profile and cadence</p>
      <p>• Region-aware logs and scheduling defaults</p>
    </div>
  </WizardCard>
);
