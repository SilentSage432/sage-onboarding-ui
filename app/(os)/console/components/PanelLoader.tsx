"use client";

import { moduleRegistry } from "@/lib/console/moduleRegistry";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";
import { isModuleUnlocked, isModuleVisibleToPerspective } from "@/lib/console/readinessUtils";
import LockedCapability from "@/components/console/LockedCapability";

export default function PanelLoader({ slug }: { slug: string }) {
  const readinessState = useReadinessStore();
  const mod = moduleRegistry.find((m) => m.slug === slug);

  if (!mod) {
    return (
      <div className="p-6 text-red-400">
        <h1 className="text-xl font-bold">Module Not Found</h1>
        <p className="text-gray-400 text-sm mt-2">
          No console module matches: <span className="font-mono">{slug}</span>
        </p>
      </div>
    );
  }

  // Check perspective visibility first (existence check, not readiness)
  // If module doesn't exist for this perspective, show NotFound
  if (!isModuleVisibleToPerspective(mod, readinessState.systemPerspective)) {
    return (
      <div className="p-6 text-slate-400">
        <h1 className="text-xl font-bold">Module Not Found</h1>
        <p className="text-gray-500 text-sm mt-2">
          This module does not exist for your system perspective.
        </p>
      </div>
    );
  }

  // Check if module is locked
  const isUnlocked = isModuleUnlocked(mod, readinessState.unlockedCapabilities);
  
  // If locked and it's a capability (not orientation/governance), show locked view
  if (!isUnlocked && mod.layer === 'capability') {
    return <LockedCapability module={mod} />;
  }

  // Otherwise, render the actual component
  const Component = mod.component;
  return <Component />;
}


