'use client';

import "./styles/global.css";
import AppShell from "@/components/layout/AppShell";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#040308] via-[#050712] to-[#05070b] text-white antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
