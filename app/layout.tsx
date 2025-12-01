'use client';

import "./styles/global.css";
import { usePathname } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWizard = pathname.startsWith("/wizard");

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-[#040308] via-[#050712] to-[#05070b] text-white antialiased">
        {isWizard ? children : <AppShell>{children}</AppShell>}
      </body>
    </html>
  );
}
