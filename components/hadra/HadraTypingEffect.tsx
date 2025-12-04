"use client";

import { useEffect, useState } from "react";

/**
 * HadraTypingEffect
 * Animated typing effect for HADRA's messages
 * Creates the illusion of HADRA "thinking" and responding
 */
export default function HadraTypingEffect({ 
  text, 
  speed = 30 
}: { 
  text: string; 
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-purple-400 ml-1 animate-pulse" />
      )}
    </span>
  );
}

