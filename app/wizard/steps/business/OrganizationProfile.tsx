"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TextField, SelectField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

const INDUSTRY_TYPES = [
  { id: "retail", label: "Retail" },
  { id: "contractor", label: "Contractor / Trades" },
  { id: "professional", label: "Professional Services" },
  { id: "healthcare", label: "Healthcare / Med Services" },
] as const;

type IndustryType = typeof INDUSTRY_TYPES[number]["id"];

export default function OrganizationProfile() {
  const { watch, setValue } = useFormContext();
  const industry = watch("organization.industry") as IndustryType | undefined;

  const handleIndustrySelect = (industryType: IndustryType) => {
    setValue("organization.industry", industryType);
  };

  return (
    <div className="flex flex-col sage-stack-xl">
      {/* Organization Name */}
      <TextField
        name="organization.name"
        label="Organization Name"
        placeholder="Example: Arcadia Plumbing Services"
      />

      {/* Industry Selection */}
      <div className="sage-stack">
        <label className="sage-label text-white/80 tracking-wide">
          What type of organization are you?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INDUSTRY_TYPES.map((type) => (
            <Button
              key={type.id}
              type="button"
              variant={industry === type.id ? "default" : "outline"}
              onClick={() => handleIndustrySelect(type.id)}
              className={cn(
                "w-full justify-start",
                industry === type.id && "bg-white text-slate-900"
              )}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Adaptive Industry Panels */}
      <AnimatePresence mode="wait">
        {industry === "retail" && (
          <RetailPanel key="retail" />
        )}
        {industry === "contractor" && (
          <ContractorPanel key="contractor" />
        )}
        {industry === "professional" && (
          <ProfessionalPanel key="professional" />
        )}
        {industry === "healthcare" && (
          <HealthcarePanel key="healthcare" />
        )}
      </AnimatePresence>

      {/* Organization Size */}
      <SelectField
        name="organization.size"
        label="Organization Size"
        options={["solo", "1-10", "11-50", "51-200", "201+"]}
      />

      {/* Region */}
      <TextField
        name="organization.region"
        label="Region"
        placeholder="Example: US-West, EU-Central, APAC"
      />
    </div>
  );
}

// Adaptive Panel Components
function RetailPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mt-2 p-4 rounded-lg bg-white/5 border border-white/10 sage-stack"
    >
      <p className="sage-label text-white/80">Retail Details</p>
      <TextField
        name="organization.retail.skus"
        label="Approximate number of SKUs"
        placeholder="e.g., 500, 1000, 5000+"
      />
      <TextField
        name="organization.retail.onlineStore"
        label="Do you have an online store?"
        placeholder="Yes / No"
      />
      <TextField
        name="organization.retail.inventoryFrequency"
        label="Inventory count frequency"
        placeholder="e.g., Daily, Weekly, Monthly"
      />
    </motion.div>
  );
}

function ContractorPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mt-2 p-4 rounded-lg bg-white/5 border border-white/10 sage-stack"
    >
      <p className="sage-label text-white/80">Contractor Details</p>
      <TextField
        name="organization.contractor.fieldTechs"
        label="Number of field technicians"
        placeholder="e.g., 5, 10, 25+"
      />
      <TextField
        name="organization.contractor.dispatchSoftware"
        label="Primary dispatch software (if any)"
        placeholder="e.g., ServiceTitan, Jobber, FieldPulse"
      />
      <TextField
        name="organization.contractor.serviceRadius"
        label="Service radius (miles)"
        placeholder="e.g., 25, 50, 100+"
      />
    </motion.div>
  );
}

function ProfessionalPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mt-2 p-4 rounded-lg bg-white/5 border border-white/10 sage-stack"
    >
      <p className="sage-label text-white/80">Professional Services Details</p>
      <TextField
        name="organization.professional.billingModel"
        label="Do you bill hourly or per project?"
        placeholder="Hourly / Per Project / Both"
      />
      <TextField
        name="organization.professional.documentWorkflow"
        label="Document workflow system"
        placeholder="e.g., Notion, Asana, custom"
      />
      <TextField
        name="organization.professional.teamSize"
        label="Number of team members"
        placeholder="e.g., 5, 15, 50+"
      />
    </motion.div>
  );
}

function HealthcarePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mt-2 p-4 rounded-lg bg-white/5 border border-white/10 sage-stack"
    >
      <p className="sage-label text-white/80">Healthcare Details</p>
      <TextField
        name="organization.healthcare.hipaaCompliance"
        label="HIPAA compliance required?"
        placeholder="Yes / No"
      />
      <TextField
        name="organization.healthcare.recordSystem"
        label="Record system (EHR/EMR)"
        placeholder="e.g., Epic, Cerner, Athenahealth"
      />
      <TextField
        name="organization.healthcare.staffPerLocation"
        label="# of staff per location"
        placeholder="e.g., 10, 25, 50+"
      />
    </motion.div>
  );
}

