"use client";

import { cn } from "@/lib/utils";

export default function ModuleCard({
  selected,
  label,
  onClick,
  icon,
  description,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  description?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "sage-card-base sage-card-hover",
        selected && "sage-card-selected"
      )}
    >
      {icon && (
        <div className="sage-card-icon">
          {icon}
        </div>
      )}
      <div className="sage-card-title">{label}</div>
      {description && (
        <div className="sage-card-desc">{description}</div>
      )}
    </div>
  );
}

