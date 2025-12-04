"use client";

import { memo } from "react";

/**
 * SovereignBackground
 * Minimal, cinematic, enterprise-grade OS background for SAGE
 * 
 * Features:
 * - Ultra-deep indigo > black radial fade
 * - Soft noise texture / neural static layer
 * - Barely-visible vertical grid lines (8% opacity)
 * - Occasional light specks (like neurons pulsing far away)
 * - Absolutely ZERO motion unless triggered by system events
 * 
 * This is the perfect background for a system like SAGE because:
 * - It frames all modules cleanly
 * - It feels "alive" without animation
 * - HADRA overlays look incredible on it
 * - It matches the future OS-grade aesthetic
 */
function SovereignBackground() {
  return (
    <div className="fixed inset-0 z-[var(--z-bg)] pointer-events-none overflow-hidden">
      {/* Deep gradient foundation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#161a24_0%,#0b0f17_40%,#05070a_100%)]" />

      {/* Neural noise - optional, only if noise.png exists */}
      {/* <div className="absolute inset-0 opacity-[0.12] mix-blend-soft-light bg-[url('/noise.png')]" /> */}

      {/* Soft vertical grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        <defs>
          <pattern id="sovereign-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sovereign-grid)" />
      </svg>

      {/* Distant neural sparks */}
      <div className="absolute inset-0 animate-pulse-slow">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              top: `${10 + (i * 7.5)}%`,
              left: `${5 + (i * 8)}%`,
              opacity: 0.05,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(SovereignBackground);

