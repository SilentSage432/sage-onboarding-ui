export type RecommendationContext = {
  industry?: string;
  companySize?: string;
  goals?: string[];
  securityLevel?: string;
  modules?: string[];
  rho2Enabled?: boolean;
};

export type RecommendedAgent = {
  id: string;
  label: string;
  category: string;
  reason: string;
  priority: "critical" | "operational" | "optional" | "advanced";
};

export function recommendAgents(ctx: RecommendationContext): RecommendedAgent[] {
  const recs: RecommendedAgent[] = [];

  // --- Critical security baseline ---
  if (ctx.rho2Enabled !== false) {
    recs.push({
      id: "rho2_guard",
      label: "Rho² Security Enforcement Agent",
      category: "Security",
      priority: "critical",
      reason: "Required for identity rotation, trust boundaries, and secure federation sync.",
    });
  }

  // --- Industry heuristics ---
  if (ctx.industry === "retail") {
    recs.push({
      id: "auto_inventory",
      label: "Inventory Automation Agent",
      category: "Automation",
      priority: "critical",
      reason: "Retail workflow detected — recommended for inventory tracking, anomaly detection, and automation.",
    });
  }

  if (ctx.industry === "contractor") {
    recs.push({
      id: "auto_workflows",
      label: "Workflow Automation Agent",
      category: "Automation",
      priority: "operational",
      reason: "Contractor/trade service workflow model detected — scheduling and dispatch automation recommended.",
    });
  }

  if (ctx.industry === "professional") {
    recs.push({
      id: "auto_reports",
      label: "Automated Reporting Agent",
      category: "Automation",
      priority: "operational",
      reason: "Professional services workflow detected — automated reporting and billing recommended.",
    });
  }

  if (ctx.industry === "healthcare") {
    recs.push({
      id: "audit_guard",
      label: "Audit & Compliance Agent",
      category: "Security",
      priority: "critical",
      reason: "Healthcare industry detected — HIPAA compliance and audit logging required.",
    });
    recs.push({
      id: "threat_detect",
      label: "Threat Detection Agent",
      category: "Security",
      priority: "critical",
      reason: "Healthcare data protection — advanced threat detection recommended.",
    });
  }

  // --- Goal-based heuristics ---
  if (ctx.goals?.includes("analytics") || ctx.modules?.some((m) => m.toLowerCase().includes("analytics"))) {
    recs.push({
      id: "predictive_ai",
      label: "Predictive Analytics Agent",
      category: "Analytics",
      priority: "operational",
      reason: "Analytics optimization selected — predictive modeling recommended.",
    });
    recs.push({
      id: "forecast_ai",
      label: "Forecasting Intelligence Agent",
      category: "Analytics",
      priority: "operational",
      reason: "Analytics module installed — forecasting intelligence enables predictive insights.",
    });
  }

  if (ctx.goals?.includes("automation") || ctx.modules?.some((m) => m.toLowerCase().includes("automation"))) {
    recs.push({
      id: "auto_workflows",
      label: "Workflow Automation Agent",
      category: "Automation",
      priority: "critical",
      reason: "User marked automation as a primary goal — Workflow Automation is the base agent.",
    });
  }

  // --- Module-based heuristics ---
  if (ctx.modules?.some((m) => m.toLowerCase().includes("monitoring"))) {
    recs.push({
      id: "system_monitor",
      label: "System Health Monitor Agent",
      category: "Monitoring",
      priority: "operational",
      reason: "Monitoring module installed — System Health Monitor enables real-time telemetry.",
    });
    recs.push({
      id: "event_watcher",
      label: "Event Stream Watcher",
      category: "Monitoring",
      priority: "operational",
      reason: "Monitoring module installed — Event Stream Watcher provides comprehensive event tracking.",
    });
  }

  if (ctx.modules?.some((m) => m.toLowerCase().includes("security"))) {
    recs.push({
      id: "threat_detect",
      label: "Threat Detection Agent",
      category: "Security",
      priority: "operational",
      reason: "Security module installed — Threat Detection Agent provides advanced security monitoring.",
    });
  }

  // --- Security posture heuristics ---
  if (ctx.securityLevel === "strict") {
    recs.push({
      id: "audit_guard",
      label: "Audit & Compliance Agent",
      category: "Security",
      priority: "critical",
      reason: "Strict security posture selected — comprehensive audit logging required.",
    });
    recs.push({
      id: "threat_detect",
      label: "Threat Detection Agent",
      category: "Security",
      priority: "critical",
      reason: "Strict security posture — advanced threat detection recommended.",
    });
  }

  // --- Company size heuristics ---
  if (ctx.companySize === "201+") {
    recs.push({
      id: "agent_perf",
      label: "Agent Performance Analyzer",
      category: "Monitoring",
      priority: "operational",
      reason: "Large organization detected — agent performance monitoring recommended for scale.",
    });
    recs.push({
      id: "behavior_ai",
      label: "Behavior Pattern AI",
      category: "Analytics",
      priority: "optional",
      reason: "Large organization — behavioral pattern analysis helps optimize operations at scale.",
    });
  }

  // Deduplicate agents by ID
  return Array.from(new Map(recs.map((a) => [a.id, a])).values());
}

