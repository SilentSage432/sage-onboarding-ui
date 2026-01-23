import { Cpu, Network, Shield, Activity, KeyRound, Settings, Gavel, Circle, Hexagon, Octagon, Triangle, X } from "lucide-react";
import AgentsPanel from "@/components/console/panels/AgentsPanel";
import MeshPanel from "@/components/console/panels/MeshPanel";
import SecurityPanel from "@/components/console/panels/SecurityPanel";
import Rho2Panel from "@/components/console/panels/Rho2Panel";
import GovernancePanel from "@/components/console/panels/GovernancePanel";
import ArcThetaPanel from "@/components/console/panels/ArcThetaPanel";
import ArcSigmaPanel from "@/components/console/panels/ArcSigmaPanel";
import ArcOmegaPanel from "@/components/console/panels/ArcOmegaPanel";
import ArcLambdaPanel from "@/components/console/panels/ArcLambdaPanel";
import ArcChiPanel from "@/components/console/panels/ArcChiPanel";
import ArcRho2LodgePanel from "@/components/console/panels/ArcRho2LodgePanel";
import { SystemPerspective } from "@/app/(os)/console/store/useReadinessStore";

/**
 * Readiness gate definition for capability unlocking.
 * This is metadata only - no logic is enforced here.
 */
export type ReadinessGate = {
  type: 'time' | 'behavior' | 'consent' | 'observation';
  condition: string; // e.g., "7 days", "10 automation events", "rho2-verified"
  description: string; // Why this gate exists
};

/**
 * Extended module definition supporting progressive revelation architecture.
 * Layer classification determines visibility rules.
 * Readiness gates are descriptive metadata only.
 */
export type ModuleDefinition = {
  slug: string;
  name: string;
  description: string;
  icon: any;
  component: () => JSX.Element;
  /**
   * Layer classification determines visibility and access rules:
   * - orientation: Always visible, informational only
   * - capability: Gated by readiness (may be locked)
   * - governance: Always accessible, non-prominent
   */
  layer: 'orientation' | 'capability' | 'governance';
  /**
   * Optional readiness gates that describe unlock conditions.
   * This is metadata only - no evaluation logic here.
   */
  readinessGates?: ReadinessGate[];
  /**
   * Optional preview component to show when capability is locked.
   * If not provided, a default locked view will be used.
   */
  lockedComponent?: () => JSX.Element;
  /**
   * Descriptive message explaining what unlocks this capability.
   * Used in UI tooltips and preview panels.
   */
  unlockMessage?: string;
  /**
   * System perspectives that can see this module.
   * If not specified, module is visible to all perspectives.
   * Architect-only modules should specify: visibleTo: ['architect']
   * 
   * This determines existence, not readiness. If a module is not visible
   * to the current perspective, it does not appear in the UI at all
   * (not locked, just nonexistent for that user's reality).
   */
  visibleTo?: SystemPerspective[];
};

/**
 * Legacy type for backward compatibility.
 * @deprecated Use ModuleDefinition with layer classification instead.
 */
export type LegacyModuleDefinition = {
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
    layer: "capability",
    // TODO: Add readiness gates when unlock logic is implemented
  },
  {
    slug: "agents",
    name: "Agents",
    description: "Manage deployed and available agents.",
    icon: Activity,
    component: AgentsPanel,
    layer: "capability",
    // TODO: Add readiness gates when unlock logic is implemented
  },
  {
    slug: "mesh",
    name: "Mesh Graph",
    description: "Visualize the neural mesh.",
    icon: Network,
    component: MeshPanel,
    layer: "capability",
    // TODO: Add readiness gates when unlock logic is implemented
  },
  {
    slug: "rho2",
    name: "Rho² Keyring",
    description: "Cryptographic keyring inspector.",
    icon: KeyRound,
    component: Rho2Panel,
    layer: "capability",
    visibleTo: ['architect'], // Architect-only module (requires YubiKey/Rho² verification)
    // TODO: Add readiness gates when unlock logic is implemented
  },
  {
    slug: "security",
    name: "Security",
    description: "System-wide security overview.",
    icon: Shield,
    component: SecurityPanel,
    layer: "capability",
    // TODO: Add readiness gates when unlock logic is implemented
  },
  {
    slug: "governance",
    name: "Governance",
    description: "Architect authentication, YubiKey management, and session control.",
    icon: Gavel,
    component: GovernancePanel,
    layer: "governance",
    // Governance layer is always accessible
  },
  {
    slug: "settings",
    name: "Settings",
    description: "Customize system behavior, UI themes, and organization settings.",
    icon: Settings,
    component: Placeholder("Settings Panel"),
    layer: "governance",
    // Governance layer is always accessible
  },
  // Arc Panels - Read-only status displays, visible to Operator and Architect
  // Using "orientation" layer to ensure always visible and unlocked (no readiness gates)
  {
    slug: "arc-theta",
    name: "Arc Theta",
    description: "Arc Theta operational status and health monitoring.",
    icon: Circle,
    component: ArcThetaPanel,
    layer: "orientation",
    // Always visible, informational only - no unlock gating required
  },
  {
    slug: "arc-sigma",
    name: "Arc Sigma",
    description: "Arc Sigma operational status and health monitoring.",
    icon: Hexagon,
    component: ArcSigmaPanel,
    layer: "orientation",
    // Always visible, informational only - no unlock gating required
  },
  {
    slug: "arc-omega",
    name: "Arc Omega",
    description: "Arc Omega operational status and health monitoring.",
    icon: Octagon,
    component: ArcOmegaPanel,
    layer: "orientation",
    // Always visible, informational only - no unlock gating required
  },
  {
    slug: "arc-lambda",
    name: "Arc Lambda",
    description: "Arc Lambda operational status and health monitoring.",
    icon: Triangle,
    component: ArcLambdaPanel,
    layer: "orientation",
    // Always visible, informational only - no unlock gating required
  },
  {
    slug: "arc-chi",
    name: "Arc Chi",
    description: "Arc Chi operational status and health monitoring.",
    icon: X,
    component: ArcChiPanel,
    layer: "orientation",
    // Always visible, informational only - no unlock gating required
  },
  {
    slug: "arc-rho2-lodge",
    name: "Rho² Lodge",
    description: "Rho² security chamber operational status and health monitoring.",
    icon: KeyRound,
    component: ArcRho2LodgePanel,
    layer: "orientation",
    // Always visible, informational only - no unlock gating required
  },
];


