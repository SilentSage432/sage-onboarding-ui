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
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-white/70">{label}</label>
      <input
        {...register(name)}
        placeholder={placeholder}
        className={cn(
          "rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/50",
          "placeholder:text-white/40",
          error && "border-red-400/50 focus:ring-red-400"
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
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-white/70">{label}</label>
      <select
        {...register(name)}
        className={cn(
          "rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400/50",
          "placeholder:text-white/40",
          error && "border-red-400/50 focus:ring-red-400"
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

