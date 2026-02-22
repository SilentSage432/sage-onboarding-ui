# SAGE Federation UI — Architectural Snapshot

**Generated:** 2026-02-19  
**Scope:** Structural and wiring-level inspection only

---

## 1. Panel Architecture

### 1.1 Fully Functional Panels

**Arc Theta Panel**
- File: `components/console/panels/ArcThetaPanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/arc/theta/status`) + telemetry signals
- Wiring: `useArcStatus("theta")` + `useArcTelemetry({ arc: "theta", slug: "arc-theta", namespace: "arc-theta" })`

**Arc Sigma Panel**
- File: `components/console/panels/ArcSigmaPanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/arc/sigma/status`) + telemetry signals
- Wiring: `useArcStatus("sigma")` + `useArcTelemetry({ arc: "sigma", slug: "arc-sigma", namespace: "arc-sigma" })`

**Arc Omega Panel**
- File: `components/console/panels/ArcOmegaPanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/arc/omega/status`) + telemetry signals
- Wiring: `useArcStatus("omega")` + `useArcTelemetry({ arc: "omega", slug: "arc-omega", namespace: "arc-omega" })`

**Arc Lambda Panel**
- File: `components/console/panels/ArcLambdaPanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/arc/lambda/status`) + telemetry signals
- Wiring: `useArcStatus("lambda")` + `useArcTelemetry({ arc: "lambda", slug: "arc-lambda", namespace: "arc-lambda" })`

**Arc Chi Panel**
- File: `components/console/panels/ArcChiPanel.tsx`
- Status: Fully functional with enhanced UI
- Data: Real API (`/api/arc/chi/status`) + telemetry signals
- Wiring: `useArcStatus("chi")` + `useArcTelemetry({ arc: "chi", slug: "arc-chi", namespace: "arc-chi" })`
- Custom rendering: Kubernetes pod status, network posture (Cilium), temporal signals

**Arc Rho² Lodge Panel**
- File: `components/console/panels/ArcRho2LodgePanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/arc/rho2-lodge/status`) + telemetry signals
- Wiring: `useArcStatus("rho2-lodge")` + `useArcTelemetry({ arc: "rho2-lodge", slug: "arc-rho2-lodge", namespace: "arc-rho2-lodge" })`

**Federation State Panel**
- File: `components/console/panels/FederationStatePanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/federation/state`)
- Wiring: `useFederationState()` from `lib/console/useFederationHealth.ts`

**Federation Health Matrix Panel**
- File: `components/console/panels/FederationHealthMatrixPanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/federation/health/matrix`)
- Wiring: `useFederationHealthMatrix()` from `lib/console/useFederationHealth.ts`

**Federation Health Core Panel**
- File: `components/console/panels/FederationHealthCorePanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/federation/health/core`)
- Wiring: `useFederationHealthCore()` from `lib/console/useFederationHealth.ts`

**Governance Panel**
- File: `components/console/panels/GovernancePanel.tsx`
- Status: Fully functional
- Data: Real API (`/api/auth/session`, `/api/auth/webauthn/*`, `/api/auth/logout`)
- Wiring: Direct fetch calls, WebAuthn browser API

**Agents Panel**
- File: `components/console/panels/AgentsPanel.tsx`
- Status: Partially wired
- Data: Mock data (hardcoded `mockAgents` array)
- Wiring: Local state only (`useState`)

**Agent Detail Panel**
- File: `components/console/panels/AgentDetailPanel.tsx`
- Status: Partially wired
- Data: Props from AgentsPanel (mock data)
- Wiring: Local state only

### 1.2 Placeholder Panels

**Arc Xi Panel**
- File: `components/console/panels/ArcXiPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "xi", slug: "arc-xi", namespace: "arc-xi" })`

**Arc Mu Panel**
- File: `components/console/panels/ArcMuPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "mu", slug: "arc-mu", namespace: "arc-mu" })`

**Arc Nu Panel**
- File: `components/console/panels/ArcNuPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "nu", slug: "arc-nu", namespace: "arc-nu" })`

**Arc Omicron Panel**
- File: `components/console/panels/ArcOmicronPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "omicron", slug: "arc-omicron", namespace: "arc-omicron" })`

