"use client";

import { type ReactElement } from "react";
import { ModuleDefinition } from "@/lib/console/moduleRegistry";
import { Eye } from "lucide-react";

/**
 * CapabilityPreview Component
 * 
 * Shows a preview of what a locked capability will do.
 * If a custom lockedComponent is provided, it renders that.
 * Otherwise, shows a default preview message.
 * 
 * This is informational only - no functional access is granted.
 */
export default function CapabilityPreview({
  module,
  previewComponent,
}: {
  module: ModuleDefinition;
  previewComponent?: () => ReactElement;
}) {
  if (previewComponent) {
    // Render custom preview component
    const Preview = previewComponent;
    return (
      <div className="mt-6 p-6 bg-slate-900/30 border border-slate-700/30 rounded-lg">
        <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </div>
        <div className="opacity-60 pointer-events-none">
          <Preview />
        </div>
      </div>
    );
  }
  
  // Default preview message
  return (
    <div className="mt-6 p-6 bg-slate-900/30 border border-slate-700/30 rounded-lg">
      <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm">
        <Eye className="h-4 w-4" />
        <span>Preview</span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">
        This capability will become available once readiness conditions are met.
        The system is currently observing and learning to ensure safe and effective
        operation of this feature.
      </p>
      <p className="text-slate-500 text-xs mt-3 italic">
        {module.description}
      </p>
    </div>
  );
}
