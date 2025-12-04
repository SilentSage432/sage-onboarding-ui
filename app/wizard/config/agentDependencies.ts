// Agent dependency definitions
export interface AgentDependencies {
  required?: string[];
  recommended?: string[];
}

export const AGENT_DEPENDENCIES: Record<string, AgentDependencies> = {
  // Threat Detection requires Audit Guard for event logging
  threat_detect: {
    required: ["audit_guard"],
    recommended: ["system_monitor"]
  },
  // Event Watcher benefits from System Monitor
  event_watcher: {
    recommended: ["system_monitor"]
  },
  // Agent Performance Analyzer needs System Monitor
  agent_perf: {
    required: ["system_monitor"]
  },
  // Predictive Analytics works best with Behavior AI
  predictive_ai: {
    recommended: ["behavior_ai"]
  },
  // Risk Scoring AI benefits from Audit Guard
  risk_ai: {
    recommended: ["audit_guard"]
  },
  // Forecasting Intelligence works well with Predictive Analytics
  forecast_ai: {
    recommended: ["predictive_ai"]
  },
  // Signal Interpretation AI benefits from Event Watcher
  signal_ai: {
    recommended: ["event_watcher"]
  },
  // Automated Reporting benefits from Workflow Automation
  auto_reports: {
    recommended: ["auto_workflows"]
  },
  // Inventory Automation works best with Workflow Automation
  auto_inventory: {
    recommended: ["auto_workflows"]
  }
};

// Helper function to get agent label by ID
export function getAgentLabel(agentId: string): string {
  const allAgents = [
    { id: "auto_inventory", label: "Inventory Automation Agent" },
    { id: "auto_workflows", label: "Workflow Automation Agent" },
    { id: "auto_reports", label: "Automated Reporting Agent" },
    { id: "system_monitor", label: "System Health Monitor Agent" },
    { id: "agent_perf", label: "Agent Performance Analyzer" },
    { id: "event_watcher", label: "Event Stream Watcher" },
    { id: "rho2_guard", label: "Rho² Security Enforcement Agent" },
    { id: "threat_detect", label: "Threat Detection Agent" },
    { id: "audit_guard", label: "Audit & Compliance Agent" },
    { id: "predictive_ai", label: "Predictive Analytics Agent" },
    { id: "behavior_ai", label: "Behavior Pattern AI" },
    { id: "risk_ai", label: "Risk Scoring AI Agent" },
    { id: "insight_gen", label: "Insight Generation Agent" },
    { id: "forecast_ai", label: "Forecasting Intelligence Agent" },
    { id: "signal_ai", label: "Signal Interpretation AI" }
  ];
  
  const agent = allAgents.find(a => a.id === agentId);
  return agent?.label || agentId;
}


