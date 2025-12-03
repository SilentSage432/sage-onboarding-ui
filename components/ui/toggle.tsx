"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
  className?: string;
}

export function Toggle({ enabled = false, onChange, className }: ToggleProps) {
  return (
    <div
      className={cn(
        "sage-toggle",
        enabled && "sage-toggle-enabled",
        className
      )}
      onClick={() => onChange?.(!enabled)}
    >
      <div
        className={cn(
          "sage-toggle-knob",
          enabled && "sage-toggle-knob-enabled"
        )}
      />
    </div>
  );
}

