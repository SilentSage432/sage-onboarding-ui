"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

const steps = [
  "Validating deployment blueprint…",
  "Establishing secure Rho² channel…",
  "Requesting shard negotiation from Federation…",
  "Provisioning core subsystems…",
  "Deploying selected agents…",
  "Configuring organization mesh graph…",
  "Initializing operator console…",
];

export default function InitializingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current < steps.length - 1) {
      const t = setTimeout(() => setCurrent(current + 1), 1500);
      return () => clearTimeout(t);
    } else {
      const t2 = setTimeout(() => {
        router.push("/console");
      }, 1800);
      return () => clearTimeout(t2);
    }
  }, [current, router]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold mb-10 tracking-wide"
      >
        Initializing SAGE Environment
      </motion.h1>

      <div className="w-full max-w-lg space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: index <= current ? 1 : 0.2 }}
            className="flex items-center space-x-3"
          >
            {index < current ? (
              <CheckCircle className="text-green-400 h-5 w-5" />
            ) : index === current ? (
              <Loader2 className="animate-spin text-blue-400 h-5 w-5" />
            ) : (
              <div className="h-5 w-5 border border-gray-600 rounded-full" />
            )}
            <span className={index === current ? "text-blue-300" : "text-gray-400"}>
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1 }}
        className="mt-12 text-xs text-gray-500 tracking-wide text-center"
      >
        SAGE Federation • Rho² Protected Channel • Autonomous Operator Bridge
      </motion.div>
    </div>
  );
}

