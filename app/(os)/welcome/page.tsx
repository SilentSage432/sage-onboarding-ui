"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useOnboardingDataStore } from "@/app/wizard/store/useOnboardingDataStore";

export default function ConsoleWelcome() {
  const router = useRouter();
  const onboardingData = useOnboardingDataStore();
  
  // Get organization data from onboarding store
  const organizationName = onboardingData.business.orgName || "";
  const operatorName = "Operator"; // Can be enhanced later with actual operator name

  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated grid background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #4fc3f7 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Bloom behind logo */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute w-64 h-64 rounded-full bg-cyan-400 blur-3xl"
      />

      {/* Console Welcome Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        className="relative z-20 text-center max-w-xl"
      >
        <h1 className="text-3xl font-light tracking-wide mb-4">
          Welcome, {operatorName}
        </h1>

        <p className="text-white/60 text-sm mb-10 tracking-wide">
          {organizationName
            ? `Your environment for ${organizationName} is now active.`
            : "Your SAGE Enterprise environment is now active."}
        </p>

        {/* Rho2 Badge */}
        <div className="mb-10">
          <span className="px-4 py-1 text-xs tracking-wider border border-white/20 rounded-full text-white/70">
            Rho² Signature Verified
          </span>
        </div>

        {/* Continue */}
        <button
          onClick={() => router.push("/console")}
          className="px-6 py-2 border border-white/20 rounded-lg text-white/80 hover:text-white hover:border-white/40 transition"
        >
          Continue to Console
        </button>

        {/* Micro Telemetry */}
        <div className="mt-10 text-xs text-white/30 tracking-widest">
          SAGE v1.0 · Secured Node Handshake Complete · Rho² Link Stable
        </div>
      </motion.div>
    </div>
  );
}

