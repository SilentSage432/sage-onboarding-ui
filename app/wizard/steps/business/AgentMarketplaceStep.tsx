"use client";

import { useFormContext } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { AGENT_CATEGORIES } from "../../config/agents";
import AgentCard from "../../components/AgentCard";
import AgentFilters from "../../components/AgentFilters";
import AgentDetailPanel from "../../components/AgentDetailPanel";
import {
  recommendAgents,
  getRecommendations,
  PRIORITY_COLORS,
  prettyCategory,
} from "@/app/wizard/engine/recommendations";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingDataStore } from "@/app/wizard/store/useOnboardingDataStore";
import { AGENT_DEPENDENCIES, getAgentLabel } from "@/app/wizard/config/agentDependencies";
import { bundles } from "@/app/wizard/config/bundles";
import BundleCard from "@/app/wizard/components/BundleCard";
import Toast from "@/components/system/Toast";
import EmptyState from "@/app/wizard/components/EmptyState";
import ReviewRibbon from "@/app/wizard/components/ReviewRibbon";
import { useWizardStore } from "@/app/wizard/store/useWizardStore";
import { getEnterpriseSteps } from "@/app/wizard/steps";
import { useRef } from "react";

// Agent descriptions for contextual banner
const AGENT_DETAILS: Record<string, { description: string }> = {
  auto_inventory: {
    description: "Automates inventory tracking, stock level monitoring, and reorder point management. Provides real-time visibility into inventory status and helps prevent stockouts or overstock situations."
  },
  auto_workflows: {
    description: "Orchestrates complex business workflows, automating repetitive tasks and ensuring consistent process execution across your organization."
  },
  auto_reports: {
    description: "Generates automated reports on schedule, consolidating data from multiple sources and delivering insights to stakeholders."
  },
  system_monitor: {
    description: "Continuously monitors system health, performance metrics, and resource utilization to ensure optimal operation."
  },
  agent_perf: {
    description: "Analyzes agent performance, identifies bottlenecks, and provides recommendations for optimization."
  },
  event_watcher: {
    description: "Monitors event streams in real-time, detecting patterns and anomalies across your system."
  },
  rho2_guard: {
    description: "Enforces Rho² security protocols, managing identity rotation, trust boundaries, and secure federation synchronization."
  },
  threat_detect: {
    description: "Advanced threat detection system that identifies and responds to security threats in real-time."
  },
  audit_guard: {
    description: "Comprehensive audit logging and compliance tracking for regulatory requirements and security standards."
  },
  predictive_ai: {
    description: "Leverages machine learning to predict trends, forecast outcomes, and provide actionable insights."
  },
  behavior_ai: {
    description: "Analyzes behavioral patterns to identify trends, anomalies, and optimization opportunities."
  },
  risk_ai: {
    description: "AI-powered risk scoring engine that evaluates and quantifies risks across your organization."
  },
  insight_gen: {
    description: "Generates actionable insights from data analysis, helping you make informed business decisions."
  },
  forecast_ai: {
    description: "Advanced forecasting intelligence that predicts future trends and outcomes with high accuracy."
  },
  signal_ai: {
    description: "Interprets complex signals and patterns from multiple data sources to provide strategic insights."
  }
};

