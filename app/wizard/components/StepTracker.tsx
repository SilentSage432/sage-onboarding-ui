"use client";

import { motion } from "framer-motion";
import { useWizardStore } from "../store/useWizardStore";
import { ENTERPRISE_COUNTED_STEPS, getEnterpriseSteps, getStepIndex, isCountedStep } from "../steps";

export default function StepTracker() {
  const { stepIndex } = useWizardStore();
  const allSteps = getEnterpriseSteps();
  const currentStep = allSteps[stepIndex];
  const currentStepId = currentStep?.id || "";
  
  const steps = ENTERPRISE_COUNTED_STEPS;
  const totalSteps = steps.length;

  // Get current step position (1-based for display) from counted steps
  const stepPos = getStepIndex(currentStepId);
  const currentStepPosition = stepPos >= 0 ? stepPos + 1 : 1;
  
  // Only show tracker for counted steps
  if (!isCountedStep(currentStepId)) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center mt-8 mb-6">
      <div className="relative flex items-center gap-3">
        {/* Connecting line background */}
        <div className="absolute left-0 right-0 h-0.5 bg-white/10 -z-10" />
        {/* Progress line */}
        {totalSteps > 1 && (
          <motion.div
            className="absolute left-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-500 -z-10"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(((currentStepPosition - 1) / (totalSteps - 1)) * 100, 100)}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}

        {/* Step nodes */}
        {steps.map((stepId, idx) => {
          const stepNumber = idx + 1;
          const isActive = stepNumber === currentStepPosition;
          const isCompleted = stepNumber < currentStepPosition;
          const isFuture = stepNumber > currentStepPosition;

          return (
            <motion.div
              key={stepId}
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{
                opacity: isActive ? 1 : isCompleted ? 0.8 : 0.4,
                scale: isActive ? 1.2 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              {/* Outer glow ring for active step */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-400/30 blur-md -z-10"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Step node */}
              <div
                className={`
                  h-3 w-3 rounded-full
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]"
                      : isCompleted
                      ? "bg-blue-500/60"
                      : "bg-gray-700/40"
                  }
                `}
              />

              {/* Pulse effect for active step */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

