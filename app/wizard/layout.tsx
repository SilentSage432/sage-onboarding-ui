export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0e11] text-white flex flex-col items-center justify-center px-8 py-10">
      {children}
    </div>
  );
}


