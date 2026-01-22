# Progressive Revelation Architecture Proposal
## SAGE Onboarding UI Restructuring Analysis

**Generated:** 2025-01-27  
**Purpose:** Architectural analysis and restructuring proposal for progressive capability revelation based on time and behavior-based gating.

---

## 1. CURRENT STRUCTURE ANALYSIS

### 1.1 Route Hierarchy

**Current Route Groups:**
- `/wizard/` - Linear onboarding wizard (7 steps, strictly sequential)
- `/(os)/console/` - Post-onboarding console interface
- `/(init)/init-screen/` - Boot sequence visualization
- `/terminal/hadra/` - HADRA terminal interface

**Current Flow:**
1. Wizard collects configuration (organization, security, agents)
2. Boot sequence visualizes initialization
3. Console becomes available with all registered modules visible

### 1.2 Layout Hierarchy

**Global Layouts:**
- `app/layout.tsx` - Root layout (all routes)
- `app/wizard/layout.tsx` - Wizard-specific layout (neural mesh background)
- `app/(os)/console/layout.tsx` - Console layout (Sidebar, TopBar, HADRA orb, SystemStatusStrip)

**Page-Scoped Components:**
- Wizard steps are self-contained within `WizardShell`
- Console panels are dynamically loaded via `[slug]` route
- No global capability visibility layer exists

### 1.3 State Flow

**Current State Management:**
- `useWizardStore` - Wizard navigation (step index, flow type)
- `useOnboardingDataStore` - Onboarding data (priorities, agents)
- React Hook Form context - Form data during wizard session
- localStorage - Agent/module persistence (limited)

**State Gaps:**
- No persistent readiness/readiness tracking
- No time-based state
- No behavior-based state
- No capability unlock state
- No governance/consent state persistence

### 1.4 Capability Organization

**Current Capability Registry:**
- `lib/console/moduleRegistry.tsx` - Static array of module definitions
- All modules visible immediately after onboarding
- Sidebar renders all registered modules unconditionally
- No gating logic exists

**Module Structure:**
```typescript
{
  slug: string;
  name: string;
  description: string;
  icon: any;
  component: () => JSX.Element;
}
```

**Missing Fields:**
- Readiness requirements
- Unlock conditions
- Time gates
- Behavior gates
- Locked state representation

---

## 2. PROPOSED HIGH-LEVEL UI STRUCTURE

### 2.1 Four-Layer Architecture

The UI should be restructured into four distinct layers that coexist rather than replace each other:

#### **Layer 1: Orientation (Always Visible)**
- **Purpose:** Contextual information, system status, time awareness
- **Location:** Global layout elements (TopBar, SystemStatusStrip, ambient indicators)
- **Visibility:** Always present, regardless of capability access
- **Content:**
  - System time/date
  - Readiness indicators (what's being observed, what's being learned)
  - Time-since-activation metrics
  - Orientation messages ("SAGE is observing...", "Day 3 of operation")
- **Interaction:** Informational only, no capability access

#### **Layer 2: Capability Horizon (Visible but Locked)**
- **Purpose:** Show future capabilities without granting access
- **Location:** Sidebar, capability registry, dedicated "horizon" views
- **Visibility:** Always visible, but clearly marked as unavailable
- **Content:**
  - Locked capability icons/names
  - Unlock conditions ("Available after 7 days", "Requires 10 automation events")
  - Time remaining until unlock
  - Why it's locked (transparent reasoning)
- **Interaction:** View-only, no access until conditions met

#### **Layer 3: Governance / Consent Layer**
- **Purpose:** Explicit consent and permission management
- **Location:** Settings panel, dedicated governance routes, consent modals
- **Visibility:** Accessible but not prominent (available when needed)
- **Content:**
  - Active consents (automation, external integrations, data sharing)
  - Consent history (when granted, what changed)
  - Permission matrix (what each capability requires)
  - Revocation interfaces
- **Interaction:** Active management, but not a blocker for basic operation

#### **Layer 4: Emergent Access (Conditionally Visible)**
- **Purpose:** Capabilities that become available when readiness is demonstrated
- **Location:** Sidebar (unlocked items), dynamic panel routes, capability-specific views
- **Visibility:** Only visible when unlocked
- **Content:**
  - Unlocked capabilities (finance, automation, search, federation, etc.)
  - Active capability panels
  - Capability-specific workflows
- **Interaction:** Full access to unlocked capabilities

### 2.2 Structural Zones

#### **Zone A: Global Orientation Bar**
- **Location:** Top of screen (extends TopBar)
- **Components:**
  - Time/date display
  - Readiness status ("Observing", "Learning", "Ready for X")
  - Time-since metrics
  - Orientation messages
