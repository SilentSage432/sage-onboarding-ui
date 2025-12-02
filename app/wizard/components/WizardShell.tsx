"use client";

import { AnimatePresence } from "framer-motion";
import { useWizardStore } from "../store/useWizardStore";
import Step1 from "./Step1";
import TransitionWrapper from "./TransitionWrapper";

export default function WizardShell() {
  const { mode, getCurrentStep } = useWizardStore();

  // Determine current step key for AnimatePresence
  const currentStep = getCurrentStep();
  const stepKey = !mode ? "step1-mode-selection" : currentStep?.id || "step1-fallback";
  const CurrentComponent = !mode ? Step1 : currentStep?.component || Step1;

  return (
    <AnimatePresence mode="wait">
      <TransitionWrapper key={stepKey} stepId={stepKey}>
        <CurrentComponent />
      </TransitionWrapper>
    </AnimatePresence>
  );
}
