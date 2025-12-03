export default function SectionDivider({ label }: { label: string }) {
  return (
    <div className="my-10">
      <h2 className="text-white/80 text-sm tracking-wide mb-3">
        {label.toUpperCase()}
      </h2>
      <div className="w-full h-px bg-gradient-to-r from-purple-600/40 to-transparent" />
    </div>
  );
}

