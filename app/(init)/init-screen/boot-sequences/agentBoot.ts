import { getAgentLabel, AGENT_DEPENDENCIES } from "@/app/wizard/config/agentDependencies";

// A clean, enterprise-grade boot generator
export function generateAgentBootSequence(selectedAgents: string[]) {
  const lines: Array<{ delay: number; msg: string }> = [];

  if (selectedAgents.length === 0) {
    return lines;
  }

  lines.push({
    delay: 900,
    msg: "Scanning selected modules and agents…",
  });

  // Track which dependencies have been resolved to avoid duplicates
  const resolvedDeps = new Set<string>();
  const processedAgents = new Set<string>();

  // Process agents with dependency awareness
  selectedAgents.forEach((agentId) => {
    if (processedAgents.has(agentId)) return;

    const agentLabel = getAgentLabel(agentId);
    const dependencies = AGENT_DEPENDENCIES[agentId];

    // Process required dependencies first
    if (dependencies?.required) {
      dependencies.required.forEach((depId) => {
        if (!resolvedDeps.has(depId) && !selectedAgents.includes(depId)) {
          const depLabel = getAgentLabel(depId);
          lines.push({
            delay: 700,
            msg: `Resolving dependency: ${depLabel}…`,
          });
          resolvedDeps.add(depId);
        }
      });
    }

    // Process recommended dependencies
    if (dependencies?.recommended) {
      dependencies.recommended.forEach((depId) => {
        if (!resolvedDeps.has(depId) && !selectedAgents.includes(depId)) {
          const depLabel = getAgentLabel(depId);
          lines.push({
            delay: 600,
            msg: `Linking recommended dependency: ${depLabel}…`,
          });
          resolvedDeps.add(depId);
        }
      });
    }

    // Initialize the agent
    lines.push(
      { delay: 800, msg: `Initializing ${agentLabel}…` },
      { delay: 600, msg: `${agentLabel} linked to orchestration layer…` },
      { delay: 500, msg: `${agentLabel} ready ✔` }
    );

    processedAgents.add(agentId);
  });

  return lines;
}

