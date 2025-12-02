"use client";

import { AnimatePresence, motion } from "framer-motion";
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
import { getStepsForMode } from "../steps";
import { WizardNav } from "./WizardNav";

export default function WizardShell() {
  const { mode, stepIndex, setStepIndex, reset } = useWizardStore();
  const steps = getStepsForMode(mode);
  const safeIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0));
  const step = steps[safeIndex];
  const totalSteps = steps.length;
  const isFirst = safeIndex === 0;
  const isLast = totalSteps > 0 && safeIndex === totalSteps - 1;

  const handleBack = () => {
    if (!isFirst) {
      setStepIndex(safeIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setStepIndex(safeIndex + 1);
    }
  };

  const handleFinish = () => {
    // Finish handler - can be extended later for final submission
    console.log("Wizard completed");
  };

  const progressValue =
    totalSteps > 1 ? ((safeIndex + 1) / totalSteps) * 100 : 0;

  const stepKey = `step-${safeIndex}-${mode ?? "none"}`;
  const isPersonal = mode === "personal";
  const isBusiness = mode === "business";

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
            background: isPersonal
              ? "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 50%, rgba(168, 85, 247, 0.1) 100%)"
              : isBusiness
              ? "radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.15) 50%, rgba(6, 182, 212, 0.1) 100%)"
              : "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(168, 85, 247, 0.1) 100%)",
          }}
        />
      </motion.div>

      <Card className="w-full max-w-4xl relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={stepKey}>
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
              {totalSteps > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                  className="flex items-center gap-3 pt-2"
                >
                  <Progress value={progressValue} className="h-1.5 flex-1" />
                  <span className="text-xs text-slate-400">
                    Step {safeIndex + 1} of {totalSteps}
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
            <CardFooter>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
              >
                <WizardNav
                  canBack={safeIndex > 0}
                  onBack={handleBack}
                  onNext={
                    step?.showNext === false
                      ? undefined
                      : safeIndex < totalSteps - 1
                      ? handleNext
                      : handleFinish
                  }
                  showRestart={safeIndex === 0 || mode !== null}
                  onRestart={reset}
                  nextLabel={
                    step?.showNext === false
                      ? undefined
                      : safeIndex < totalSteps - 1
                      ? "Continue"
                      : "Finish"
                  }
                />
              </motion.div>
            </CardFooter>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
