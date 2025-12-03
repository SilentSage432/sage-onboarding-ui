import { Cpu, Network, Shield, Activity, KeyRound, Settings } from "lucide-react";

export type ModuleDefinition = {
  slug: string;
  name: string;
  description: string;
  icon: any;
  component: () => JSX.Element;
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
    description: "Manage all deployed and available agents.",
    icon: Activity,
    component: Placeholder("Agents Panel"),
  },
  {
    slug: "mesh",
    name: "Mesh Graph",
    description: "Visualize the neural mesh connections and agent activity.",
    icon: Network,
    component: Placeholder("Mesh Graph Panel"),
  },
  {
    slug: "rho2",
    name: "Rho² Keyring",
    description: "Manage cryptographic identities and federation binding.",
    icon: KeyRound,
    component: Placeholder("Rho² Keyring Panel"),
  },
  {
    slug: "security",
    name: "Security Posture",
    description: "System-wide security configuration and hardening.",
    icon: Shield,
    component: Placeholder("Security Panel"),
  },
  {
    slug: "settings",
    name: "Settings",
    description: "Customize system behavior, UI themes, and organization settings.",
    icon: Settings,
    component: Placeholder("Settings Panel"),
  },
];


