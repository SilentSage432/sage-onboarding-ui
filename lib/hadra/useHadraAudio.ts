"use client";

import { useMemo } from "react";

/**
 * HADRA Audio Event Engine
 * Silent by default until audio files are added to /public/hadra/audio/
 * 
 * To enable audio:
 * 1. Add audio files to /public/hadra/audio/
 * 2. Set NEXT_PUBLIC_HADRA_AUDIO_ENABLED=true in .env.local
 * 
 * Audio files needed:
 * - insight.mp3
 * - warning.mp3
 * - critical.mp3
 * - hover.wav
 * - open.wav
 * - close.wav
 */
const AUDIO_ENABLED = process.env.NEXT_PUBLIC_HADRA_AUDIO_ENABLED === 'true';

export function useHadraAudio() {
  return useMemo(() => {
    // Return no-op functions if audio is disabled
    // This completely prevents 404 errors
    if (!AUDIO_ENABLED) {
      return {
        insight: () => {},
        warning: () => {},
        critical: () => {},
        hover: () => {},
        open: () => {},
        close: () => {},
      };
    }

    const play = (file: string) => {
      if (typeof window === 'undefined') return;
      
      try {
        const audio = new Audio(`/hadra/audio/${file}`);
        audio.volume = 0.25;
        
        audio.play().catch(() => {
          // Autoplay blocked or file missing
        });
      } catch (error) {
        // Audio API not available
      }
    };

    return {
      insight: () => play("insight.mp3"),
      warning: () => play("warning.mp3"),
      critical: () => play("critical.mp3"),
      hover: () => play("hover.wav"),
      open: () => play("open.wav"),
      close: () => play("close.wav"),
    };
  }, []);
}

