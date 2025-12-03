"use client";

export default function HadraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      {children}
    </div>
  );
}


