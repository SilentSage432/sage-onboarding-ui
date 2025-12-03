"use client";

import { moduleRegistry } from "@/lib/console/moduleRegistry";

export default function PanelLoader({ slug }: { slug: string }) {
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

  const Component = mod.component;
  return <Component />;
}


