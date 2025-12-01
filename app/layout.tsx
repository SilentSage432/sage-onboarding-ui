export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0c0f] text-white min-h-screen antialiased">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Temporary nav placeholder */}
          <header className="mb-10 text-xl font-semibold tracking-wide">
            SAGE Onboarding
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