- **Always Visible:** Yes
- **Purpose:** Temporal context and system state awareness

#### **Zone B: Capability Navigation (Sidebar)**
- **Location:** Left sidebar (existing Sidebar component)
- **Components:**
  - Unlocked capabilities (active, clickable)
  - Locked capabilities (visible, disabled, with unlock info)
  - Capability groups (orientation, governance, capabilities)
- **Always Visible:** Yes
- **Purpose:** Navigation and capability discovery

#### **Zone C: Main Content Area**
- **Location:** Center panel (existing DesktopPanel)
- **Components:**
  - Active capability panels (when unlocked)
  - Locked capability previews (when locked)
  - Orientation content (when no capability selected)
- **Always Visible:** Yes
- **Purpose:** Primary interaction surface

#### **Zone D: Governance Access**
- **Location:** Settings panel, dedicated route, or modal
- **Components:**
  - Consent management
  - Permission overview
  - Governance history
- **Always Visible:** No (accessible via navigation)
- **Purpose:** Explicit control and transparency

---

## 3. REORGANIZATION PROPOSALS

### 3.1 Wizard → Orientation Transition

**Current State:**
- Wizard is a linear flow that ends at console
- No connection between wizard data and capability gating
- Wizard data stored in localStorage (temporary)

**Proposed Change:**
- Wizard becomes "Initial Orientation" phase
- Wizard data seeds initial readiness state
- Post-wizard state transitions to "Observation Phase"
- Console becomes available immediately, but with limited capabilities

**Implementation:**
- Wizard completion sets initial state:
  - `orientationComplete: true`
  - `observationStartTime: Date.now()`
  - `initialConfiguration: { org, security, agents }`
- Console layout checks readiness state before rendering capabilities
- First console view shows orientation content, not full capabilities

### 3.2 Console Layout Restructuring

**Current State:**
```typescript
// Current: All modules always visible
const nav = [
  { name: "Overview", ... },
  ...moduleRegistry.map((mod) => ({ ... }))
];
```

**Proposed State:**
```typescript
// Proposed: Modules filtered by readiness
const nav = [
  { name: "Overview", ... },
  ...getUnlockedModules(readinessState),
  ...getLockedModules(readinessState), // Visible but disabled
];
```

**Changes:**
1. Split `moduleRegistry` into:
   - `orientationModules` - Always visible (Overview, Orientation)
   - `capabilityModules` - Gated by readiness (Finance, Automation, Search, etc.)
   - `governanceModules` - Always accessible (Settings, Governance)
2. Add readiness checking to module registry
3. Render locked modules with visual distinction (opacity, lock icon, tooltip)

### 3.3 Module Registry Extension

**Current Structure:**
```typescript
type ModuleDefinition = {
  slug: string;
  name: string;
  description: string;
  icon: any;
  component: () => JSX.Element;
};
```

**Proposed Structure:**
```typescript
type ReadinessGate = {
  type: 'time' | 'behavior' | 'consent' | 'observation';
  condition: string; // e.g., "7 days", "10 automation events", "rho2-verified"
  description: string; // Why this gate exists
};

type ModuleDefinition = {
  slug: string;
  name: string;
  description: string;
  icon: any;
  component: () => JSX.Element;
  layer: 'orientation' | 'capability' | 'governance';
  readinessGates?: ReadinessGate[];
  lockedComponent?: () => JSX.Element; // Preview when locked
  unlockMessage?: string; // What unlocks this
};
```

**Example:**
```typescript
{
  slug: "finance",
  name: "Finance",
  description: "Financial operations and accounting automation.",
  icon: DollarSign,
  component: FinancePanel,
  layer: "capability",
  readinessGates: [
    {
      type: "time",
      condition: "7 days",
      description: "Finance capabilities require 7 days of system observation to ensure data integrity."
    },
    {
      type: "behavior",
      condition: "10-automation-events",
      description: "Demonstrate automation readiness through 10 successful automation events."
    }
  ],
  lockedComponent: FinancePreview,
  unlockMessage: "Available after 7 days and 10 automation events"
}
```

### 3.4 Readiness State Management

**New Store Structure:**
```typescript
// app/(os)/console/store/useReadinessStore.ts
type ReadinessState = {
  // Time-based
  activationTime: number; // When onboarding completed
  daysSinceActivation: number;
  
  // Behavior-based
  automationEventCount: number;
  observationEvents: Event[];
  learningMilestones: string[];
  
  // Consent-based
  activeConsents: Consent[];
  consentHistory: ConsentEvent[];
  
  // Capability unlock state
  unlockedCapabilities: string[];
  lockedCapabilities: CapabilityLock[];
  
  // Observation state
  observationPhase: 'initial' | 'learning' | 'ready';
  observedPatterns: Pattern[];
};
```

