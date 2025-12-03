"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BootScreen() {
  const router = useRouter();

  // After cinematic, redirect to the welcome screen
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/console/welcome");
    }, 4800); // 4.8s cinematic
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden relative">
      {/* Warming pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute text-center z-10"
      >
        <h1 className="text-white/90 tracking-[0.25em] text-xl font-light">
          INITIALIZING
        </h1>
      </motion.div>

      {/* Lattice grid animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.8, duration: 1.6 }}
        className="absolute inset-0 bg-gradient-to-br from-[#0a0f16] to-black"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at center, #4fc3f7 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.12,
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* Central pulse bloom */}
      <motion.div
        initial={{ scale: 0, opacity: 0.0 }}
        animate={{ scale: 12, opacity: 0.05 }}
        transition={{ duration: 2.8, ease: "easeOut", delay: 0.5 }}
        className="absolute w-16 h-16 rounded-full bg-cyan-400 blur-3xl"
      />

      {/* Activation text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.4 }}
        className="absolute bottom-20 text-center z-10"
      >
        <p className="text-sm font-light tracking-widest text-white/70">
          SAGE ENTERPRISE CONSOLE
        </p>
        <p className="text-xs text-white/40 mt-1">
          Activation Sequence Started…
        </p>
      </motion.div>
    </div>
  );
}

