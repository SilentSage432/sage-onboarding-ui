export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/3 to-white/5 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.25),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(45,212,191,0.18),_transparent_55%)] opacity-70" />

        {/* Content */}
        <div className="relative p-8 md:p-10 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}


