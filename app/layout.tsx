import "./globals.css";

export const metadata = {
  title: "SAGE Onboarding",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-black text-white">
        {children}
      </body>
    </html>
  );
}