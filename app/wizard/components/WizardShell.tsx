"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useWizardStore } from "../store/useWizardStore";
import { 
  getEnterpriseSteps, 
  getNextStepId, 
  getPreviousStepId, 
  getFirstStepId,
  getStepIndex,
  getCountedStepsCount,
  isSystemStep,
  isCountedStep
} from "../steps";
import { WizardNav } from "./WizardNav";
import StepTracker from "./StepTracker";

export default function WizardShell() {
  const router = useRouter();
  const { stepIndex, setStepIndex, reset } = useWizardStore();
  // Enterprise only - no mode selection
  const steps = getEnterpriseSteps();
  const safeIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0));
  const step = steps[safeIndex];
  const currentStepId = step?.id || "";
  
  // Navigation helpers (Enterprise only)
  const nextStepId = getNextStepId(currentStepId);
  const prevStepId = getPreviousStepId(currentStepId);
  const firstStepId = getFirstStepId();
  const stepPosition = getStepIndex(currentStepId);
  const countedStepsTotal = getCountedStepsCount();
  
  // Determine step state
  const isSystem = isSystemStep(currentStepId);
  const isCounted = isCountedStep(currentStepId);
  const isFirst = stepPosition === 0;
  const isLastCounted = stepPosition === countedStepsTotal - 1;
  const isFinalStep = currentStepId === "final-setup";

  // Navigation handlers
  const handleBack = () => {
    if (prevStepId) {
      const prevIndex = steps.findIndex(s => s.id === prevStepId);
      if (prevIndex !== -1) {
        setStepIndex(prevIndex);
      }
    }
  };

  const handleNext = () => {
    if (nextStepId) {
      const nextIndex = steps.findIndex(s => s.id === nextStepId);
      if (nextIndex !== -1) {
        setStepIndex(nextIndex);
      }
    }
  };

  const handleFinish = () => {
    router.push("/wizard/initializing");
  };

  const handleRestart = () => {
    if (firstStepId) {
      const firstIndex = steps.findIndex(s => s.id === firstStepId);
      if (firstIndex !== -1) {
        setStepIndex(firstIndex);
      } else {
        reset();
      }
    } else {
      reset();
    }
  };

  // Progress calculation (only for counted steps)
  const progressValue = isCounted && countedStepsTotal > 0
    ? ((stepPosition + 1) / countedStepsTotal) * 100
    : 0;

  const stepKey = `step-${safeIndex}-enterprise`;
  const isBusiness = true; // Enterprise mode is always business

  // Render FinalSetup with full-screen layout
  if (isFinalStep && step?.Component) {
    const FinalSetupComponent = step.Component;
    return (
      <div className="relative w-full flex items-center justify-center min-h-[60vh]">
        <FinalSetupComponent onFinish={handleFinish} />
      </div>
    );
  }

  // Render Rho² step with custom navigation (handles its own navigation)
  if (currentStepId === "rho2-verification" && step?.Component) {
    const Rho2Component = step.Component;
    return (
      <div className="relative w-full flex justify-center py-10">
        <div className="w-full max-w-2xl">
          <Rho2Component />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Ambient neural glow - adapts to mode */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        animate={{
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="h-96 w-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.15) 50%, rgba(6, 182, 212, 0.1) 100%)",
          }}
        />
      </motion.div>

      <Card className="w-full max-w-4xl relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={stepKey}>
            {/* Enterprise Step Tracker */}
            <div className="px-6 pt-6">
              <StepTracker />
            </div>
            <CardHeader className="space-y-3 pb-6">
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
                className="text-xs uppercase tracking-[0.2em] text-slate-400"
              >
                SAGE Onboarding
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
              >
                <CardTitle className="text-2xl">
                  {step?.label ?? "Initializing wizard"}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
              >
                <CardDescription className="text-slate-300">
                  {step?.description ??
                    "Setting up the onboarding shell for your environment."}
                </CardDescription>
              </motion.div>
              {isCounted && countedStepsTotal > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                  className="flex items-center gap-3 pt-2"
                >
                  <Progress value={progressValue} className="h-1.5 flex-1" />
                  <span className="text-xs text-slate-400">
                    Step {stepPosition + 1} of {countedStepsTotal}
                  </span>
                </motion.div>
              )}
            </CardHeader>
            <CardContent className="pt-2 pb-8">
              <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10">
                <div className="flex flex-row items-stretch justify-center gap-10 w-full">
                  {step && step.Component ? <step.Component /> : null}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-6 px-0">
              <WizardNav
                canBack={!isFirst && prevStepId !== null}
                onBack={handleBack}
                onNext={
                  step?.showNext === false
                    ? undefined
                    : isLastCounted
                    ? handleFinish
                    : nextStepId
                    ? handleNext
                    : undefined
                }
                showRestart={!isFirst && stepPosition > 0}
                onRestart={handleRestart}
                nextLabel={
                  step?.showNext === false
                    ? undefined
                    : isLastCounted
                    ? "Finalize & Initialize"
                    : "Continue"
                }
              />
            </CardFooter>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
