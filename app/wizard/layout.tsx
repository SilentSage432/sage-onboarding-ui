export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0e11] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {children}
      </div>
    </div>
  );
}