export const PRIORITY_COLORS: Record<string, string> = {
  critical: "from-red-600/40 to-red-900/20 border-red-500/40",
  operational: "from-blue-600/40 to-blue-900/20 border-blue-500/40",
  optional: "from-purple-600/40 to-purple-900/20 border-purple-500/40",
  advanced: "from-amber-600/40 to-amber-900/20 border-amber-500/40",
};

export function prettyCategory(cat: string) {
  if (!cat) return "";
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

import { AGENT_CATEGORIES } from "../config/agents";
import { AGENT_DEPENDENCIES } from "../config/agentDependencies";

// Get all agents as a flat list
function getAllAgents() {
  const allAgents: Array<{ id: string; label: string; category: string }> = [];
  AGENT_CATEGORIES.forEach((cat) => {
    cat.agents.forEach((agent) => {
      allAgents.push({
        id: agent.id,
        label: agent.label,
        category: cat.label
      });
    });
  });
  return allAgents;
}

// Smart recommendation engine based on selected agents
export function getRecommendations(selectedAgents: string[]): RecommendedAgent[] {
  // No selections, no recommendations
  if (selectedAgents.length === 0) return [];

  const allAgents = getAllAgents();
  const scores: Record<string, number> = {};

  allAgents.forEach((agent) => {
    // Skip already selected
    if (selectedAgents.includes(agent.id)) return;

    let score = 0;

    // 1. Score based on recommended associations (dependencies)
    selectedAgents.forEach((selectedId) => {
      const dependencies = AGENT_DEPENDENCIES[selectedId];
      if (dependencies?.recommended?.includes(agent.id)) {
        score += 3;
      }
    });

    // 2. Score based on category overlap
    selectedAgents.forEach((selectedId) => {
      const selectedAgent = allAgents.find((a) => a.id === selectedId);
      if (selectedAgent && selectedAgent.category === agent.category) {
        score += 1;
      }
    });

    // 3. Score based on reverse dependencies (if this agent recommends selected agents)
    const agentDeps = AGENT_DEPENDENCIES[agent.id];
    if (agentDeps?.recommended) {
      agentDeps.recommended.forEach((recId: string) => {
        if (selectedAgents.includes(recId)) {
          score += 2;
        }
      });
    }

    // 4. Placeholder for future AI expansion
    // e.g., usage patterns, org profile, posture score

    if (score > 0) {
      scores[agent.id] = score;
    }
  });

  // Sort by score descending and return as RecommendedAgent[]
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6) // Limit to top 6 recommendations
    .map(([id]) => {
      const agent = allAgents.find((a) => a.id === id);
      if (!agent) return null;
      return {
        id: agent.id,
        label: agent.label,
        category: agent.category,
        reason: `Recommended based on your current agent selection.`,
        priority: "optional" as const
      };
    })
    .filter((a): a is RecommendedAgent => a !== null);
}

