"use client";

import { useOnboardingDataStore } from "@/app/wizard/store/useOnboardingDataStore";
import WizardCard from "../../components/WizardCard";
import { motion } from "framer-motion";

const priorities = [
  {
    id: "efficiency",
    label: "Operational Efficiency",
    desc: "Optimize workflows, reduce manual effort, streamline processes.",
  },
  {
    id: "security",
    label: "Security & Threat Reduction",
    desc: "Strengthen visibility, detection, and protective measures across your environment.",
  },
  {
    id: "analytics",
    label: "Analytics & Forecasting",
    desc: "Enhance data awareness, predictions, and organizational insights.",
  },
  {
    id: "automation",
    label: "Automation & Workflows",
    desc: "Automate repeatable tasks and empower autonomous agents.",
  },
  {
    id: "inventory",
    label: "Inventory Intelligence",
    desc: "Track, manage, and predict inventory flows automatically.",
  },
  {
    id: "team",
    label: "Team Collaboration",
    desc: "Enhance communication, coordination, and operational alignment.",
  },
];

export default function OperationalPriorities() {
  const { operationalPriorities, setOperationalPriorities } =
    useOnboardingDataStore();

  const toggle = (id: string) => {
    if (operationalPriorities.includes(id)) {
      setOperationalPriorities(
        operationalPriorities.filter((p) => p !== id)
      );
    } else {
      setOperationalPriorities([...operationalPriorities, id]);
    }
  };

  return (
    <WizardCard
      title="Operational Priorities"
      description="Define what SAGE should optimize and focus on for your organization."
    >
      <div className="grid grid-cols-1 gap-4">
        {priorities.map((p) => (
          <motion.button
            key={p.id}
            onClick={() => toggle(p.id)}
            className={`
              text-left p-5 rounded-xl transition-all border 
              ${
                operationalPriorities.includes(p.id)
                  ? "bg-purple-600/20 border-purple-500 text-white"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              }
            `}
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-lg font-semibold">{p.label}</div>
            <div className="text-sm text-gray-400 mt-1">{p.desc}</div>
          </motion.button>
        ))}
      </div>
    </WizardCard>
  );
}

