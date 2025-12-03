"use client";

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
    <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/5">
      {/* Left side: Previous or Restart */}
      <div className="flex gap-3">
        {canBack && onBack && (
          <button
            onClick={onBack}
            className="sage-btn sage-btn-ghost"
          >
            ← Previous
          </button>
        )}
        {showRestart && onRestart && (
          <button
            onClick={onRestart}
            className="sage-btn sage-btn-ghost"
          >
            Restart
          </button>
        )}
        {!canBack && !showRestart && <div />}
      </div>

      {/* Right side: Next */}
      {onNext && nextLabel && (
        <button
          onClick={onNext}
          className="sage-btn sage-btn-primary"
        >
          {nextLabel} →
        </button>
      )}
    </div>
  );
}

