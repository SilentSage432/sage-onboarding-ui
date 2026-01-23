"use client";

import { use } from "react";
import FederationHealthMatrixPanel from "@/components/console/panels/FederationHealthMatrixPanel";
import FederationHealthCorePanel from "@/components/console/panels/FederationHealthCorePanel";
import FederationStatePanel from "@/components/console/panels/FederationStatePanel";

const federationPanels: Record<string, () => JSX.Element> = {
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
  const Panel = federationPanels[subslug];

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
