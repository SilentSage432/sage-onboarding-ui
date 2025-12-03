import "./globals.css";
import DockIcon from "@/components/system/DockIcon";
import HadraConsole from "@/components/system/HadraConsole";

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
        {/* Global assistant dock */}
        <DockIcon />
        {/* HADRA console (hidden until triggered) */}
        <HadraConsole />
      </body>
    </html>
  );
}
