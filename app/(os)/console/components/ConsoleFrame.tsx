"use client";

export default function ConsoleFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        w-full flex-1 overflow-hidden
        pl-20
        pr-8 py-6
        pt-16
        relative z-[var(--z-content)]
        max-lg:pl-0
        max-lg:px-4 max-lg:py-4 max-lg:pt-14
        max-sm:px-3 max-sm:py-3 max-sm:pt-12
        flex gap-6
        max-sm:gap-3
      "
      style={{
        // Ensure content layer never causes background repaint
        isolation: 'isolate',
      }}
    >
      {children}
    </div>
  );
}