**Arc Zeta Panel**
- File: `components/console/panels/ArcZetaPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "zeta", slug: "arc-zeta", namespace: "arc-zeta" })`

**Arc Iota Panel**
- File: `components/console/panels/ArcIotaPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "iota", slug: "arc-iota", namespace: "arc-iota" })`

**Arc Epsilon Panel**
- File: `components/console/panels/ArcEpsilonPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "epsilon", slug: "arc-epsilon", namespace: "arc-epsilon" })`

**Arc Delta Panel**
- File: `components/console/panels/ArcDeltaPanel.tsx`
- Status: Placeholder shell
- Data: Telemetry signals only (no status API)
- Wiring: `useArcTelemetry({ arc: "delta", slug: "arc-delta", namespace: "arc-delta" })`

**Mesh Panel**
- File: `components/console/panels/MeshPanel.tsx`
- Status: Placeholder shell
- Data: None (static canvas placeholder)
- Wiring: Local canvas ref only

**Security Panel**
- File: `components/console/panels/SecurityPanel.tsx`
- Status: Placeholder shell
- Data: None (static cards)
- Wiring: None

**Rho² Panel**
- File: `components/console/panels/Rho2Panel.tsx`
- Status: Placeholder shell
- Data: Mock data (hardcoded `mockKeyset`)
- Wiring: Local state only

**Modules Panel**
- File: `lib/console/moduleRegistry.tsx` (Placeholder component)
- Status: Placeholder shell
- Data: None
- Wiring: None

**Settings Panel**
- File: `lib/console/moduleRegistry.tsx` (Placeholder component)
- Status: Placeholder shell
- Data: None
- Wiring: None

**Dashboard Page**
- File: `app/(os)/console/dashboard/page.tsx`
- Status: Static welcome page
- Data: None
- Wiring: `observePanelVisit("dashboard")` only

---

## 2. Sidebar / Navigation State

### 2.1 Sidebar Component
- File: `app/(os)/console/components/Sidebar.tsx`
- Registry Source: `lib/console/moduleRegistry.tsx`
- Filtering: `isModuleVisibleToPerspective()` + `isModuleUnlocked()`

### 2.2 Arc Entries (All Wired to Panels)

**Orientation Layer (Always Visible)**
1. Arc Theta → `ArcThetaPanel` (wired)
2. Arc Sigma → `ArcSigmaPanel` (wired)
3. Arc Omega → `ArcOmegaPanel` (wired)
4. Arc Lambda → `ArcLambdaPanel` (wired)
5. Arc Chi → `ArcChiPanel` (wired)
6. Arc Xi → `ArcXiPanel` (wired, placeholder)
7. Arc Mu → `ArcMuPanel` (wired, placeholder)
8. Arc Nu → `ArcNuPanel` (wired, placeholder)
9. Arc Omicron → `ArcOmicronPanel` (wired, placeholder)
10. Arc Zeta → `ArcZetaPanel` (wired, placeholder)
11. Arc Iota → `ArcIotaPanel` (wired, placeholder)
12. Arc Epsilon → `ArcEpsilonPanel` (wired, placeholder)
13. Arc Delta → `ArcDeltaPanel` (wired, placeholder)
14. Rho² Lodge → `ArcRho2LodgePanel` (wired)
15. Health Matrix → `FederationHealthMatrixPanel` (wired)
16. Health Core → `FederationHealthCorePanel` (wired)
17. Fed State → `FederationStatePanel` (wired)

**Capability Layer (Gated)**
1. Modules → Placeholder component (stubbed)
2. Agents → `AgentsPanel` (wired, mock data)
3. Mesh Graph → `MeshPanel` (wired, placeholder)
4. Rho² Keyring → `Rho2Panel` (wired, mock data, architect-only)
5. Security → `SecurityPanel` (wired, placeholder)

**Governance Layer (Always Accessible)**
1. Governance → `GovernancePanel` (wired, fully functional)
2. Settings → Placeholder component (stubbed)

**Overview Entry**
- Overview → `/console/dashboard` (static page)

### 2.3 Panel Loading
- File: `app/(os)/console/components/PanelLoader.tsx`
- Route Handler: `app/(os)/console/[slug]/page.tsx`
- Logic: Finds module by slug, checks visibility/unlock, renders component or locked view

---

