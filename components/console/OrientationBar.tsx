"use client";

import { useEffect } from "react";
import { Clock, Eye } from "lucide-react";
import { useReadinessStore, updateDaysSinceActivation } from "@/app/(os)/console/store/useReadinessStore";

/**
 * OrientationBar Component
 * 
 * Always-visible orientation layer that displays:
 * - Time since activation
 * - System state (Observing, Learning, etc.)
 * - Non-actionable status messages
 * 
 * This component reflects state only - it does not drive behavior.
 */
export default function OrientationBar() {
  const readinessState = useReadinessStore();
  
  // Update days since activation periodically (passive update)
  useEffect(() => {
    updateDaysSinceActivation();
    const interval = setInterval(() => {
      updateDaysSinceActivation();
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [readinessState.activationTime]);
  
  // Determine system state message based on observation phase
  const getSystemStateMessage = (): string => {
    switch (readinessState.observationPhase) {
      case 'initial':
        return 'Observing';
      case 'learning':
        return 'Learning';
      case 'ready':
        return 'Ready';
      default:
        return 'Observing';
    }
  };
  
  // Format time since activation
  const formatTimeSinceActivation = (): string => {
    if (!readinessState.activationTime) {
      return 'Not activated';
    }
    
    const days = readinessState.daysSinceActivation;
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Day 1';
    } else {
      return `Day ${days}`;
    }
  };
  
  // Only show if activation time is set
  if (!readinessState.activationTime) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-4 text-xs text-slate-400">
      {/* Time Since Activation */}
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-slate-500" />
        <span className="tracking-wide">
          {formatTimeSinceActivation()}
        </span>
      </div>
      
      {/* System State */}
      <div className="flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5 text-slate-500" />
        <span className="tracking-wide">
          SAGE is {getSystemStateMessage().toLowerCase()}
        </span>
      </div>
      
      {/* Observation Events Count (if any) */}
      {readinessState.observationEvents.length > 0 && (
        <div className="text-slate-500">
          {readinessState.observationEvents.length} event{readinessState.observationEvents.length !== 1 ? 's' : ''} observed
        </div>
      )}
    </div>
  );
}
