"use client";

import { AGENT_CATEGORIES } from "../config/agents";

export default function AgentFilters({
  activeCategory,
  setCategory,
  search,
  setSearch,
}: {
  activeCategory: string;
  setCategory: (x: string) => void;
  search: string;
  setSearch: (x: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <input
        type="text"
        placeholder="Search agents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-white/40"
      />
      <div className="flex flex-col gap-2">
        {AGENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`text-left px-3 py-2 rounded-md transition ${
              activeCategory === cat.id
                ? "bg-purple-500/20 text-white border border-purple-400"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

