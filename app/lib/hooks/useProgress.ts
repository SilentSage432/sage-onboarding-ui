import useOnboardingStore from "@/lib/store/useOnboardingStore";

const STEP_ORDER = [
  "select",
  "company",
  "data-regions",
  "agents",
  "access",
  "review",
  "verified",
] as const;

type StepId = (typeof STEP_ORDER)[number];

export function useProgress() {
  const activeStep = useOnboardingStore((state) => state.activeStep);
  const setActiveStep = useOnboardingStore((state) => state.setActiveStep);

  const goTo = (step: StepId) => {
    setActiveStep(step);
  };

  const next = () => {
    const index = STEP_ORDER.indexOf(activeStep as StepId);
    const currentIndex = index === -1 ? 0 : index;
    const nextIndex = Math.min(currentIndex + 1, STEP_ORDER.length - 1);
    setActiveStep(STEP_ORDER[nextIndex]);
  };

  const prev = () => {
    const index = STEP_ORDER.indexOf(activeStep as StepId);
    const currentIndex = index === -1 ? 0 : index;
    const prevIndex = Math.max(currentIndex - 1, 0);
    setActiveStep(STEP_ORDER[prevIndex]);
  };

  return {
    activeStep,
    steps: STEP_ORDER,
    next,
    prev,
    goTo,
  };
}

export default useProgress;


