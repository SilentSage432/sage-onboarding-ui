import { Cpu, Network, Shield, Activity, KeyRound, Settings } from "lucide-react";
import AgentsPanel from "@/components/console/panels/AgentsPanel";
import MeshPanel from "@/components/console/panels/MeshPanel";
import SecurityPanel from "@/components/console/panels/SecurityPanel";
import Rho2Panel from "@/components/console/panels/Rho2Panel";

export type ModuleDefinition = {
  slug: string;
  name: string;
  description: string;
  icon: any;
  component: () => JSX.Element;
};

export type AgentModule = {
  id: string;
  name: string;
  description: string;
  status: string;
  icon: any;
};

// Placeholder components until real panels are built
const Placeholder = (label: string) => () =>
  (
    <div className="p-6 text-gray-300">
      <h1 className="text-2xl font-bold mb-4">{label}</h1>
      <p className="text-gray-500">This panel is being prepared by SAGE.</p>
    </div>
  );

export const moduleRegistry: ModuleDefinition[] = [
  {
    slug: "modules",
    name: "Modules",
    description: "Manage active modules and system capabilities.",
    icon: Cpu,
    component: Placeholder("Modules Panel"),
  },
  {
    slug: "agents",
    name: "Agents",
    description: "Manage deployed and available agents.",
    icon: Activity,
    component: AgentsPanel,
  },
  {
    slug: "mesh",
    name: "Mesh Graph",
    description: "Visualize the neural mesh.",
    icon: Network,
    component: MeshPanel,
  },
  {
    slug: "rho2",
    name: "Rho² Keyring",
    description: "Cryptographic keyring inspector.",
    icon: KeyRound,
    component: Rho2Panel,
  },
  {
    slug: "security",
    name: "Security Posture",
    description: "System-wide security overview.",
    icon: Shield,
    component: SecurityPanel,
  },
  {
    slug: "settings",
    name: "Settings",
    description: "Customize system behavior, UI themes, and organization settings.",
    icon: Settings,
    component: Placeholder("Settings Panel"),
  },
];


