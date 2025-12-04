"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface TransitionWrapperProps {
  children: ReactNode;
  step: string | number;
}

export default function TransitionWrapper({ step, children }: TransitionWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
        transition={{
          duration: 0.38,
          ease: [0.22, 1, 0.36, 1], // Apple/SAGE OS easing
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

