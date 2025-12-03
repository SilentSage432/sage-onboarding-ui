"use client";

import { useEffect, useRef } from "react";

export default function MeshPanel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.fillText("Mesh Graph Visualization Placeholder", 20, 40);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Neural Mesh Graph</h1>
      <p className="text-gray-400 mb-4">
        Visualizing agent clusters and communication pathways.
      </p>
      <canvas
        ref={canvasRef}
        className="w-full h-[500px] bg-black/40 rounded-xl border border-white/10"
      />
    </div>
  );
}
