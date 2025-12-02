"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWizardStore } from "../store/useWizardStore";
import { getStepsForMode } from "../steps";

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

  const progressValue =
    totalSteps > 1 ? ((safeIndex + 1) / totalSteps) * 100 : 0;

  return (
    <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            SAGE Onboarding
          </p>
          <CardTitle className="text-2xl">
            {step?.label ?? "Initializing wizard"}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {step?.description ??
              "Setting up the onboarding shell for your environment."}
          </CardDescription>
          {totalSteps > 1 && (
            <div className="flex items-center gap-3 pt-2">
              <Progress value={progressValue} className="h-1.5 flex-1" />
              <span className="text-xs text-slate-400">
                Step {safeIndex + 1} of {totalSteps}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          {step && step.Component ? <step.Component /> : null}
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            {!isFirst && totalSteps > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                Back
              </Button>
            )}
            {(mode !== null || safeIndex === 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="text-xs text-slate-400 border-slate-700 hover:bg-slate-900"
              >
                Restart
              </Button>
            )}
          </div>
          {/* Navigation on the right */}
          <div className="flex items-center gap-2">
            {/* For the account-type selector step, Next is hidden (cards handle nav) */}
            {step?.showNext === false && !isLast ? null : null}
            {/* Normal Next */}
            {step?.showNext !== false && !isLast && totalSteps > 0 && (
              <Button size="sm" onClick={handleNext}>
                Continue
              </Button>
            )}
            {/* Finish button on the last step with showNext === false */}
            {isLast && step?.showNext === false && (
              <Button size="sm" variant="default">
                Finish
              </Button>
            )}
          </div>
        </CardFooter>
    </Card>
  );
}
