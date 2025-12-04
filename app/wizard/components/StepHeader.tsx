"use client";

export default function StepHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="sage-stack">
      <h1 className="text-2xl font-semibold tracking-wide text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

