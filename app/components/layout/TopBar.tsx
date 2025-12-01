import useOnboardingStore from "@/lib/store/useOnboardingStore";

export default function TopBar() {
  const { operator, registered, authenticated } = useOnboardingStore();

  const statusLabel = (() => {
    if (!registered) return "Unregistered";
    if (registered && !authenticated) return "Pending auth";
    return "Authenticated";
  })();

  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 text-sm">
        <div className="flex items-center gap-2 font-semibold tracking-wide">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>SAGE Onboarding</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Operator</span>
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[11px]">
              {operator ?? "prime"}
            </span>
            <span className="text-neutral-500">/</span>
            <span>{statusLabel}</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span className="rounded-full border border-neutral-800 px-2 py-0.5">
              Federated Status
            </span>
            <span className="rounded-full border border-neutral-800 px-2 py-0.5">
              Operator Terminal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}


