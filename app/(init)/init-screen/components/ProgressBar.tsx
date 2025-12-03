export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1 bg-white/10 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-[1400ms] ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