export default function AgentMarketplaceStep() {
  const { watch, setValue } = useFormContext();
  const { selectedAgent, clearSelectedAgent, setSelectedAgent } = useOnboardingDataStore();
  const { setStepIndex } = useWizardStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const selected = watch("agents") || [];
  const organization = watch("organization") || {};
  const security = watch("security") || {};
  const modules = watch("modules") || [];

  const [category, setCategory] = useState(AGENT_CATEGORIES[0].id);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: "", isVisible: false });
  const [hoverAgent, setHoverAgent] = useState<{ id: string; label: string; reason?: string } | null>(null);
  const [recentlyApplied, setRecentlyApplied] = useState<number | null>(null);

  // Get operational priorities from store
  const { operationalPriorities } = useOnboardingDataStore();

  // Get recommendations based on form data and operational priorities
  const recommended = useMemo(() => {
    return recommendAgents({
      industry: organization.industry,
      companySize: organization.size,
      securityLevel: security.posture,
      modules: modules,
      priorities: operationalPriorities,
      rho2Enabled: true, // Rho² is always enabled in enterprise flow
    });
  }, [organization.industry, organization.size, security.posture, modules, operationalPriorities]);

  // Auto-select critical recommendations on mount
  useEffect(() => {
    const criticalIds = recommended
      .filter((r) => r.priority === "critical")
      .map((r) => r.id);
    
    if (criticalIds.length > 0) {
      const currentSelected = selected || [];
      const newSelected = Array.from(new Set([...currentSelected, ...criticalIds]));
      if (newSelected.length !== currentSelected.length) {
        setValue("agents", newSelected);
      }
    }
  }, [recommended, selected, setValue]); // Only run when recommendations change

  // Get all agents from all categories for "All Available Agents"
  const allAgents = useMemo(() => {
    return AGENT_CATEGORIES.flatMap((cat) => cat.agents);
  }, []);

  // Filter agents based on category and search
  const filteredAgents = useMemo(() => {
    const cat = AGENT_CATEGORIES.find((c) => c.id === category);
    if (!cat) return [];

    return cat.agents.filter((a) =>
      a.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [category, search]);

  const toggleAgent = (id: string) => {
    if (selected.includes(id)) {
      setValue(
        "agents",
        selected.filter((x: string) => x !== id)
      );
    } else {
      // Handle dependencies
      const dependencies = AGENT_DEPENDENCIES[id];
      let newSelected = [...selected];

      // Auto-add required dependencies
      if (dependencies?.required) {
        dependencies.required.forEach((req: string) => {
          if (!newSelected.includes(req)) {
            newSelected.push(req);
          }
        });
      }

      // Add the agent itself
      newSelected.push(id);
      setValue("agents", newSelected);

      // Show prompt for recommended dependencies
      if (dependencies?.recommended && dependencies.recommended.length > 0) {
        const missingRecommended = dependencies.recommended.filter(
          (rec: string) => !newSelected.includes(rec)
        );
        if (missingRecommended.length > 0) {
          const recommendedLabels = missingRecommended.map(getAgentLabel).join(", ");
          setTimeout(() => {
            if (confirm(`We recommend enabling ${recommendedLabels} for best performance. Add them now?`)) {
              setValue("agents", [...newSelected, ...missingRecommended]);
            }
          }, 100);
        }
      }
    }
  };

  // Get smart recommendations based on selected agents
  const smartRecommendations = useMemo(() => {
    return getRecommendations(selected);
  }, [selected]);

  // Apply bundle function - instant action with toast
  const applyBundle = (bundle: typeof bundles[0]) => {
    // Add recommended agents directly
    bundle.agents.forEach((agentId) => {
      if (!selected.includes(agentId)) {
        toggleAgent(agentId);
      }
    });
    
    // Show enterprise-grade confirmation
    setToast({ 
      message: `Bundle applied — ${bundle.agents.length} agent${bundle.agents.length !== 1 ? 's' : ''} added.`, 
      isVisible: true 
    });
    
    // Trigger highlight animation on selected agents
    setRecentlyApplied(Date.now());
  };

  // Handle review button click - navigate to final review step
  const handleReviewClick = () => {
    const steps = getEnterpriseSteps();
    const reviewStepIndex = steps.findIndex(s => s.id === "business-summary");
    if (reviewStepIndex !== -1) {
      setStepIndex(reviewStepIndex);
    }
  };


  // Smart category auto-focus - switches category filter when hovering agents
  const scrollToCategory = (agentCategory: string) => {
    if (!agentCategory) return;
    
    // Find matching category by label (e.g., "Automation", "Security") or ID
    const matchingCategory = AGENT_CATEGORIES.find((c) => {
      // Try exact match first
      if (c.label === agentCategory || c.id === agentCategory) return true;
      // Try case-insensitive match
      if (c.label.toLowerCase() === agentCategory.toLowerCase() || 
          c.id.toLowerCase() === agentCategory.toLowerCase()) return true;
      return false;
    });
    
    if (matchingCategory && matchingCategory.id !== category) {
      setCategory(matchingCategory.id);
    }
  };

  // Configuration health check
  const getConfigHealth = () => {
    // Check for missing required dependencies
    for (const agentId of selected) {
      const dependencies = AGENT_DEPENDENCIES[agentId];
      if (dependencies?.required) {
        for (const dep of dependencies.required) {
          if (!selected.includes(dep)) {
            return "missing";
          }
        }
      }
    }
    return "stable";
  };

  // Get contextual description
  const getContextualDescription = () => {
    if (hoverAgent) {
      const details = AGENT_DETAILS[hoverAgent.id];
      if (details) {
        return details.description;
      }
      if (hoverAgent.reason) {
        return hoverAgent.reason;
      }
      return `${hoverAgent.label} provides specialized capabilities for your organization.`;
    }
    if (selectedAgent) {
      const details = AGENT_DETAILS[selectedAgent.id];
      if (details) {
        return details.description;
      }
      if (selectedAgent.reason) {
        return selectedAgent.reason;
      }
      return `${selectedAgent.label} provides specialized capabilities for your organization.`;
    }
    return "Hover over any agent to learn what it provides.";
  };

  return (
    <div ref={scrollRef} className="flex flex-col w-full mt-8 space-y-8 relative">
      {/* Progress Bar */}
      <div className="fixed top-[68px] left-0 right-0 z-30 px-8 pointer-events-none">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden max-w-4xl mx-auto">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{
              width: `${Math.min(selected.length * 12.5, 100)}%`
            }}
          />
        </div>
      </div>

      {/* Selected Agents Counter */}
      <div className="absolute top-0 right-0 text-white/60 text-sm flex items-center gap-2">
        <span className={cn(
          selected.length > 0 && "sage-count-pop"
        )}>
          {selected.length}
        </span>
        <span>selected</span>
      </div>

      {/* Configuration Health Indicator */}
      <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
        {getConfigHealth() === "stable" && (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span>Configuration Stable</span>
          </>
        )}
        {getConfigHealth() === "missing" && (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span>Some required agents are missing</span>
          </>
        )}
      </div>

      {/* Baseline Agents Section */}
      <section className="sage-stack-lg">
        <div className="relative pt-6">
          <div className="mt-10 mb-4">
            <h2 className="text-xl font-semibold tracking-wide text-white/90">Baseline Federation Agents</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
            These core agents are automatically provisioned for every SAGE Federation member to
            enforce security, diagnostics, and federation integrity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rho² Card */}
          <div className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl pt-7 pr-10 pb-5 pl-5">
            {/* Status cluster in top-right */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-2 py-1 text-[10px] rounded-full bg-purple-500/30 text-purple-100 border border-purple-300/70 uppercase tracking-wide">
                Critical
              </span>
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(164,120,255,0.8)]">
                <span className="text-xs text-white">✓</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400" />
              <h3 className="text-white font-medium text-lg tracking-tight">Rho² Security Enforcement Agent</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Core security enforcement for identity rotation, trust boundaries, and secure federation synchronization.
            </p>
          </div>

          {/* HADRA-01 Card */}
          <div className="relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl pt-7 pr-10 pb-5 pl-5">
            {/* Status cluster in top-right */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className="px-2 py-1 text-[10px] rounded-full bg-cyan-500/30 text-cyan-100 border border-cyan-300/70 uppercase tracking-wide">
                Always On
              </span>
              <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(80,200,255,0.8)]">
                <span className="text-xs text-white">✓</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <h3 className="text-white font-medium text-lg tracking-tight">HADRA-01 Diagnostic Assistant</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Autonomous diagnostic and monitoring system for federation health and operational intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6" />

      {/* Starter Bundles Section */}
      <section className="sage-stack-lg">
        <h2 className="text-white text-lg font-medium tracking-wide mb-2">✨ Starter Bundles</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">Choose a curated configuration to accelerate your SAGE setup.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <BundleCard 
              key={bundle.id} 
              bundle={bundle} 
              onApply={applyBundle}
            />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6" />

      {/* Smart Recommendations Section */}
      {smartRecommendations.length > 0 && selected.length > 0 ? (
        <section className="sage-stack-lg">
            <h2 className="text-white text-lg font-medium tracking-wide mb-2 flex items-center gap-2">
            <span>✨</span>
            <span>Recommended for You</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartRecommendations.map((recAgent) => (
                <AgentCard
                  key={recAgent.id}
                  label={recAgent.label}
                  selected={selected.includes(recAgent.id)}
                  onClick={() => toggleAgent(recAgent.id)}
                  agent={recAgent}
                  recommended={true}
                  recentlyApplied={recentlyApplied}
                  onMouseEnter={() => {
                    setHoverAgent({ id: recAgent.id, label: recAgent.label, reason: recAgent.reason });
                    scrollToCategory(recAgent.category || category);
                  }}
                  onMouseLeave={() => setHoverAgent(null)}
                />
            ))}
          </div>
        </section>
      ) : (
        smartRecommendations.length === 0 && selected.length > 0 && (
          <section className="sage-stack-lg">
            <h2 className="text-white text-lg font-medium tracking-wide mb-2">
              Recommended for Your Organization
            </h2>
            <EmptyState 
              label="No recommendations available. Select more agents to improve suggestions." 
              icon="💡"
            />
          </section>
        )
      )}

      {/* Add a clear divider + margin so the next block never feels overlapped */}
      {(smartRecommendations.length > 0 && selected.length > 0) && (
        <div className="h-px bg-white/10 my-6" />
      )}

      {/* Recommended Agents Section (Context-based) */}
      {recommended.length > 0 && (
        <section className="sage-stack-lg">
          <h2 className="text-white text-lg font-medium tracking-wide mb-2">
            Recommended for Your Organization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommended.map((agent) => {
              const priorityClass = PRIORITY_COLORS[agent.priority] ?? "";
              const isSelected = selected.includes(agent.id);
              return (
                <Card
                  key={agent.id}
                  className={cn(
                    "sage-card-base sage-card-hover relative group pt-7 pr-10 pb-5 pl-5",
                    priorityClass,
                    isSelected && "sage-card-selected"
                  )}
                  onClick={() => setSelectedAgent(agent)}
                  onMouseEnter={() => {
                    setHoverAgent({ id: agent.id, label: agent.label, reason: agent.reason });
                    scrollToCategory(agent.category || category);
                  }}
                  onMouseLeave={() => setHoverAgent(null)}
                >
                  {/* Status cluster in top-right - pill + check icon */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className={cn(
                      "px-2 py-1 text-[10px] rounded-full uppercase tracking-wide border",
                      agent.priority === "critical" && "bg-red-500/30 text-red-100 border-red-300/70",
                      agent.priority === "operational" && "bg-blue-500/30 text-blue-100 border-blue-300/70",
                      agent.priority === "optional" && "bg-purple-500/30 text-purple-100 border-purple-300/70",
                      agent.priority === "advanced" && "bg-amber-500/30 text-amber-100 border-amber-300/70"
                    )}>
                      {agent.priority.toUpperCase()}
                    </span>
                    {isSelected && (
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        agent.priority === "critical" && "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]",
                        agent.priority === "operational" && "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]",
                        agent.priority === "optional" && "bg-purple-500 shadow-[0_0_10px_rgba(164,120,255,0.8)]",
                        agent.priority === "advanced" && "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                      )}>
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <h4 className="text-white text-lg font-medium tracking-wide mb-1 flex items-center gap-2">
                        <span>⚡</span>
                        {agent.label}
                      </h4>
                      <p className="sage-body text-white/70 mb-2">
                        {prettyCategory(agent.category)}
                      </p>
                      <p className="sage-body text-white/60 italic">
                        {agent.reason}
                      </p>
                    </div>
                    {/* Checkbox moved to bottom left */}
                    <div onClick={(e) => e.stopPropagation()} className="self-start">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleAgent(agent.id)}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Divider */}
      {(smartRecommendations.length > 0 || recommended.length > 0) && (
        <div className="h-px bg-white/10 my-6" />
      )}

      {/* All Available Agents Section */}
      <section className="sage-stack-lg">
        <h2 className="text-white text-lg font-medium tracking-wide mb-2">
          All Available Agents
        </h2>
        
        {/* Contextual Description Banner */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-4 mb-6 h-[72px] flex items-center">
          <p className="text-white/70 text-sm transition-opacity duration-200">
            {getContextualDescription()}
          </p>
        </div>

        {/* Filters + Card Rail */}
        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-6 items-start">
          {/* Left: filters/categories */}
          <div className="sage-stack">
            <AgentFilters
              activeCategory={category}
              setCategory={setCategory}
              search={search}
              setSearch={setSearch}
            />
          </div>
          {/* Right: scrollable card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  label={agent.label}
                  selected={selected.includes(agent.id)}
                  onClick={() => toggleAgent(agent.id)}
                  agent={agent}
                  recommended={smartRecommendations.some((r) => r.id === agent.id)}
                  recentlyApplied={recentlyApplied}
                  onMouseEnter={() => {
                    setHoverAgent({ id: agent.id, label: agent.label });
                    // Agent is already in the current category filter, no need to switch
                  }}
                  onMouseLeave={() => setHoverAgent(null)}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState label="No agents match your current criteria." />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Agent Detail Panel */}
      <AnimatePresence>
        {selectedAgent && (
          <AgentDetailPanel
            agent={selectedAgent}
            onClose={clearSelectedAgent}
          />
        )}
      </AnimatePresence>

      {/* Review Ribbon */}
      <ReviewRibbon
        count={selected.length}
        onClick={handleReviewClick}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast({ message: "", isVisible: false })}
      />
    </div>
  );
}

