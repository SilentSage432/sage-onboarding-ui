import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTE_STEPS } from "@/lib/constants/routes";
import useOnboardingStore from "@/lib/store/useOnboardingStore";

export default function SideNav() {
  const pathname = usePathname();
  const activeStep = useOnboardingStore((state) => state.activeStep);
  const setActiveStep = useOnboardingStore((state) => state.setActiveStep);

  const items = ROUTE_STEPS.map((route) => {
    const segment = route.split("/").filter(Boolean).pop() ?? "";
    const label = segment
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return {
      route,
      step: segment,
      label,
    };
  });

  const currentPathStep =
    pathname.startsWith("/onboarding") || pathname.startsWith("/dashboard")
      ? pathname.split("/").filter(Boolean).pop() ?? activeStep
      : activeStep;

  return (
    <nav className="flex flex-col gap-4 text-sm text-neutral-300">
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Onboarding Flow
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = currentPathStep === item.step || activeStep === item.step;
          return (
            <li key={item.route}>
              <Link
                href={item.route}
                onClick={() => setActiveStep(item.step)}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


