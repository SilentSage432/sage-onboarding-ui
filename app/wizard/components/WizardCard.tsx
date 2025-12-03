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
      className="sage-card relative rounded-2xl px-10 py-12 sage-stack
                 bg-white/[0.04] border border-white/10
                 backdrop-blur-xl shadow-[0_0_40px_rgb(0,0,0,0.35)]
                 before:absolute before:inset-0
                 before:rounded-2xl 
                 before:bg-gradient-to-br before:from-white/[0.06] before:to-transparent
                 before:pointer-events-none"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* SAGE OS Inner Glow Layer */}
      <div className="absolute inset-0 rounded-2xl opacity-[0.09]
                      bg-gradient-to-b from-purple-300/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {title && (
          <motion.h2
            className="sage-h2 text-white"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0 }}
          >
            {title}
          </motion.h2>
        )}
        {description && (
          <motion.p
            className="sage-body text-white/50"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          >
            {description}
          </motion.p>
        )}
        <motion.div
          className="sage-stack"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}

