"use client";

import { useEffect } from "react";
import { useWizardStore } from "./store/useWizardStore";
import { EnterpriseFormWrapper } from "./components/FormProvider";
import WizardShell from "./components/WizardShell";

export default function WizardPage() {
  const { beginEnterpriseFlow } = useWizardStore();

  // Auto-start enterprise onboarding on load
  useEffect(() => {
    beginEnterpriseFlow();
  }, [beginEnterpriseFlow]);

  return (
    <EnterpriseFormWrapper>
      <WizardShell />
    </EnterpriseFormWrapper>
  );
}
