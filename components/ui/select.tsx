"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SelectProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ options, value, onChange, placeholder = "Select…", className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div
        onClick={() => setOpen(!open)}
        className="sage-select-trigger"
      >
        <span>{value || placeholder}</span>
        <span className="opacity-50">⌄</span>
      </div>
      {open && (
        <div className="absolute mt-2 w-full sage-select-content z-50">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange?.(opt);
                setOpen(false);
              }}
              className={cn(
                "sage-select-item",
                value === opt && "sage-select-item-active"
              )}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