**Integration Points:**
- Console layout reads readiness state
- Module registry filters by readiness
- Sidebar renders based on readiness
- Panels check readiness before rendering

### 3.5 Locked State Representation

**Visual Design:**
- Locked capabilities in sidebar:
  - Reduced opacity (40-50%)
  - Lock icon overlay
  - Disabled cursor
  - Tooltip on hover showing unlock conditions
- Locked capability panels:
  - Preview component instead of full panel
  - Clear "Locked" indicator
  - Unlock conditions displayed
  - Time remaining (if time-gated)
  - Progress toward unlock (if behavior-gated)

**Component Structure:**
```typescript
// components/console/LockedCapability.tsx
<LockedCapability
  capability={module}
  readinessState={readinessState}
  onPreview={() => showPreview()}
/>
```

**Preview Panels:**
- Show what the capability will do
- Explain why it's locked
- Show progress toward unlock
- No functional access

---

## 4. RECOMMENDATIONS

### 4.1 Global vs Conditional Visibility

**Always Global:**
- Orientation layer (time, status, readiness indicators)
- Overview/Dashboard (even if limited)
- Settings/Governance access
- System status indicators

**Conditionally Visible:**
- Capability panels (only when unlocked)
- Capability-specific navigation items (only when unlocked)
- Advanced features within unlocked capabilities

**Visible but Locked:**
- Future capabilities in sidebar (with lock indicators)
- Capability previews in main content area
- "Coming soon" or "Available in X days" messaging

### 4.2 Future Domain Placement

**Finance Domain:**
- **Location:** `app/(os)/console/finance/` (new route)
- **Registry:** Add to `moduleRegistry` with `layer: 'capability'`
- **Gates:** Time (7 days) + Behavior (10 automation events)
- **Locked State:** Preview panel showing financial capabilities, unlock conditions

**Automation Domain:**
- **Location:** `app/(os)/console/automation/` (new route)
- **Registry:** Add to `moduleRegistry` with `layer: 'capability'`
- **Gates:** Time (3 days) + Behavior (5 successful automations)
- **Locked State:** Preview showing automation potential, progress tracker

**Search Domain:**
- **Location:** `app/(os)/console/search/` (new route)
- **Registry:** Add to `moduleRegistry` with `layer: 'capability'`
- **Gates:** Time (14 days) + Behavior (sufficient data indexed)
- **Locked State:** Preview showing search capabilities, indexing progress

**Federation Domain:**
- **Location:** `app/(os)/console/federation/` (new route)
- **Registry:** Add to `moduleRegistry` with `layer: 'capability'`
- **Gates:** Time (30 days) + Consent (federation consent) + Behavior (stable operation)
- **Locked State:** Preview showing federation benefits, consent requirements

**Human-to-Human Communication:**
- **Location:** `app/(os)/console/communication/` (new route)
- **Registry:** Add to `moduleRegistry` with `layer: 'capability'`
- **Gates:** Time (21 days) + Consent (communication consent) + Behavior (trust established)
- **Locked State:** Preview showing communication features, trust indicators

### 4.3 Avoiding Linear Stepper UI

**Anti-Patterns to Avoid:**
- ❌ Step-by-step progress bars for capability unlocking
- ❌ "Complete X to unlock Y" gamification
- ❌ Linear unlock sequences
- ❌ Achievement badges or completion percentages

**Preferred Patterns:**
- ✅ Time as natural gate (no user action required, just waiting)
- ✅ Behavior as organic gate (system observes, unlocks when ready)
- ✅ Transparent reasoning (explain why locked, not just that it is)
- ✅ Parallel unlock paths (multiple capabilities can unlock independently)
- ✅ Negative space (locked capabilities visible but inactive)
- ✅ Patience as feature (some capabilities may never unlock if conditions never met)

**UI Patterns:**
- **Time-based:** Show countdown or elapsed time, not progress bar
- **Behavior-based:** Show observation status, not completion checklist
- **Consent-based:** Show active consents, not consent steps
- **Mixed gates:** Show all requirements, not sequential steps

### 4.4 Communication of Unavailability

**Why Something is Unavailable:**
- Always show the reason, not just that it's locked
- Use clear, non-technical language
- Reference time, behavior, or consent requirements
- Show progress when applicable (time remaining, events observed)

