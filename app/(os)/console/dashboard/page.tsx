"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PanelSkeleton from "../components/PanelSkeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full">
        <PanelSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full text-gray-200"
    >
      <h1 className="text-2xl font-semibold mb-4">
        Welcome to SAGE Enterprise Console
      </h1>
      <p className="text-gray-400 text-sm max-w-2xl">
        Your operational environment is now live. Use the navigation rail to
        access your modules, inspect agents, view mesh activity, manage
        security posture, or configure advanced settings for your organization.
      </p>
      {/* HADRA-01 is launched globally via the floating orb in the console layout. */}
    </motion.div>
  );
}




