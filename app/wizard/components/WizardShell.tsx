"use client";

import { AnimatePresence } from "framer-motion";
import { useWizardStore } from "../store/useWizardStore";
import Step1 from "./Step1";
import TransitionWrapper from "./TransitionWrapper";
import WizardStep from "./WizardStep";

export default function WizardShell() {
  const { mode, step } = useWizardStore();

  const hasMode = !!mode;
  const stepKey = hasMode
    ? `mode-${mode}-step-${step}`
    : "step1-mode-selection";

  const CurrentComponent = hasMode ? WizardStep : Step1;

  return (
    <AnimatePresence mode="wait">
      <TransitionWrapper stepId={stepKey}>
        <CurrentComponent />
      </TransitionWrapper>
    </AnimatePresence>
  );
}
