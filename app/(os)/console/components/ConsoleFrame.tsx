"use client";

export default function ConsoleFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        w-full h-full overflow-hidden
        pl-20
        pr-8 py-6
        pt-16
        relative z-[var(--z-content)]
        max-lg:pl-0
        max-lg:px-4 max-lg:py-4
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

