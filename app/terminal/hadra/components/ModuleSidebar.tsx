"use client";

export default function ModuleSidebar() {
  return (
    <div className="w-64 h-full bg-black/60 border-r border-white/10 backdrop-blur-lg p-4">
      <h2 className="text-lg font-semibold mb-4 opacity-80">Modules</h2>
      <ul className="space-y-3 text-sm opacity-70">
        <li>• Rho² Security</li>
        <li>• Agent Mesh</li>
        <li>• Audit Stream</li>
        <li>• System Console</li>
        <li>• Storage</li>
        <li>• Network</li>
      </ul>
    </div>
  );
}


