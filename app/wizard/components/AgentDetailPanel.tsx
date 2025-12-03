"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { AGENT_DEPENDENCIES, getAgentLabel } from "@/app/wizard/config/agentDependencies";
import { getRecommendations } from "@/app/wizard/engine/recommendations";

interface AgentDetailPanelProps {
  agent: {
    id: string;
    label: string;
    category: string;
    reason?: string;
    priority?: string;
  } | null;
  onClose: () => void;
}

// Agent descriptions and capabilities
const AGENT_DETAILS: Record<string, { description: string; capabilities: string[] }> = {
  auto_inventory: {
    description: "Automates inventory tracking, stock level monitoring, and reorder point management. Provides real-time visibility into inventory status and helps prevent stockouts or overstock situations.",
    capabilities: [
      "Real-time inventory tracking",
      "Automated reorder point detection",
      "Stock level alerts",
      "Multi-location inventory management",
      "Integration with POS systems"
    ]
  },
  auto_workflows: {
    description: "Orchestrates complex business workflows, automating repetitive tasks and ensuring consistent process execution across your organization.",
    capabilities: [
      "Workflow automation",
      "Task scheduling and routing",
      "Process orchestration",
      "Conditional logic execution",
      "Integration with external systems"
    ]
  },
  auto_reports: {
    description: "Generates automated reports on schedule, consolidating data from multiple sources and delivering insights to stakeholders.",
    capabilities: [
      "Scheduled report generation",
      "Multi-source data aggregation",
      "Custom report templates",
      "Automated distribution",
      "Data visualization"
    ]
  },
  system_monitor: {
    description: "Continuously monitors system health, performance metrics, and resource utilization to ensure optimal operation.",
    capabilities: [
      "Real-time system monitoring",
      "Performance metrics tracking",
      "Resource utilization alerts",
      "Health status dashboards",
      "Predictive failure detection"
    ]
  },
  agent_perf: {
    description: "Analyzes agent performance, identifies bottlenecks, and provides recommendations for optimization.",
    capabilities: [
      "Performance analytics",
      "Bottleneck identification",
      "Optimization recommendations",
      "Performance benchmarking",
      "Trend analysis"
    ]
  },
  event_watcher: {
    description: "Monitors event streams in real-time, detecting patterns and anomalies across your system.",
    capabilities: [
      "Real-time event monitoring",
      "Pattern detection",
      "Anomaly identification",
      "Event correlation",
      "Alert generation"
    ]
  },
  rho2_guard: {
    description: "Enforces Rho² security protocols, managing identity rotation, trust boundaries, and secure federation synchronization.",
    capabilities: [
      "Identity rotation enforcement",
      "Trust boundary management",
      "Federation synchronization",
      "Security policy enforcement",
      "Audit trail generation"
    ]
  },
  threat_detect: {
    description: "Advanced threat detection system that identifies and responds to security threats in real-time.",
    capabilities: [
      "Real-time threat detection",
      "Behavioral analysis",
      "Threat intelligence integration",
      "Automated response protocols",
      "Incident reporting"
    ]
  },
  audit_guard: {
    description: "Comprehensive audit logging and compliance tracking for regulatory requirements and security standards.",
    capabilities: [
      "Comprehensive audit logging",
      "Compliance tracking",
      "Regulatory reporting",
      "Access audit trails",
      "Data retention management"
    ]
  },
  predictive_ai: {
    description: "Leverages machine learning to predict trends, forecast outcomes, and provide actionable insights.",
    capabilities: [
      "Predictive modeling",
      "Trend forecasting",
      "Pattern recognition",
      "Risk assessment",
      "Scenario analysis"
    ]
  },
  behavior_ai: {
    description: "Analyzes behavioral patterns to identify trends, anomalies, and optimization opportunities.",
    capabilities: [
      "Behavioral pattern analysis",
      "Anomaly detection",
      "Trend identification",
      "User behavior insights",
      "Optimization recommendations"
    ]
  },
  risk_ai: {
    description: "AI-powered risk scoring engine that evaluates and quantifies risks across your organization.",
    capabilities: [
      "Risk scoring and quantification",
      "Multi-factor risk analysis",
      "Risk trend monitoring",
      "Mitigation recommendations",
      "Risk reporting"
    ]
  },
  insight_gen: {
    description: "Generates actionable insights from data analysis, helping you make informed business decisions.",
    capabilities: [
      "Automated insight generation",
      "Data pattern recognition",
      "Business intelligence",
      "Recommendation engine",
      "Insight visualization"
    ]
  },
  forecast_ai: {
    description: "Advanced forecasting intelligence that predicts future trends and outcomes with high accuracy.",
    capabilities: [
      "Time-series forecasting",
      "Demand prediction",
      "Revenue forecasting",
      "Trend projection",
      "Confidence intervals"
    ]
  },
  signal_ai: {
    description: "Interprets complex signals and patterns from multiple data sources to provide strategic insights.",
    capabilities: [
      "Signal interpretation",
      "Multi-source data analysis",
      "Pattern recognition",
      "Strategic insights",
      "Decision support"
    ]
  }
};