## 3. Event Wiring

### 3.1 NATS / Chi Spine
- Status: **No NATS or Chi spine event listeners found**
- Search Results: No matches for "NATS", "nats", "Chi spine", "chi.*spine"

### 3.2 API Endpoints (Subscriptions)

**Polling-Based Subscriptions**
- `lib/signals/useSageSignal.ts`
  - Endpoint: `/api/sage/signals`
  - Interval: 60 seconds
  - Used by: All Arc panels via `useArcTelemetry`

**Status API Subscriptions**
- `lib/console/useArcStatus.ts`
  - Pattern: `/api/arc/{arcName}/status`
  - Used by: Theta, Sigma, Omega, Lambda, Chi, Rho² Lodge panels
  - Implementation: `useTruthfulFetch` wrapper

**Federation API Subscriptions**
- `lib/console/useFederationHealth.ts`
  - Endpoints:
    - `/api/federation/health/matrix`
    - `/api/federation/health/core`
    - `/api/federation/state`
  - Used by: Federation panels
  - Implementation: `useTruthfulFetch` wrapper

**Architect Session API**
- `app/(os)/console/layout.tsx` (line 51)
  - Endpoint: `/api/architect/bootstrap`
  - Used for: Setting `systemPerspective` on mount

**WebAuthn API**
- `components/console/panels/GovernancePanel.tsx`
  - Endpoints:
    - `/api/auth/webauthn/register/options`
    - `/api/auth/webauthn/register/verify`
    - `/api/auth/webauthn/authenticate/options`
    - `/api/auth/webauthn/authenticate/verify`
    - `/api/auth/session`
    - `/api/auth/logout`

### 3.3 Local State Only

**Agents Panel**
- File: `components/console/panels/AgentsPanel.tsx`
- State: `useState` for query filter, selected agent
- Data Source: Hardcoded `mockAgents` array

**Mesh Panel**
- File: `components/console/panels/MeshPanel.tsx`
- State: `useRef` for canvas element
- Data Source: None (static placeholder)

**Rho² Panel**
- File: `components/console/panels/Rho2Panel.tsx`
- State: None (static mock data)
- Data Source: Hardcoded `mockKeyset` object

**Security Panel**
- File: `components/console/panels/SecurityPanel.tsx`
- State: None
- Data Source: None (static cards)

**Dashboard Page**
- File: `app/(os)/console/dashboard/page.tsx`
- State: `useState` for loading flag
- Data Source: None

### 3.4 HADRA Event Bus

**Event Bus Implementation**
- File: `lib/hadra/hadraEventBus.ts`
- Events: `insight`, `consoleMessage`
- Subscribers:
  - `lib/console/useObservationBridge.ts` (records observations)
  - `components/hadra/HadraConsoleFeed.tsx` (displays messages)
  - `components/hadra/HadraConsoleInput.tsx` (emits messages)
  - `components/hadra/hadraMockEngine.ts` (emits insights)

**Observation Bridge**
- File: `lib/console/useObservationBridge.ts`
- Subscribes to: `hadraBus.on("insight")`, `hadraBus.on("consoleMessage")`
- Action: Records events into readiness store (passive observation only)

---

## 4. Signal & Status Layer

### 4.1 Arc Health/Status Determination

**Status API Hook**
- File: `lib/console/useArcStatus.ts`
- Endpoint Pattern: `/api/arc/{arcName}/status`
- Returns: `ArcStatus` type with `status`, `health`, `version`, `lastSeen`, extended fields
- Implementation: `useTruthfulFetch` (explicit unavailable state on backend disconnect)

**Status Values**
- `status`: `"active" | "inactive" | "unknown"`
- `health`: `"healthy" | "degraded" | "unhealthy"`

### 4.2 Color/State Mapping Logic

**Arc Panels (Theta, Sigma, Omega, Lambda, Rho² Lodge)**
- Location: Inline in each panel component
- Pattern:
  - `status === "active"` → green (`text-green-400`, `CheckCircle2` icon)
  - `status === "inactive"` → red (`text-red-400`, `XCircle` icon)
  - `status === "unknown"` → gray (`text-gray-400`, `Circle` icon)
  - `health === "healthy"` → green (`text-green-400`)
  - `health === "degraded"` → yellow (`text-yellow-400`)
  - `health === "unhealthy"` → red (`text-red-400`)

