"use client";

import { useWizardStore } from "../store/useWizardStore";

// Placeholder components for personal flow
const PersonalPreferences = () => (
  <div className="text-white">Personal Preferences step</div>
);

const PersonalRegion = () => (
  <div className="text-white">Personal Region step</div>
);

const PersonalSecurity = () => (
  <div className="text-white">Personal Security step</div>
);

// Placeholder components for business flow
const BusinessIndustry = () => (
  <div className="text-white">Business Industry step</div>
);

const BusinessSecurityProfile = () => (
  <div className="text-white">Business Security Profile step</div>
);

const BusinessRegion = () => (
  <div className="text-white">Business Region step</div>
);

const BusinessUsers = () => (
  <div className="text-white">Business Users step</div>
);

const BusinessFinalize = () => (
  <div className="text-white">Business Finalize step</div>
);

const personalSteps = [
  PersonalPreferences,
  PersonalRegion,
  PersonalSecurity,
];

const businessSteps = [
  BusinessIndustry,
  BusinessSecurityProfile,
  BusinessRegion,
  BusinessUsers,
  BusinessFinalize,
];

export default function WizardStep() {
  const { mode, step } = useWizardStore();

  if (!mode) return null;

  const stepsArray = mode === "personal" ? personalSteps : businessSteps;
  const Component = stepsArray[step - 1];

  if (!Component) return null;

  return <Component />;
}


