"use client";

import { useEffect, useRef } from "react";
import { memo } from "react";

/**
 * NeuralMeshBackground
 * GPU-isolated, canvas-driven neural mesh background for SAGE OS
 * 
 * Features:
 * - Zero-glitch, zero-flicker rendering
 * - Never re-renders (memoized)
 * - Cinematic neural mesh animation
 * - GPU-accelerated canvas rendering
 * - Signature SAGE OS visual identity
 * 
 * This creates the iconic "living neural network" backdrop
 * that makes SAGE OS feel like a real neural operating system.
 */
function NeuralMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    // Initialize neural nodes
    const nodes = Array.from({ length: 18 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.6 + Math.random() * 1.6,
      dx: (Math.random() - 0.5) * 0.08,
      dy: (Math.random() - 0.5) * 0.08,
    }));

    let animationFrameId: number;

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Gradient background
      const gradient = ctx.createRadialGradient(
        window.innerWidth * 0.5,
        window.innerHeight * 0.5,
        200,
        window.innerWidth * 0.5,
        window.innerHeight * 0.5,
        window.innerWidth
      );
      gradient.addColorStop(0, "#0b0f17");
      gradient.addColorStop(1, "#080b11");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw nodes + neural connections
      nodes.forEach((n) => {
        // Update position
        n.x += n.dx;
        n.y += n.dy;

        // Bounce off edges
        if (n.x < 0 || n.x > window.innerWidth) n.dx *= -1;
        if (n.y < 0 || n.y > window.innerHeight) n.dy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,110,255,0.10)";
        ctx.fill();

        // Draw neural connections to nearby nodes
        nodes.forEach((m) => {
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 160) {
            ctx.strokeStyle = `rgba(155, 90, 255, ${(1 - dist / 160) * 0.08})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        fixed inset-0 -z-50
        w-screen h-screen
        pointer-events-none
        select-none
        transform-gpu
        will-change-contents
      "
      style={{
        // Force GPU acceleration
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}
    />
  );
}

export default memo(NeuralMeshBackground);

