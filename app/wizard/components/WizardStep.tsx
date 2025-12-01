import { useWizardStore } from "../store/useWizardStore";

export default function WizardStep() {
  const { step } = useWizardStore();

  return (
    <div className="text-3xl font-semibold text-white tracking-wide">
      Step {step} placeholder
    </div>
  );
}

