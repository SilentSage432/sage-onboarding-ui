"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWizardStore } from "../store/useWizardStore";

const modules = [
  {
    title: "Automation",
    desc: "Automate workflows, scheduling, POS and inventory operations.",
  },
  {
    title: "Monitoring",
    desc: "Track health, logs, events, and system status in real time.",
  },
  {
    title: "Analytics",
    desc: "Business intelligence, reporting, forecasting and KPIs.",
  },
  {
    title: "Infrastructure",
    desc: "Networking, deployment, cloud, federation and Pi clusters.",
  },
];

export default function BusinessModuleSelect() {
  const { setStepIndex, stepIndex } = useWizardStore();

  const handleSelect = () => {
    // Advance to next step when module is selected
    setStepIndex(stepIndex + 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {modules.map((m, i) => (
        <Card
          key={i}
          className="bg-white/10 backdrop-blur-md border-white/20 hover:border-white/40 transition-all duration-300"
        >
          <CardHeader>
            <CardTitle>{m.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70 mb-4">{m.desc}</p>
            <Button onClick={handleSelect} className="w-full">
              Select Module
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

