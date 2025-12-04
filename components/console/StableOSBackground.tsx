"use client";

import { memo } from "react";

/**
 * StableOSBackground
 * GPU-isolated, memoized background layer for OS Console
 * 
 * This component:
 * - Never re-renders (memoized)
 * - Sits on its own GPU layer (transform-gpu)
 * - Fixed position ensures no drift
 * - Below all content (z-index: -50)
 * - No pointer events to avoid interaction issues
 * 
 * This eliminates flicker, jitter, and background redraw artifacts
 * that occur when React re-renders or panels animate.
 */
function StableOSBackground() {
  return (
    <div
      className="
        fixed inset-0 -z-50
        bg-gradient-to-br from-[#0b0f17] via-[#0c101a] to-[#0a0d14]
        opacity-[0.96]
        pointer-events-none
        will-change-transform
        transform-gpu
      "
      style={{
        // Force GPU acceleration
        transform: 'translateZ(0)',
        // Prevent any repaints
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}
    >
      {/* Optional noise texture layer - uncomment if noise.png exists */}
      {/* <div
        className="
          absolute inset-0
          opacity-[0.07]
          bg-[url('/noise.png')]
          mix-blend-overlay
          pointer-events-none
        "
      /> */}
    </div>
  );
}

export default memo(StableOSBackground);

