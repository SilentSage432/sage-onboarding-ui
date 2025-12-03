"use client";

export default function InsightPanel() {
  return (
    <div className="w-72 h-full bg-black/60 border-l border-white/10 backdrop-blur-lg p-4">
      <h2 className="text-lg font-semibold mb-4 opacity-80">
        System Insights
      </h2>

      <div className="space-y-3 text-sm opacity-70">
        <p>• Rho² Status: Active</p>
        <p>• Mesh Nodes: 1 online</p>
        <p>• Pending agent tasks: 0</p>
        <p>• Health: Stable</p>
      </div>
    </div>
  );
}


