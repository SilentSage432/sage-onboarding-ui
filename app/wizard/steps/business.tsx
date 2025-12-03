"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WizardCard from "../components/WizardCard";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";

export const BusinessIndustryStep = () => (
  <WizardCard
    title="Business Industry"
    description="We adapt workflows and integrations to match industry needs."
  >
    <div className="sage-stack">
      <Input placeholder="Industry type" className="h-12" />
      <p className="sage-body text-white/50">
        Used to configure the business operating system. Example: Retail, e-commerce,
        appliances, healthcare, service, etc.
      </p>
    </div>
  </WizardCard>
);

export const BusinessSecurityProfileStep = () => (
  <WizardCard
    title="Security & Profile"
    description="We configure automation and protection based on operational risk."
  >
    <div className="sage-stack">
      <Input placeholder="Security level" className="h-12" />
      <p className="sage-body text-white/50">
        Frameworks, compliance, risk score, etc.
      </p>
    </div>
  </WizardCard>
);

export const BusinessSummaryStep = () => {
  const { watch } = useFormContext();
  const router = useRouter();

  const organization = watch("organization") || {};
  const security = watch("security") || {};
  const modules: string[] = watch("modules") || [];
  const agents: string[] = watch("agents") || [];

  const orgName = organization.name as string | undefined;
  const industry = organization.industry as string | undefined;
  const region = organization.region as string | undefined;
  const securityPosture = security.posture as string | undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto px-2 py-6 text-gray-200"
    >
      {/* Title */}
      <div className="sage-stack-lg text-center">
        <h2 className="sage-h1">
          Deployment Blueprint Summary
        </h2>
        <p className="sage-body text-gray-400">
          Final verification before SAGE initializes your organization's sovereign
          environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 — Org + Security + Modules + Agents */}
        <div className="bg-[#0E0F15] rounded-2xl p-5 border border-white/10 shadow-lg sage-stack-xl">
          <div>
            <h3 className="sage-h3 text-white mt-2 mb-3">
              Organization Overview
            </h3>
            <div className="sage-stack text-gray-300 text-sm">
              <p>
                <span className="text-gray-500">Name:</span>{" "}
                {orgName || "—"}
              </p>
              <p>
                <span className="text-gray-500">Industry:</span>{" "}
                {industry || "—"}
              </p>
              <p>
                <span className="text-gray-500">Region:</span>{" "}
                {region || "—"}
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="sage-h3 text-white mt-2 mb-3">
              Security Posture
            </h3>
            <p className="text-gray-300 text-sm">
              {securityPosture || "Balanced"}
            </p>
            <p className="mt-2 text-xs text-emerald-400 font-medium">
              ✓ Rho² Encryption: Enabled
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="sage-h3 text-white mt-2 mb-3">
              Modules Selected
            </h3>
            <ul className="sage-stack text-gray-300 text-sm">
              {modules.length > 0 ? (
                modules.map((m) => <li key={m}>• {m}</li>)
              ) : (
                <li className="text-gray-500">No modules selected</li>
              )}
            </ul>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="sage-h3 text-white mt-2 mb-3">
              Agents Selected
            </h3>
            <ul className="sage-stack text-gray-300 text-sm">
              {agents.length > 0 ? (
                agents.map((a) => <li key={a}>• {a}</li>)
              ) : (
                <li className="text-gray-500">No agents selected</li>
              )}
            </ul>
          </div>
        </div>

        {/* Column 2 — Infrastructure Preview */}
        <div className="bg-[#0E0F15] rounded-2xl p-5 border border-white/10 shadow-lg">
          <h3 className="sage-h3 text-white mt-2 mb-3">
            Infrastructure Readiness
          </h3>
          <ul className="sage-stack-lg text-gray-300 text-sm leading-relaxed">
            <li>• Federation identity keypair generation</li>
            <li>• Rho² shard vault registration</li>
            <li>• Agent sandbox initialization</li>
            <li>• Event stream channels provisioning</li>
            <li>• SAGE Mesh namespace creation</li>
            <li>• Observability stack (logs / metrics / traces)</li>
            <li>• Private memory graph schema</li>
            <li>• Role-based access matrix</li>
          </ul>
          <p className="text-xs text-gray-500 mt-6">
            These systems will activate automatically during initialization.
          </p>
        </div>

        {/* Column 3 — Completion Status */}
        <div className="bg-[#0E0F15] rounded-2xl p-5 border border-white/10 shadow-lg">
          <h3 className="sage-h3 text-white mt-2 mb-3">
            Deployment Status
          </h3>
          <div className="sage-stack-lg text-sm">
            <p className="text-emerald-400">✓ Org Profile Complete</p>
            <p className="text-emerald-400">✓ Security Posture Set</p>
            <p className="text-emerald-400">✓ Rho² Activated</p>
            <p className="text-emerald-400">✓ Module Selection Complete</p>
            <p className="text-emerald-400">✓ Agent Selection Complete</p>

            <hr className="border-white/10 my-4" />

            <p className="text-yellow-400">
              • Federation onboarding pending (auto)
            </p>
            <p className="text-yellow-400">
              • Namespace provisioning pending (auto)
            </p>
            <p className="text-yellow-400">
              • Agent containers staging pending (auto)
            </p>

            <hr className="border-white/10 my-4" />

            <p className="text-gray-500 text-xs">
              After initialization, your SAGE Console will unlock the dashboards,
              modules, and agents relevant to your configuration.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-gray-500">
          Review complete. Initialization will provision all selected modules and agents.
        </p>
        <Button
          size="lg"
          className="px-8 py-6 text-base bg-blue-500 hover:bg-blue-600 text-white shadow-xl rounded-full transition-all"
          onClick={() => router.push("/wizard/initializing")}
        >
          Finalize Deployment Blueprint & Initialize SAGE
        </Button>
      </div>
    </motion.div>
  );
};
