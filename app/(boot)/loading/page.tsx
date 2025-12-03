"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const statusMessages = [
  "Verifying configuration…",
  "Loading core modules…",
  "Initializing mesh interfaces…",
  "Establishing secure connections…",
  "Preparing environment…",
  "System ready",
];

export default function BootLoading() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step < statusMessages.length - 1) {
      const messageTimer = setTimeout(() => {
        setStep(step + 1);
      }, 1200);

      // Smooth progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const target = ((step + 1) / statusMessages.length) * 100;
          if (prev < target) {
            return Math.min(prev + 2, target);
          }
          return prev;
        });
      }, 50);

      return () => {
        clearTimeout(messageTimer);
        clearInterval(progressInterval);
      };
    } else {
      // Final progress to 100%
      setProgress(100);
    }
  }, [step]);

  const isComplete = step === statusMessages.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white"
    >
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl opacity-60" />
      </div>

      <Card className="w-[480px] relative z-10 bg-white/10 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Initializing Environment…
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} className="h-2" />
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-zinc-400 min-h-[20px]"
          >
            ● {statusMessages[step]}
          </motion.div>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-green-400"
            >
              Ready to launch
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