**Arc Chi Panel**
- File: `components/console/panels/ArcChiPanel.tsx` (lines 70-77)
- Custom mapping: `getPodStatusColor()` function
  - `"running" | "ready"` → green
  - `"pending" | "containercreating"` → yellow
  - `"failed" | "error" | "crashloopbackoff"` → red
  - Default → gray

**Federation State Panel**
- File: `components/console/panels/FederationStatePanel.tsx` (lines 64-96)
- Mapping:
  - `state === "active" | "ready"` → green
  - `state === "degraded" | "partial"` → yellow
  - `state === "inactive" | "error"` → red
  - Default → gray
- Node status: `getNodeStatusColor()` function (same pattern)

### 4.3 Status Source (Hardcoded vs Dynamic)

**Dynamic Status (API-Driven)**
- Theta, Sigma, Omega, Lambda, Chi, Rho² Lodge: `/api/arc/{name}/status`
- Federation panels: `/api/federation/*`
- Status: Determined by backend response

**Hardcoded Status**
- None (all status-driven panels use API)

**Mock Data (No Status API)**
- Agents Panel: Hardcoded `mockAgents` array with `status: "ready" | "active" | "idle"`
- Rho² Panel: Hardcoded `mockKeyset` object

**Static Placeholders**
- Xi, Mu, Nu, Omicron, Zeta, Iota, Epsilon, Delta: No status API, telemetry-only

### 4.4 Signal Aggregation

**Signal Source**
- File: `app/api/sage/signals/route.ts`
- Current Emitter: Arc Chi heartbeat only
- Signal Type: `SignalEmitter` with `id`, `source`, `state`, `severity`, `timestamp`, `metadata`

**Signal Intake**
- File: `lib/signals/useSageSignal.ts`
- Polling: 60-second interval
- Endpoint: `/api/sage/signals`
- Returns: `SignalEmitter[]` array

**Signal Filtering**
- File: `lib/signals/useArcTelemetry.ts`
- Matcher: `{ arc: string, slug: string, namespace?: string }`
- Logic: Matches on `metadata.arc`, `metadata.arcSlug`, or `metadata.namespace`
- Returns: Latest matching signal or `{ status: "awaiting_signal", signal: null }`

**Signal Rendering**
- File: `components/console/panels/ArcTelemetryReadout.tsx`
- Usage: 13/14 Arc panels (Chi uses custom rendering)
- Output: JSON dump of signal object

---

## 5. Console / Terminal Layer

### 5.1 Unified Terminal Panel

**Terminal Component**
- File: `app/(os)/console/components/Terminal.tsx`
- Status: Static placeholder
- Content: "SAGE Terminal Online_" (hardcoded text)
- Wiring: None

### 5.2 HADRA Console (Separate Terminal Interface)

**HADRA Console Component**
- File: `components/hadra/HadraConsole.tsx`
- Status: Fully functional
- Components:
  - `HadraConsoleFeed.tsx` (message display)
  - `HadraConsoleInput.tsx` (command input)
- Event Bus: `hadraBus` (`lib/hadra/hadraEventBus.ts`)
- Data Source: Mock engine (`components/hadra/hadraMockEngine.ts`)

**HADRA Console Feed**
- File: `components/hadra/HadraConsoleFeed.tsx`
- Subscribes to: `hadraBus.on("insight")`, `hadraBus.on("consoleMessage")`
- State: Local `useState` for messages array
- Data Source: Event bus (not live logs)

**HADRA Console Input**
- File: `components/hadra/HadraConsoleInput.tsx`
- Emits: `hadraBus.emit("consoleMessage", { role: "operator", content, ts })`
- Features: Command history, Enter to send

### 5.3 Live Log Reading

**Status: No live log reading found**
- Terminal component is static
- HADRA console reads from event bus (mock engine), not live logs
- No WebSocket/SSE connections for log streaming found

**Init Screen Log Stream**
- File: `app/(init)/init-screen/components/LogStream.tsx`
- Status: Static log display (receives logs array as prop)
- Usage: Boot sequence animation only
- Not part of console terminal layer

---

## 6. ADRAE Integration

### 6.1 Visual Integration

**Status: No visual integration found**

