"use client";

import { HadraInsight } from "@/lib/hadra/insight";
import { severityStyles } from "@/lib/hadra/insightStyle";
import { formatTimestamp } from "@/lib/hadra/formatInsight";
import { cn } from "@/lib/utils";

export default function InsightCard({ insight }: { insight: HadraInsight }) {
  const style = severityStyles[insight.severity];

  return (
    <div
      className={cn(
        "p-4 rounded-xl mb-4 backdrop-blur-md bg-white/5 border transition-all cursor-default",
        style.border,
        style.glow
      )}
    >
      {/* Title + Time */}
      <div className="flex justify-between items-center mb-2">
        <h3 className={cn("font-semibold text-sm", style.text)}>
          {insight.title}
        </h3>
        <span className="text-xs text-gray-400">
          {formatTimestamp(insight.timestamp)}
        </span>
      </div>

      {/* Description */}
      {insight.description && (
        <p className="text-gray-300 text-xs leading-relaxed mb-3">
          {insight.description}
        </p>
      )}

      {/* Actions */}
      {insight.actions && insight.actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {insight.actions.map((a, i) => (
            <button
              key={i}
              className="px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 transition border border-white/10 text-gray-200"
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

