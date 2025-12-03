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
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm md:text-base text-white/60 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

