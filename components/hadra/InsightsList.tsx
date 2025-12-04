"use client";

import InsightCard from "./InsightCard";
import { HadraInsight } from "@/lib/hadra/insight";

export default function InsightsList({ insights }: { insights: HadraInsight[] }) {
  return (
    <div className="flex flex-col">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}

