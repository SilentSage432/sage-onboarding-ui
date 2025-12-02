"use client";

import { FlowConfig } from "./index";
import Step2Personal from "./Step2Personal";

// Placeholder components for personal flow steps
const PersonalPreferences = () => (
  <div className="text-white">Personal Preferences step</div>
);

const PersonalRegion = () => (
  <div className="text-white">Personal Region step</div>
);

const PersonalInitialize = () => (
  <div className="text-white">Personal Initialize step</div>
);

export const personalFlow: FlowConfig = {
  id: "personal",
  steps: [
    {
      id: "personal-setup",
      title: "Personal Setup",
      component: Step2Personal,
    },
    {
      id: "preferences",
      title: "Preferences",
      component: PersonalPreferences,
    },
    {
      id: "region",
      title: "Region",
      component: PersonalRegion,
    },
    {
      id: "initialize",
      title: "Initialize",
      component: PersonalInitialize,
    },
  ],
};