### 6.2 ADRAE References

**Comment Reference Only**
- File: `app/api/sage/signals/route.ts` (line 5)
- Text: "Signals are aggregated by SAGE from various sources (including ADRAE indirectly)."
- Type: Comment only, no implementation

### 6.3 Data Sources

**No ADRAE-specific endpoints found**
**No ADRAE rhythm/state/telemetry hooks found**
**No ADRAE UI components found**

**Confirmation: ADRAE integration is absent**

---

## 7. Unused or Dead UI Code

### 7.1 Scaffolded but Not Mounted

**Terminal Component**
- File: `app/(os)/console/components/Terminal.tsx`
- Status: Exists but not mounted in console layout
- Usage: Not referenced in `app/(os)/console/layout.tsx`

**System HadraConsole**
- File: `components/system/HadraConsole.tsx`
- Status: Exists, separate from `components/hadra/HadraConsole.tsx`
- Usage: Not verified if mounted

**HADRA Components (Multiple)**
- Files:
  - `components/hadra/HADRA.tsx`
  - `components/hadra/HADRAButton.tsx`
  - `components/hadra/HADRADiagnostics.tsx`
  - `components/hadra/HADRAIntro.tsx`
- Status: Exists, usage not verified in console layout
- Note: `HadraConsole.tsx` and `HadraPanel.tsx` are used, but these may be legacy

**Terminal Route**
- File: `app/terminal/hadra/page.tsx`
- Status: Separate route, not part of console
- Components: `TerminalFrame.tsx`, `ChatStream.tsx`, `InsightPanel.tsx`, `ModuleSidebar.tsx`

### 7.2 State Hooks Never Consumed

**No unused hooks identified**
- All hooks in panel files are consumed by their respective components
- `useArcStatus`, `useArcTelemetry`, `useFederationHealth*` hooks are all used

### 7.3 Placeholder Components

**Modules Panel**
- Registry Entry: `lib/console/moduleRegistry.tsx` (line 113-120)
- Component: `Placeholder("Modules Panel")`
- Status: Registered but not functional

**Settings Panel**
- Registry Entry: `lib/console/moduleRegistry.tsx` (line 168-175)
- Component: `Placeholder("Settings Panel")`
- Status: Registered but not functional

### 7.4 Mock Data Sources

**Agents Panel Mock Data**
- File: `components/console/panels/AgentsPanel.tsx` (lines 8-33)
- Array: `mockAgents` (hardcoded)
- Status: Used, but no real API integration

**Rho² Panel Mock Data**
- File: `components/console/panels/Rho2Panel.tsx` (lines 6-12)
- Object: `mockKeyset` (hardcoded)
- Status: Used, but no real API integration

**HADRA Mock Engine**
- File: `components/hadra/hadraMockEngine.ts`
- Status: Active (used by HADRA console)
- Purpose: Generates mock insights and responses

**HADRA Mock Events**
- File: `components/hadra/useMockEvents.ts`
- Status: Active (used in console layout)
- Purpose: Generates mock HadraEvent array

**HADRA Mock Insights**
- File: `components/hadra/useMockInsights.ts`
- Status: Active (used in console layout)
- Purpose: Generates mock HadraInsight array

---

## Summary Statistics

**Total Panels:** 25
- Fully Functional: 10
- Partially Wired: 3
- Placeholder Shells: 12

**Arc Panels:** 14
- Fully Functional: 6 (Theta, Sigma, Omega, Lambda, Chi, Rho² Lodge)
- Placeholder Shells: 8 (Xi, Mu, Nu, Omicron, Zeta, Iota, Epsilon, Delta)

**Federation Panels:** 3
- All Fully Functional

**Capability Panels:** 5
- Fully Functional: 1 (Governance)
- Partially Wired: 2 (Agents, Rho²)
- Placeholder Shells: 2 (Mesh, Security)

**API Endpoints Used:** 12
- Arc Status: 6 (`/api/arc/{name}/status`)
- Federation: 3 (`/api/federation/*`)
- Auth: 3 (`/api/auth/*`, `/api/architect/bootstrap`)

**Event Subscriptions:** 2
- HADRA Event Bus: `insight`, `consoleMessage`
- Signal Polling: `/api/sage/signals` (60s interval)
