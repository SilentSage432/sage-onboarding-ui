"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TransitionWrapperProps {
  children: ReactNode;
  stepId: string;
}

export default function TransitionWrapper({ children, stepId }: TransitionWrapperProps) {
  return (
    <motion.div
      key={stepId}
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{
        duration: 0.32,
        ease: [0.23, 1, 0.32, 1], // Apple-style cubic bezier
      }}
    >
      {children}
    </motion.div>
  );
}

