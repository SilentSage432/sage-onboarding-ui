"use client";

import { use, useEffect, type ReactElement } from "react";
import FederationHealthMatrixPanel from "@/components/console/panels/FederationHealthMatrixPanel";
import FederationHealthCorePanel from "@/components/console/panels/FederationHealthCorePanel";
import FederationStatePanel from "@/components/console/panels/FederationStatePanel";
import { useReadinessStore } from "../../store/useReadinessStore";

const federationPanels: Record<string, () => ReactElement> = {
  "health-matrix": FederationHealthMatrixPanel,
  "health-core": FederationHealthCorePanel,
  "state": FederationStatePanel,
};

export default function FederationPanelPage({
  params,
}: {
  params: Promise<{ subslug: string }>;
}) {
  const { subslug } = use(params);
  const { observePanelVisit } = useReadinessStore();
  const Panel = federationPanels[subslug];

  // Observe panel visit for temporal continuity (perceptual infrastructure only)
  useEffect(() => {
    if (Panel) {
      observePanelVisit(`federation/${subslug}`);
    }
  }, [subslug, Panel, observePanelVisit]);

  if (!Panel) {
    return (
      <div className="p-6 text-red-400">
        <h1 className="text-xl font-bold">Federation Panel Not Found</h1>
        <p className="text-gray-400 text-sm mt-2">
          No federation panel matches: <span className="font-mono">{subslug}</span>
        </p>
      </div>
    );
  }

  return <Panel />;
}
