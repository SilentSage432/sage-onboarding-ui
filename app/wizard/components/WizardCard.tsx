"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface WizardCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export default function WizardCard({ title, description, children }: WizardCardProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {title && (
        <motion.h2
          className="text-xl font-semibold text-white"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0 }}
        >
          {title}
        </motion.h2>
      )}
      {description && (
        <motion.p
          className="text-white/50 text-sm"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          {description}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

