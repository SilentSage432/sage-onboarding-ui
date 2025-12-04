"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WizardNav({
  canBack = true,
  onBack,
  onNext,
  showRestart = false,
  onRestart,
  nextLabel = "Continue",
}: {
  canBack?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  showRestart?: boolean;
  onRestart?: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="flex justify-between items-center mt-10 gap-4">
      {/* Left side: Previous or Restart */}
      <div className="flex gap-3">
        {canBack && onBack && (
          <Button
            variant="secondary"
            onClick={onBack}
          >
            ← Previous
          </Button>
        )}
        {showRestart && onRestart && (
          <Button
            variant="ghost"
            onClick={onRestart}
          >
            Restart
          </Button>
        )}
        {!canBack && !showRestart && <div />}
      </div>

      {/* Right side: Next */}
      {onNext && nextLabel && (
        <Button
          variant="primary"
          onClick={onNext}
          className="group"
        >
          {nextLabel}{" "}
          <span className="transition-transform group-hover:translate-x-[3px] inline-block">
            →
          </span>
        </Button>
      )}
    </div>
  );
}

