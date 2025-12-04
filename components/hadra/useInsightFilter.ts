"use client";

import { useMemo } from "react";
import { HadraInsight } from "@/lib/hadra/insight";

export function useInsightFilter(insights: HadraInsight[], pattern: HadraInsight | null) {
  // Use useMemo with stable dependency keys to avoid infinite loops
  // Create dependency keys from actual content, not array references
  const insightsIds = insights.map(i => `${i.id}:${i.title}`).join('|');
  const patternKey = pattern ? `${pattern.id}:${pattern.title}` : null;
  
  const filtered = useMemo(() => {
    let list = [...insights];

    if (pattern) {
      list = [...list, pattern];
    }

    // Deduplicate by title
    const unique = list.filter(
      (insight, index, arr) =>
        arr.findIndex((i) => i.title === insight.title) === index
    );

    return unique;
    // Only depend on stable string keys, not the objects themselves
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insightsIds, patternKey]);

  return filtered;
}

