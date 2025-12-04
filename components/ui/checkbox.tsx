"use client";

import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked = false, onChange, className }: CheckboxProps) {
  return (
    <div
      onClick={() => onChange?.(!checked)}
      className={cn(
        "sage-checkbox",
        checked && "sage-checkbox-checked",
        className
      )}
    >
      {checked && <div className="text-white text-xs font-bold">✓</div>}
    </div>
  );
}


