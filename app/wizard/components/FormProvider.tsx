"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enterpriseSchema, type EnterpriseOnboarding } from "../schema/enterprise";
import { ReactNode } from "react";

export function EnterpriseFormWrapper({ children }: { children: ReactNode }) {
  const methods = useForm<EnterpriseOnboarding>({
    resolver: zodResolver(enterpriseSchema),
    mode: "onChange",
    defaultValues: {
      accountType: "business",
      organization: {
        name: "",
        industry: undefined,
        size: undefined,
        region: "",
        retail: undefined,
        contractor: undefined,
        professional: undefined,
        healthcare: undefined,
      },
      security: { posture: "moderate", allowExternal: false, allowAutomation: true },
      modules: [],
      agents: [],
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