export default function AgentDetailPanel({ agent, onClose }: AgentDetailPanelProps) {
  const { watch, setValue } = useFormContext();
  const selected = watch("agents") || [];
  const isSelected = agent ? selected.includes(agent.id) : false;

  if (!agent) return null;

  const details = AGENT_DETAILS[agent.id] || {
    description: agent.reason || "This agent provides specialized capabilities for your organization.",
    capabilities: []
  };

  const toggleAgent = () => {
    if (isSelected) {
      setValue("agents", selected.filter((id: string) => id !== agent.id));
    } else {
      // Handle dependencies
      const dependencies = agent.id ? AGENT_DEPENDENCIES[agent.id] : null;
      let newSelected = [...selected];

      // Auto-add required dependencies
      if (dependencies?.required) {
        dependencies.required.forEach((req) => {
          if (!newSelected.includes(req)) {
            newSelected.push(req);
          }
        });
      }

      // Add the agent itself
      newSelected.push(agent.id);
      setValue("agents", newSelected);

      // Show prompt for recommended dependencies
      if (dependencies?.recommended && dependencies.recommended.length > 0) {
        const missingRecommended = dependencies.recommended.filter(
          (rec) => !newSelected.includes(rec)
        );
        if (missingRecommended.length > 0) {
          const recommendedLabels = missingRecommended.map(getAgentLabel).join(", ");
          setTimeout(() => {
            // Simple alert for now - can be upgraded to toast/modal in UX-B43
            if (confirm(`We recommend enabling ${recommendedLabels} for best performance. Add them now?`)) {
              setValue("agents", [...newSelected, ...missingRecommended]);
            }
          }, 100);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute right-0 top-0 h-full w-full max-w-md
                    bg-[#0b0f17] border-l border-white/10
                    shadow-2xl p-8 sage-stack overflow-y-auto agent-panel-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white text-xl transition-colors"
          >
            ×
          </button>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white tracking-tight pr-8">
            {agent.label}
          </h1>
          <p className="text-white/60">{agent.category}</p>

          {/* Divider */}
          <div className="h-[1px] bg-white/10 my-4" />

          {/* Description */}
          <p className="text-white/70 leading-relaxed">{details.description}</p>

          {/* Capabilities */}
          {details.capabilities.length > 0 && (
            <div className="sage-stack-lg mt-6">
              <h2 className="text-lg font-semibold text-white">Capabilities</h2>
              <ul className="space-y-1">
                {details.capabilities.map((cap) => (
                  <li key={cap} className="text-white/60 text-sm">
                    • {cap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dependencies */}
          {(() => {
            const dependencies = agent.id ? AGENT_DEPENDENCIES[agent.id] : null;
            if (!dependencies || (!dependencies.required?.length && !dependencies.recommended?.length)) {
              return null;
            }
            return (
              <div className="sage-stack-lg mt-6">
                <h2 className="text-lg font-semibold text-white">Dependencies</h2>
                
                {dependencies.required && dependencies.required.length > 0 && (
                  <div className="sage-stack">
                    <h3 className="text-white/80 text-sm font-medium">Required</h3>
                    <ul className="space-y-1">
                      {dependencies.required.map((dep) => (
                        <li key={dep} className="text-red-300 text-sm">
                          • {getAgentLabel(dep)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dependencies.recommended && dependencies.recommended.length > 0 && (
                  <div className="sage-stack">
                    <h3 className="text-white/80 text-sm font-medium">Recommended</h3>
                    <ul className="space-y-1">
                      {dependencies.recommended.map((dep) => (
                        <li key={dep} className="text-purple-300 text-sm">
                          • {getAgentLabel(dep)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Priority Badge */}
          {agent.priority && (
            <div className="mt-4">
              <span className={`
                inline-block px-3 py-1 rounded-md text-xs font-medium
                ${agent.priority === "critical" ? "bg-red-500/20 text-red-300 border border-red-500/40" : ""}
                ${agent.priority === "operational" ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" : ""}
                ${agent.priority === "optional" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : ""}
                ${agent.priority === "advanced" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : ""}
              `}>
                {agent.priority.toUpperCase()}
              </span>
            </div>
          )}

          {/* Suggestions */}
          {(() => {
            const suggestions = getRecommendations(selected);
            const relevantSuggestions = suggestions.filter(
              (s) => s.id !== agent.id && !selected.includes(s.id)
            );
            
            if (relevantSuggestions.length === 0) return null;
            
            return (
              <div className="sage-stack-lg mt-6">
                <h2 className="text-lg font-semibold text-white">Suggestions</h2>
                <ul className="space-y-1">
                  {relevantSuggestions.slice(0, 3).map((suggestion) => (
                    <li key={suggestion.id} className="text-yellow-300 text-sm">
                      • Consider adding {suggestion.label} for enhanced capability
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* Select / Deselect */}
          <button
            onClick={() => {
              toggleAgent();
              onClose();
            }}
            className="mt-8 sage-btn sage-btn-primary w-full"
          >
            {isSelected ? "Remove Agent" : "Add Agent"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

