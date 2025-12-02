"use client";

import { FlowConfig } from "./index";
import Step2Business from "./Step2Business";

// Placeholder components for business flow steps
const BusinessIndustry = () => (
  <div className="text-white">Business Industry step</div>
);

const BusinessSecurityProfile = () => (
  <div className="text-white">Business Security Profile step</div>
);

const BusinessInfrastructureRegions = () => (
  <div className="text-white">Business Infrastructure Regions step</div>
);

const BusinessTeamSetup = () => (
  <div className="text-white">Business Team Setup step</div>
);

const BusinessInitialize = () => (
  <div className="text-white">Business Initialize step</div>
);

export const businessFlow: FlowConfig = {
  id: "business",
  steps: [
    {
      id: "company-details",
      title: "Company Details",
      component: Step2Business,
    },
    {
      id: "industry",
      title: "Industry",
      component: BusinessIndustry,
    },
    {
      id: "security-profile",
      title: "Security Profile",
      component: BusinessSecurityProfile,
    },
    {
      id: "infrastructure-regions",
      title: "Infrastructure Regions",
      component: BusinessInfrastructureRegions,
    },
    {
      id: "team-setup",
      title: "Team Setup",
      component: BusinessTeamSetup,
    },
    {
      id: "initialize",
      title: "Initialize",
      component: BusinessInitialize,
    },
  ],
};

