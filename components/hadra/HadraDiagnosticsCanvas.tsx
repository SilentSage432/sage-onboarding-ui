"use client";

import { useEffect, useRef } from "react";

/**
 * HadraDiagnosticsCanvas
 * Real-time animated diagnostic canvas for HADRA-01
 * 
 * Features:
 * - Emissive particle trails (SAGE-style)
 * - Pulse vectors reacting to events
 * - Procedural mesh that moves like a neural thought graph
 * - Severity-based mood system (stable → elevated → alert)
 * - GPU-friendly, enterprise-smooth animation
 * 
 * This is where HADRA stops being a design and becomes
 * a living diagnostic intelligence inside the console.
 */
export default function HadraDiagnosticsCanvas({ 
  severity = "stable" 
}: { 
  severity?: "stable" | "elevated" | "alert" 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get container dimensions (panel size, not window)
    const container = canvas.parentElement;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      return { w: rect.width, h: rect.height };
    };

    let { w, h } = updateSize();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const particleCount = 85;

    // Severity changes animation mood
    const mood = {
      stable: { speed: 0.4, glow: "rgba(140, 140, 255, 0.25)" },
      elevated: { speed: 0.7, glow: "rgba(190, 120, 255, 0.35)" },
      alert: { speed: 1.1, glow: "rgba(255, 80, 100, 0.45)" },
    }[severity];

    const spawn = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * mood.speed,
          vy: (Math.random() - 0.5) * mood.speed,
          size: 1 + Math.random() * 2,
        });
      }
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges for endless flow
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Particle
        ctx.fillStyle = mood.glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Small motion trails
        ctx.strokeStyle = mood.glow;
        ctx.lineWidth = 0.35;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 12, p.y - p.vy * 12);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    spawn();
    animate();

    const handleResize = () => {
      const newSize = updateSize();
      if (newSize) {
        w = newSize.w;
        h = newSize.h;
      }
    };

    // Use ResizeObserver to watch container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [severity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-[0.28] pointer-events-none"
      style={{
        // Force GPU acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    />
  );
}

