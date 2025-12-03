import { z } from "zod";

// Adaptive industry-specific schemas
const retailSchema = z.object({
  skus: z.string().optional(),
  onlineStore: z.string().optional(),
  inventoryFrequency: z.string().optional(),
}).optional();

const contractorSchema = z.object({
  fieldTechs: z.string().optional(),
  dispatchSoftware: z.string().optional(),
  serviceRadius: z.string().optional(),
}).optional();

const professionalSchema = z.object({
  billingModel: z.string().optional(),
  documentWorkflow: z.string().optional(),
  teamSize: z.string().optional(),
}).optional();

const healthcareSchema = z.object({
  hipaaCompliance: z.string().optional(),
  recordSystem: z.string().optional(),
  staffPerLocation: z.string().optional(),
}).optional();

export const enterpriseSchema = z.object({
  accountType: z.enum(["business"]),
  organization: z.object({
    name: z.string().min(2),
    industry: z.enum(["retail", "contractor", "professional", "healthcare"]).optional(),
    size: z.enum(["solo", "1-10", "11-50", "51-200", "201+"]).optional(),
    region: z.string().optional(),
    // Adaptive industry fields (optional nested objects)
    retail: retailSchema,
    contractor: contractorSchema,
    professional: professionalSchema,
    healthcare: healthcareSchema,
  }).passthrough(), // Allow additional fields for adaptive panels
  security: z.object({
    posture: z.enum(["low", "moderate", "strict"]),
    allowExternal: z.boolean().default(false),
    allowAutomation: z.boolean().default(true),
  }),
  modules: z.array(z.string()).default([]),
  agents: z.array(z.string()).default([]),
});

export type EnterpriseOnboarding = z.infer<typeof enterpriseSchema>;

