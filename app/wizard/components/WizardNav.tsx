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
    <div className="flex w-full justify-between items-center pt-10 px-2">
      {/* Restart button - always on left */}
      <div>
        {showRestart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRestart}
              className="text-white opacity-90 hover:opacity-100"
            >
              Restart
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Back button - center, only when canBack is true */}
      {canBack && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
        </motion.div>
      )}
      
      {/* Next/Continue/Finish button - always on right */}
      <div>
        {onNext && nextLabel && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          >
            <Button onClick={onNext}>{nextLabel}</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

