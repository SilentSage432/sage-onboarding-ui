"use client";

import { useWizardStore } from "../store/useWizardStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const categories = [
  "Automation",
  "Security",
  "Monitoring",
  "Analytics",
  "Workflow",
  "Commerce",
  "Incident Response",
  "Retail Ops",
  "Scheduling",
  "Customer Service",
];

const agents: Record<string, Array<{ name: string; desc: string }>> = {
  Automation: [
    { name: "AutoPilot", desc: "Automate daily tasks & workflows." },
    { name: "DataPulse", desc: "Extract, clean and process business data." },
  ],
  Security: [
    { name: "Rho2 Shield", desc: "Fraud + threat detection agent." },
    { name: "VaultKeeper", desc: "Credential and identity enforcement." },
  ],
  Monitoring: [
    { name: "Sentinel", desc: "System telemetry intelligence." },
  ],
};

export default function BusinessAgentMarketplace() {
  const { addAgent } = useWizardStore();
  const [selectedCategory, setSelectedCategory] = useState("Automation");

  return (
    <div className="flex gap-6 w-full">
      <div className="grid grid-cols-1 gap-3 w-[40%]">
        {categories.map((cat) => (
          <Card
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "p-4 cursor-pointer transition",
              selectedCategory === cat
                ? "bg-white bg-opacity-10 border-white"
                : "bg-white/5 hover:bg-white/10"
            )}
          >
            <h3 className="text-lg font-semibold">{cat}</h3>
          </Card>
        ))}
      </div>
      <div className="w-[60%] grid grid-cols-2 gap-4">
        {(agents[selectedCategory] || []).map((agent) => (
          <Card
            key={agent.name}
            className="p-4 bg-white/5 hover:bg-white/10 transition agent-card"
          >
            <h4 className="font-medium">{agent.name}</h4>
            <p className="text-sm text-white/70">{agent.desc}</p>
            <Button
              className="w-full mt-3"
              onClick={() => addAgent(agent.name)}
            >
              Add Agent
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