**Examples:**
- ❌ "Finance is locked"
- ✅ "Finance capabilities require 7 days of system observation to ensure data integrity. Available in 3 days."
- ❌ "Automation unavailable"
- ✅ "Automation requires 10 successful automation events. Currently observed: 3 events."
- ❌ "Search coming soon"
- ✅ "Search becomes available after 14 days and sufficient data indexing. System is currently indexing your data."

**Visual Communication:**
- Lock icon + tooltip with reason
- Preview panel with unlock conditions
- Status indicators in sidebar
- Time/behavior counters where applicable

### 4.5 Structural Separation

**Orientation Layer:**
- **Files:** `app/(os)/console/orientation/` (new)
- **Components:** `components/console/orientation/`
- **Purpose:** Time awareness, system status, readiness indicators
- **Always visible:** Yes

**Capability Layer:**
- **Files:** `app/(os)/console/[capability]/` (existing pattern)
- **Components:** `components/console/panels/` (existing)
- **Purpose:** Domain-specific capabilities
- **Conditionally visible:** Based on readiness

**Governance Layer:**
- **Files:** `app/(os)/console/governance/` (new)
- **Components:** `components/console/governance/`
- **Purpose:** Consent management, permissions
- **Always accessible:** Yes (via Settings or dedicated route)

**Horizon Layer:**
- **Files:** Integrated into Sidebar and module registry
- **Components:** `components/console/LockedCapability.tsx` (new)
- **Purpose:** Show locked capabilities
- **Always visible:** Yes (as locked items)

---

## 5. IMPLEMENTATION CONSIDERATIONS

### 5.1 Backward Compatibility

**Preserve Existing:**
- Wizard flow remains unchanged (structural analysis only)
- Console layout structure preserved
- Module registry pattern maintained
- Route structure extended, not replaced

**Additions Only:**
- New readiness store
- Extended module definitions
- Locked state components
- Readiness checking utilities

### 5.2 State Persistence

**Current:** localStorage (temporary, client-side only)

**Future Needs (Not Implemented):**
- Backend persistence of readiness state
- Time-based state calculation (server-side or client-side with sync)
- Behavior event tracking
- Consent history

**For Now:**
- Readiness state in Zustand store (session-only)
- Time-based gates calculated from `activationTime`
- Behavior gates simulated or read from localStorage
- No backend integration required for structural changes

### 5.3 Component Reuse

**Existing Components:**
- `Sidebar.tsx` - Extend to show locked capabilities
- `moduleRegistry.tsx` - Extend with readiness fields
- `PanelLoader.tsx` - Extend to handle locked states
- Console panels - Add locked preview variants

**New Components:**
- `LockedCapability.tsx` - Locked state representation
- `ReadinessIndicator.tsx` - Time/behavior status
- `CapabilityPreview.tsx` - Preview for locked capabilities
- `OrientationBar.tsx` - Global orientation layer

### 5.4 Testing Readiness States

**Development:**
- Mock readiness states for testing
- Time acceleration for time-based gates
- Event injection for behavior-based gates
- Consent toggles for consent-based gates

**Production:**
- Real-time calculation from activation time
- Real behavior event tracking
- Real consent management
- No shortcuts or overrides

---

## 6. SUMMARY

### Current State
- Linear wizard → console transition
- All capabilities visible immediately after onboarding
- No time-based or behavior-based gating
- No locked state representation
- No orientation layer
- No governance layer

### Proposed State
- Wizard → orientation → observation → capability access
- Four-layer architecture (orientation, horizon, governance, access)
- Time-based and behavior-based gating
- Locked capabilities visible but inactive
- Clear communication of why capabilities are unavailable
- Patience and restraint as intentional features

### Key Changes
1. **Module Registry:** Extend with readiness gates and layer classification
2. **Console Layout:** Filter modules by readiness, show locked states
3. **Sidebar:** Render locked capabilities with visual distinction
4. **State Management:** Add readiness store for time/behavior/consent tracking
5. **Components:** Add locked state and preview components
6. **Routes:** Organize by layer (orientation, capability, governance)

### Philosophy Alignment
- Time as first-class constraint ✓
- Patience and restraint as features ✓
- Silence and locked states as valid UI outcomes ✓
- Some users may never see certain capabilities ✓
- Transparent reasoning for unavailability ✓
- No linear stepper UI ✓
- No gamification or achievement systems ✓

---

**Document Status:** Architectural Proposal  
**Next Steps:** Structural implementation (no feature logic, no unlock implementation)  
**Maintained By:** Architecture Team
