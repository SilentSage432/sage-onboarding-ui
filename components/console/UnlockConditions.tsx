"use client";

import { Clock, Activity, Shield, Eye } from "lucide-react";
import { ReadinessGate } from "@/lib/console/moduleRegistry";
import { ReadinessState, CapabilityLock } from "@/app/(os)/console/store/useReadinessStore";

/**
 * UnlockConditions Component
 * 
 * Displays the readiness gates that must be met to unlock a capability.
 * Shows descriptive information about time, behavior, consent, and observation requirements.
 * 
 * This is informational only - it does not evaluate or enforce conditions.
 */
export default function UnlockConditions({
  gates,
  lockInfo,
  readinessState,
}: {
  gates: ReadinessGate[];
  lockInfo?: CapabilityLock;
  readinessState: ReadinessState;
}) {
  const getGateIcon = (type: ReadinessGate['type']) => {
    switch (type) {
      case 'time':
        return Clock;
      case 'behavior':
        return Activity;
      case 'consent':
        return Shield;
      case 'observation':
        return Eye;
      default:
        return Clock;
    }
  };
  
  const getGateStatus = (gate: ReadinessGate) => {
    if (!lockInfo) return 'pending';
    const lockGate = lockInfo.gates.find(g => g.type === gate.type && g.condition === gate.condition);
    return lockGate?.status || 'pending';
  };
  
  const formatTimeCondition = (condition: string): string => {
    // Extract days from condition like "7 days" or "7d"
    const match = condition.match(/(\d+)\s*(?:days?|d)/i);
    if (match) {
      const days = parseInt(match[1], 10);
      const daysSince = readinessState.daysSinceActivation;
      const remaining = Math.max(0, days - daysSince);
      if (remaining > 0) {
        return `${remaining} day${remaining !== 1 ? 's' : ''} remaining`;
      }
      return "Time requirement met";
    }
    return condition;
  };
  
  const formatBehaviorCondition = (condition: string, readinessState: ReadinessState): string => {
    // Extract count from condition like "10 automation events" or "10-events"
    const match = condition.match(/(\d+)/);
    if (match) {
      const required = parseInt(match[1], 10);
      const current = readinessState.automationEventCount;
      return `${current} of ${required} events observed`;
    }
    return condition;
  };
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium text-white mb-4">
        Unlock Conditions
      </h2>
      <div className="space-y-3">
        {gates.map((gate, index) => {
          const Icon = getGateIcon(gate.type);
          const status = getGateStatus(gate);
          const isMet = status === 'met';
          
          let statusText = gate.condition;
          if (gate.type === 'time') {
            statusText = formatTimeCondition(gate.condition);
          } else if (gate.type === 'behavior') {
            statusText = formatBehaviorCondition(gate.condition, readinessState);
          }
          
          return (
            <div
              key={index}
              className={`
                p-4 rounded-lg border
                ${isMet 
                  ? 'bg-green-900/20 border-green-700/30' 
                  : 'bg-slate-900/50 border-slate-700/50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`
                    h-5 w-5 mt-0.5 flex-shrink-0
                    ${isMet ? 'text-green-400' : 'text-slate-400'}
                  `}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white capitalize">
                      {gate.type}
                    </span>
                    {isMet && (
                      <span className="text-xs text-green-400">✓ Met</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    {gate.description}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {statusText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Note about patience */}
      <div className="mt-4 p-3 bg-slate-900/30 border border-slate-700/30 rounded-lg">
        <p className="text-xs text-slate-500 italic">
          Capabilities unlock when readiness conditions are naturally met through
          system operation and observation. Patience is a feature.
        </p>
      </div>
    </div>
  );
}
