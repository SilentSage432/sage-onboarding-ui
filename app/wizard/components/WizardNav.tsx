"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function WizardNav({
  canBack = true,
  onBack,
  onNext,
  showRestart = false,
  onRestart,
  nextLabel = "Continue",
}: {
  canBack?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  showRestart?: boolean;
  onRestart?: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* LEFT BUTTONS: Back + Restart */}
      <div className="flex gap-3">
        {canBack && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Button 
              variant="secondary" 
              onClick={onBack}
              className="btn-secondary"
            >
              Back
            </Button>
          </motion.div>
        )}
        {showRestart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="secondary" 
              onClick={onRestart}
              className="btn-secondary"
            >
              Restart
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* RIGHT BUTTON: Continue/Finish */}
      <div className="flex">
        {onNext && nextLabel && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          >
            <Button 
              onClick={onNext}
              className="btn-primary"
            >
              {nextLabel}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

