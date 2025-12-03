export const MODULE_CATEGORIES = [
  {
    id: "automation",
    label: "Automation",
    modules: [
      {
        id: "inventory_automation",
        label: "Inventory Automation",
        name: "Inventory Automation",
        icon: "📦",
        description: "Automates product stock detection, reconciliation, and change reports.",
      },
      {
        id: "workflow_orchestration",
        label: "Workflow Orchestration",
        name: "Workflow Orchestration",
        icon: "🔁",
        description: "Creates multi-step workflows across SAGE modules and external systems.",
      },
      {
        id: "auto_reporting",
        label: "Automated Reporting",
        name: "Automated Reporting",
        icon: "📄",
        description: "Generates scheduled reports, consolidates data, and delivers insights automatically.",
      },
    ],
  },
  {
    id: "monitoring",
    label: "Monitoring",
    modules: [
      {
        id: "system_health",
        label: "System Health Monitor",
        name: "System Health Monitor",
        icon: "❤️‍🔥",
        description: "Monitors system integrity, uptime, performance, and anomalies.",
      },
      {
        id: "agent_performance",
        label: "Agent Performance Tracker",
        name: "Agent Performance Tracker",
        icon: "⚡",
        description: "Tracks agent performance metrics, identifies bottlenecks, and optimizes execution.",
      },
      {
        id: "event_watcher",
        label: "Event & Signal Watcher",
        name: "Event & Signal Watcher",
        icon: "📡",
        description: "Captures system events, signals, and real-time telemetry streams.",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    modules: [
      {
        id: "forecasting",
        label: "Predictive Analytics Engine",
        name: "Predictive Analytics Engine",
        icon: "📊",
        description: "Executes pattern predictions and forward-looking risk assessments.",
      },
      {
        id: "behavioral_patterns",
        label: "Behavioral Pattern Analysis",
        name: "Behavioral Pattern Analysis",
        icon: "🧠",
        description: "Analyzes behavioral signals across systems to detect unusual activity.",
      },
      {
        id: "risk_scores",
        label: "Risk Scoring Engine",
        name: "Risk Scoring Engine",
        icon: "🎯",
        description: "Evaluates and quantifies risks across your organization with AI-powered scoring.",
      },
    ],
  },
  {
    id: "security",
    label: "Security",
    modules: [
      {
        id: "rho2_enforcement",
        label: "Rho² Enforcement Layer",
        name: "Rho² Enforcement Layer",
        icon: "🛡️",
        description: "Enforces identity rotation, trust boundaries, and cryptographic sync.",
      },
      {
        id: "audit_logs",
        label: "Audit & Compliance Logs",
        name: "Audit & Compliance Logs",
        icon: "📋",
        description: "Comprehensive audit logging and compliance tracking for regulatory requirements.",
      },
      {
        id: "threat_detection",
        label: "Threat Detection Suite",
        name: "Threat Detection Suite",
        icon: "🔒",
        description: "Advanced threat detection system that identifies and responds to security threats in real-time.",
      },
    ],
  },
];

// Flattened modules array for easier access
export const modules = MODULE_CATEGORIES.flatMap((cat) =>
  cat.modules.map((mod) => ({
    ...mod,
    category: cat.id,
  }))
);

