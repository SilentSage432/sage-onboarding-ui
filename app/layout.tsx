import "./globals.css";
// UX-E24: Legacy DockIcon and HadraConsole removed - HADRA now integrated via console layout
// import DockIcon from "@/components/system/DockIcon";
// import HadraConsole from "@/components/system/HadraConsole";

export const metadata = {
  title: "SAGE Onboarding",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-black text-white relative">
        {children}
        {/* UX-E24: HADRA Orb is now injected globally via console layout */}
        {/* Legacy global dock removed */}
      </body>
    </html>
  );
}
