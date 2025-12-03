"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

export function TextField({
  name,
  label,
  placeholder,
  className,
}: {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn("sage-stack", className)}>
      <label className="sage-label text-white/80 tracking-wide">{label}</label>
      <input
        {...register(name)}
        placeholder={placeholder}
        className={cn(
          "sage-input",
          error && "border-red-400/50 focus:ring-red-400/40"
        )}
      />
      {error && (
        <p className="text-xs text-red-400">{String(error.message || "This field is required")}</p>
      )}
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  className,
}: {
  name: string;
  label: string;
  options: string[];
  className?: string;
}) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className={cn("sage-stack", className)}>
      <label className="sage-label text-white/80 tracking-wide">{label}</label>
      <select
        {...register(name)}
        className={cn(
          "sage-input",
          error && "border-red-400/50 focus:ring-red-400/40"
        )}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option value={o} key={o} className="bg-slate-900">
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-400">{String(error.message || "This field is required")}</p>
      )}
    </div>
  );
}

