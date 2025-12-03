"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface TransitionWrapperProps {
  children: ReactNode;
  step: string | number;
}

export default function TransitionWrapper({ step, children }: TransitionWrapperProps) {
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            y: 12,
            scale: 0.985,
            filter: "blur(4px)"
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration: 0.45,
              ease: [0.18, 0.9, 0.3, 1]  // cinematic ease
            }
          }}
          exit={{
            opacity: 0,
            y: -10,
            scale: 0.985,
            filter: "blur(4px)",
            transition: {
              duration: 0.32,
              ease: [0.6, 0.05, 0.8, 0.1] // smooth, quick exit
            }
          }}
          className="absolute inset-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

