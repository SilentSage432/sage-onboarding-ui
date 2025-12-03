"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOnboardingDataStore } from "../store/useOnboardingDataStore";

const agents = [
  {
    title: "InventorySync Agent",
    desc: "Real-time inventory automation and reconciliation.",
  },
  {
    title: "AutoScheduler Agent",
    desc: "Task and workflow pipeline automation.",
  },
  {
    title: "OrderFlow Agent",
    desc: "Sales, order, and POS automation pipeline.",
  },
  {
    title: "HealthPulse Agent",
    desc: "System heartbeat, uptime, logs and alerts.",
  },
  {
    title: "BI Engine",
    desc: "Reporting, forecasting, BI dashboards.",
  },
  {
    title: "Pi Cluster Init Agent",
    desc: "Prepare micro-clusters and federation nodes.",
  },
];

export default function BusinessAgentSelect() {
  const add = useOnboardingDataStore((s) => s.addAgent);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {agents.map((a, i) => (
        <Card
          key={i}
          className="bg-white/10 backdrop-blur-md border-white/20 hover:border-white/40 transition-all duration-300"
        >
          <CardHeader>
            <CardTitle>{a.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70 mb-4">{a.desc}</p>
            <Button className="w-full" onClick={() => add(a.title)}>
              Add to Deployment
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

