"use client";

interface EmptyStateProps {
  label: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ label, icon }: EmptyStateProps) {
  return (
    <div className="w-full py-12 text-center text-white/40 text-sm select-none flex flex-col items-center gap-3">
      {icon && <div className="text-white/30 text-2xl">{icon}</div>}
      <p>{label}</p>
    </div>
  );
}


