"use client";

export default function DockZone({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-xl
        backdrop-blur-md bg-white/5
        border border-white/10
        p-4
        min-h-[300px]
        relative
        overflow-hidden
      "
    >
      {children}
    </div>
  );
}

