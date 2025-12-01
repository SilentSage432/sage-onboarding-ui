'use client';

import "./styles/global.css";
import AppShell from "@/components/layout/AppShell";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0c0f] text-white min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
