"use client";

import { useFormContext } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import { AGENT_CATEGORIES } from "../../config/agents";
import AgentCard from "../../components/AgentCard";
import AgentFilters from "../../components/AgentFilters";
import {
  recommendAgents,
  PRIORITY_COLORS,
  prettyCategory,
} from "@/app/wizard/engine/recommendations";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AgentMarketplaceStep() {
  const { watch, setValue } = useFormContext();

  const selected = watch("agents") || [];
  const organization = watch("organization") || {};
  const security = watch("security") || {};
  const modules = watch("modules") || [];

  const [category, setCategory] = useState(AGENT_CATEGORIES[0].id);
  const [search, setSearch] = useState("");

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
      setValue("agents", [...selected, id]);
    }
  };

  return (
    <div className="flex flex-col sage-stack-xl w-full">
      {/* Recommended Agents Section */}
      {recommended.length > 0 && (
        <div className="mb-10 w-full">
          <h3 className="sage-h2 text-white mt-2 mb-3">
            Recommended for Your Organization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommended.map((agent) => {
              const priorityClass = PRIORITY_COLORS[agent.priority] ?? "";
              return (
                <Card
                  key={agent.id}
                  className={cn(
                    "relative group cursor-pointer bg-gradient-to-br backdrop-blur-xl border rounded-xl p-5 transition-all duration-300",
                    priorityClass,
                    selected.includes(agent.id)
                      ? "border-white/40 shadow-2xl"
                      : "hover:scale-[1.02] hover:border-white/30 hover:shadow-2xl"
                  )}
                  onClick={() => toggleAgent(agent.id)}
                >
                  <div className="flex justify-between items-start gap-4">
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
                    <input
                      type="checkbox"
                      checked={selected.includes(agent.id)}
                      onChange={() => toggleAgent(agent.id)}
                      className="form-checkbox h-5 w-5 accent-indigo-400 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <Badge className="absolute top-3 right-3 text-xs bg-black/40 border border-white/20 backdrop-blur-md">
                    {agent.priority.toUpperCase()}
                  </Badge>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Available Agents Section */}
      <div className="w-full border-t border-white/10 pt-8">
        <h3 className="sage-h2 text-white mt-2 mb-3">
          All Available Agents
        </h3>
        <div className="flex gap-10 w-full">
          <AgentFilters
            activeCategory={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                label={agent.label}
                selected={selected.includes(agent.id)}
                onClick={() => toggleAgent(agent.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

