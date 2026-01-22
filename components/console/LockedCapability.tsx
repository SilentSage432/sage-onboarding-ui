"use client";

import { Lock } from "lucide-react";
import { ModuleDefinition } from "@/lib/console/moduleRegistry";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";
import UnlockConditions from "./UnlockConditions";
import CapabilityPreview from "./CapabilityPreview";

/**
 * LockedCapability Component
 * 
 * Displays a locked capability with:
 * - Visual lock indicator
 * - Capability description
 * - Unlock conditions
 * - Preview of what the capability will do
 * 
 * This component is informational only - it does not unlock anything.
 */
export default function LockedCapability({ module }: { module: ModuleDefinition }) {
  const readinessState = useReadinessStore();
  
  // Find lock metadata for this capability
  const lockInfo = readinessState.lockedCapabilities.find(
    (lock) => lock.capabilitySlug === module.slug
  );
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-gray-300">
      <div className="max-w-2xl w-full space-y-6">
        {/* Lock Icon and Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Lock className="h-16 w-16 text-slate-500 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 border-2 border-slate-500/30 rounded-full" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-white">
            {module.name}
          </h1>
          <p className="text-slate-400 text-center max-w-md">
            {module.description}
          </p>
        </div>
        
        {/* Unlock Conditions */}
        {module.readinessGates && module.readinessGates.length > 0 && (
          <UnlockConditions
            gates={module.readinessGates}
            lockInfo={lockInfo}
            readinessState={readinessState}
          />
        )}
        
        {/* Capability Preview */}
        {module.lockedComponent ? (
          <CapabilityPreview
            module={module}
            previewComponent={module.lockedComponent}
          />
        ) : (
          <CapabilityPreview module={module} />
        )}
        
        {/* Unlock Message */}
        {module.unlockMessage && (
          <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-400 text-center">
              {module.unlockMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
