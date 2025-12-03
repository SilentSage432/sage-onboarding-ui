export interface Bundle {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
  premium?: boolean;
  agents: string[];
}

export const bundles: Bundle[] = [
  {
    id: "operational_essentials",
    name: "Operational Essentials Pack",
    description:
      "A balanced starter configuration recommended for most organizations.",
    recommended: true,
    agents: [
      "system_monitor",
      "auto_reports",
      "audit_guard",
      "auto_workflows",
    ],
  },
  {
    id: "security_compliance",
    name: "Security & Compliance Pack",
    description:
      "Optimized for organizations focused on compliance, monitoring, and risk.",
    agents: [
      "threat_detect",
      "audit_guard",
      "event_watcher",
    ],
  },
  {
    id: "automation_first",
    name: "Automation First Pack",
    description:
      "Best for teams prioritizing high-throughput automation and workflow efficiency.",
    agents: [
      "auto_inventory",
      "auto_workflows",
      "auto_reports",
    ],
  },
  {
    id: "intelligence_predictive",
    name: "Intelligence & Predictive Pack",
    description:
      "Ideal for organizations adopting early predictive analytics and insights.",
    agents: [
      "forecast_ai",
      "event_watcher",
      "predictive_ai",
    ],
  },
  {
    id: "full_enterprise_mesh",
    name: "Full Enterprise Mesh Pack",
    description:
      "A full-scale enterprise network configuration with comprehensive coverage.",
    premium: true,
    agents: [
      "system_monitor",
      "threat_detect",
      "audit_guard",
      "event_watcher",
      "auto_workflows",
      "auto_reports",
    ],
  },
];

