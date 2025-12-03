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
import BundlePreviewModal from "@/app/wizard/components/modals/BundlePreviewModal";

export default function AgentMarketplaceStep() {
  const { watch, setValue } = useFormContext();
  const { selectedAgent, clearSelectedAgent, setSelectedAgent } = useOnboardingDataStore();

  const selected = watch("agents") || [];
  const organization = watch("organization") || {};
  const security = watch("security") || {};
  const modules = watch("modules") || [];

  const [category, setCategory] = useState(AGENT_CATEGORIES[0].id);
  const [search, setSearch] = useState("");
  const [previewBundle, setPreviewBundle] = useState<typeof bundles[0] | null>(null);

  // Get recommendations based on form data
  const recommended = useMemo(() => {
    return recommendAgents({
      industry: organization.industry,
      companySize: organization.size,
      securityLevel: security.posture,
      modules: modules,
      rho2Enabled: true, // Rho² is always enabled in enterprise flow
    });
  }, [organization.industry, organization.size, security.posture, modules]);

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

  // Apply bundle function
  const applyBundle = (bundle: typeof bundles[0]) => {
    bundle.agents.forEach((agentId) => {
      if (!selected.includes(agentId)) {
        toggleAgent(agentId);
      }
    });
  };

  return (
    <div className="flex flex-col sage-stack-xl w-full">
      {/* Baseline Agents Section */}
      <section className="sage-stack-lg">
        <h2 className="sage-h2">Baseline Federation Agents</h2>
        <p className="sage-sub">
          These core agents are automatically provisioned for every SAGE Federation member to
          enforce security, diagnostics, and federation integrity.
        </p>
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
        <h2 className="sage-h2">✨ Starter Bundles</h2>
        <p className="sage-sub">Choose a curated configuration to accelerate your SAGE setup.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bundles.map((bundle) => (
            <BundleCard 
              key={bundle.id} 
              bundle={bundle} 
              onApply={applyBundle}
              onPreview={(b) => setPreviewBundle(b)}
            />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6" />

      {/* Smart Recommendations Section */}
      {smartRecommendations.length > 0 && selected.length > 0 && (
        <section className="sage-stack-lg">
          <h2 className="sage-h2 flex items-center gap-2">
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
              />
            ))}
          </div>
        </section>
      )}

      {/* Add a clear divider + margin so the next block never feels overlapped */}
      {(smartRecommendations.length > 0 && selected.length > 0) && (
        <div className="h-px bg-white/10 my-6" />
      )}

      {/* Recommended Agents Section (Context-based) */}
      {recommended.length > 0 && (
        <section className="sage-stack-lg">
          <h2 className="sage-h2">
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
                      <h4 className="sage-h3 text-white mb-1 flex items-center gap-2">
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
        <h2 className="sage-h2">
          All Available Agents
        </h2>
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
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                label={agent.label}
                selected={selected.includes(agent.id)}
                onClick={() => toggleAgent(agent.id)}
                agent={agent}
                recommended={smartRecommendations.some((r) => r.id === agent.id)}
              />
            ))}
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

      {/* Bundle Preview Modal */}
      {previewBundle && (
        <BundlePreviewModal
          bundle={previewBundle}
          onApply={(b) => {
            applyBundle(b);
            setPreviewBundle(null);
          }}
          onClose={() => setPreviewBundle(null)}
        />
      )}
    </div>
  );
}

