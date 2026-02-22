# SAGE Enterprise UI — Arc Console System Diagnostic Report

**Generated:** 2026-01-28  
**Scope:** Read-only inspection of sidebar-driven Arc console panels  
**Status:** Inspection-only — no code modifications

---

## Executive Summary

The SAGE Enterprise UI console system contains **14 Arc consoles** listed in the sidebar, all classified under the "orientation" layer (always visible, informational only). All Arc panels use a **shared telemetry intake mechanism** (`useArcTelemetry`) that filters signals from a common polling source (`useSageSignal` → `/api/sage/signals`).

**Key Findings:**
- **5 Arcs** have full status-driven UI (Theta, Sigma, Omega, Lambda, Rho² Lodge)
- **1 Arc** has enhanced status UI with custom signal rendering (Chi)
- **8 Arcs** have minimal placeholder shells (Xi, Mu, Nu, Omicron, Zeta, Iota, Epsilon, Delta)
- **All 14 Arcs** subscribe to shared telemetry intake and can render signals when received
- **All panels** are passive observers — no mutations, no commands, no business logic

---

## 1. Arc Console Inventory

All Arcs appear in the sidebar via `lib/console/moduleRegistry.tsx`:

1. **Arc Theta** (`arc-theta`)
2. **Arc Sigma** (`arc-sigma`)
3. **Arc Omega** (`arc-omega`)
4. **Arc Lambda** (`arc-lambda`)
5. **Arc Chi** (`arc-chi`)
6. **Arc Xi** (`arc-xi`)
7. **Arc Mu** (`arc-mu`)
8. **Arc Nu** (`arc-nu`)
9. **Arc Omicron** (`arc-omicron`)
10. **Arc Zeta** (`arc-zeta`)
11. **Arc Iota** (`arc-iota`)
12. **Arc Epsilon** (`arc-epsilon`)
13. **Arc Delta** (`arc-delta`)
14. **Rho² Lodge** (`arc-rho2-lodge`)

---

## 2. Detailed Arc Console Analysis

### 2.1 Arc Theta
**File:** `components/console/panels/ArcThetaPanel.tsx`

**Rendering Behavior:**
- ✅ **Status-driven UI** with structured data display
- ✅ **Status badges** (active/inactive/unknown with icons)
- ✅ **Health indicators** (healthy/degraded/unhealthy with color coding)
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- `useArcStatus("theta")` → fetches from `/api/arc/theta/status`
- `useArcTelemetry({ arc: "theta", slug: "arc-theta", namespace: "arc-theta" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears at bottom of status panel when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Theta)

---

### 2.2 Arc Sigma
**File:** `components/console/panels/ArcSigmaPanel.tsx`

**Rendering Behavior:**
- ✅ **Status-driven UI** with structured data display
- ✅ **Status badges** (active/inactive/unknown with icons)
- ✅ **Health indicators** (healthy/degraded/unhealthy with color coding)
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- `useArcStatus("sigma")` → fetches from `/api/arc/sigma/status`
- `useArcTelemetry({ arc: "sigma", slug: "arc-sigma", namespace: "arc-sigma" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears at bottom of status panel when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Sigma)

---

### 2.3 Arc Omega
**File:** `components/console/panels/ArcOmegaPanel.tsx`

**Rendering Behavior:**
- ✅ **Status-driven UI** with structured data display
- ✅ **Status badges** (active/inactive/unknown with icons)
- ✅ **Health indicators** (healthy/degraded/unhealthy with color coding)
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- `useArcStatus("omega")` → fetches from `/api/arc/omega/status`
- `useArcTelemetry({ arc: "omega", slug: "arc-omega", namespace: "arc-omega" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears at bottom of status panel when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Omega)

---

### 2.4 Arc Lambda
**File:** `components/console/panels/ArcLambdaPanel.tsx`

**Rendering Behavior:**
- ✅ **Status-driven UI** with structured data display
- ✅ **Status badges** (active/inactive/unknown with icons)
- ✅ **Health indicators** (healthy/degraded/unhealthy with color coding)
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- `useArcStatus("lambda")` → fetches from `/api/arc/lambda/status`
- `useArcTelemetry({ arc: "lambda", slug: "arc-lambda", namespace: "arc-lambda" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears at bottom of status panel when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Lambda)

---

### 2.5 Arc Chi ⭐
**File:** `components/console/panels/ArcChiPanel.tsx`

**Rendering Behavior:**
- ✅ **Enhanced status-driven UI** with extended observation sections
- ✅ **Status badges** (active/inactive/unknown with icons)
- ✅ **Health indicators** (healthy/degraded/unhealthy with color coding)
- ✅ **Kubernetes pod observation** (conditional section)
- ✅ **Network posture observation** (Cilium policy, conditional section)
- ✅ **Temporal signal section** (pod lifecycle timing, conditional)
- ✅ **Custom telemetry rendering** — heartbeat-specific display (not generic JSON dump)

**Data Sources:**
- `useArcStatus("chi")` → fetches from `/api/arc/chi/status`
- `useArcTelemetry({ arc: "chi", slug: "arc-chi", namespace: "arc-chi" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — **custom rendering** for heartbeat signals
- When `telemetry.signal?.state === "heartbeat"`, displays:
  - "Last seen" timestamp
  - Node identifier (from `metadata.node`)
- Falls back to basic status display if no heartbeat signal

**Current State:** **✅ ACTIVE** — Chi heartbeat signal is currently being emitted via `/api/sage/signals` endpoint (every 60s polling cadence)

**Special Notes:**
- Chi is the **only Arc with a real, active signal emitter** (heartbeat)
- Signal is marked `severity: "unavailable"` to prevent global aggregation interference
- Custom UI rendering (not generic `ArcTelemetryReadout`)

---

### 2.6 Arc Xi
**File:** `components/console/panels/ArcXiPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "xi", slug: "arc-xi", namespace: "arc-xi" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Xi)

---

### 2.7 Arc Mu
**File:** `components/console/panels/ArcMuPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "mu", slug: "arc-mu", namespace: "arc-mu" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Mu)

---

### 2.8 Arc Nu
**File:** `components/console/panels/ArcNuPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "nu", slug: "arc-nu", namespace: "arc-nu" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Nu)

---

### 2.9 Arc Omicron
**File:** `components/console/panels/ArcOmicronPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "omicron", slug: "arc-omicron", namespace: "arc-omicron" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Omicron)

---

### 2.10 Arc Zeta
**File:** `components/console/panels/ArcZetaPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "zeta", slug: "arc-zeta", namespace: "arc-zeta" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Zeta)

---

### 2.11 Arc Iota
**File:** `components/console/panels/ArcIotaPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "iota", slug: "arc-iota", namespace: "arc-iota" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Iota)

---

### 2.12 Arc Epsilon
**File:** `components/console/panels/ArcEpsilonPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "epsilon", slug: "arc-epsilon", namespace: "arc-epsilon" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Epsilon)

---

### 2.13 Arc Delta
**File:** `components/console/panels/ArcDeltaPanel.tsx`

**Rendering Behavior:**
- ✅ **Placeholder text** — "OBSERVATION MODE" message
- ✅ **Static content** — explanatory text about read-only nature
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- ❌ **No** `useArcStatus` hook (no status API subscription)
- ✅ `useArcTelemetry({ arc: "delta", slug: "arc-delta", namespace: "arc-delta" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears below placeholder text when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Delta)

---

### 2.14 Rho² Lodge
**File:** `components/console/panels/ArcRho2LodgePanel.tsx`

**Rendering Behavior:**
- ✅ **Status-driven UI** with structured data display
- ✅ **Status badges** (active/inactive/unknown with icons)
- ✅ **Health indicators** (healthy/degraded/unhealthy with color coding)
- ✅ **Telemetry-driven UI** via `ArcTelemetryReadout` component

**Data Sources:**
- `useArcStatus("rho2")` → fetches from `/api/arc/rho2/status`
- `useArcTelemetry({ arc: "rho2", slug: "arc-rho2-lodge", namespace: "rho2" })` → filters signals from shared intake

**Signal Rendering Capability:**
- ✅ **Yes** — renders via `ArcTelemetryReadout` component (JSON dump of signal object)
- Signal appears at bottom of status panel when present

**Current State:** **Telemetry-ready but silent** (no signals currently emitted for Rho² Lodge)

---

## 3. Categorization Summary

### 3.1 Fully Passive (No Listeners)
**None** — All Arc panels subscribe to at least one data source (telemetry intake).

### 3.2 Telemetry-Ready but Silent
**13 Arcs:**
- Theta, Sigma, Omega, Lambda (status + telemetry, no signals)
- Xi, Mu, Nu, Omicron, Zeta, Iota, Epsilon, Delta (telemetry only, no signals)
- Rho² Lodge (status + telemetry, no signals)

These panels are **wired and ready** to display signals but currently receive none.

### 3.3 Hardcoded / Static
**8 Arcs** (Xi, Mu, Nu, Omicron, Zeta, Iota, Epsilon, Delta):
- Display static placeholder text
- No status API subscription
- Only telemetry intake subscription
- Will render signals if received, but show placeholder otherwise

### 3.4 Active Signal Emitter
**1 Arc:**
- **Chi** — Currently emitting heartbeat signals via `/api/sage/signals` endpoint

---

## 4. Shared Telemetry Intake Architecture

### 4.1 Common Infrastructure
**All Arc consoles use a shared telemetry intake mechanism:**

1. **Source:** `lib/signals/useSageSignal.ts`
   - Polls `/api/sage/signals` endpoint every **60 seconds**
   - Returns `SignalEmitter[]` array
   - Fail-silent (returns empty array on error)

2. **Filtering:** `lib/signals/useArcTelemetry.ts`
   - Each Arc panel calls `useArcTelemetry(matcher)` with Arc-specific matcher
   - Matcher filters signals by:
     - `metadata.arc` (case-insensitive string match)
     - `metadata.arcSlug` (exact string match)
     - `metadata.namespace` (exact string match, if provided)
   - Returns latest matching signal or `{ status: "awaiting_signal", signal: null }`

3. **Rendering:** `components/console/panels/ArcTelemetryReadout.tsx`
   - Generic component that renders signal as JSON dump
   - Returns `null` if signal is `null`
   - Used by 13/14 Arc panels (Chi uses custom rendering)

### 4.2 Signal Matching Logic
Each Arc panel provides a matcher object:
```typescript
{
  arc: string;        // e.g., "chi", "theta"
  slug: string;       // e.g., "arc-chi", "arc-theta"
  namespace?: string; // e.g., "arc-chi", "arc-theta"
}
```

Signals are matched if **any** of these conditions are met:
- `signal.metadata.arc` matches `matcher.arc` (case-insensitive)
- `signal.metadata.arcSlug` matches `matcher.slug`
- `signal.metadata.namespace` matches `matcher.namespace` (if provided)

### 4.3 Current Signal Emission
**Active:** Only Chi heartbeat signal is currently emitted:
- **ID:** `"arc.chi.heartbeat"`
- **Source:** `"chi"`
- **State:** `"heartbeat"`
- **Severity:** `"unavailable"` (to prevent global aggregation)
- **Metadata:** `{ arc: "chi", node: "<node-identifier>" }`
- **Frequency:** Every 60 seconds (via polling)

---

## 5. Status API Architecture

### 5.1 Status-Driven Panels
**6 Arcs** subscribe to status API:
- Theta, Sigma, Omega, Lambda, Chi, Rho² Lodge

**Hook:** `lib/console/useArcStatus.ts`
- Fetches from `/api/arc/{arcName}/status`
- Uses `useTruthfulFetch` utility (explicit unavailable state, no mocks)
- Returns structured `ArcStatus` object with:
  - `status`, `health`, `version`, `lastSeen`, `message`
  - Extended fields: `namespace`, `mode`, `role`
  - Kubernetes pod observation: `pod.name`, `pod.status`, `pod.restartCount`, `pod.nodeName`, `pod.age`, `pod.startTime`
  - Network posture: `network.ciliumPolicyPresent`, `network.policyNames`, `network.defaultDeny`

### 5.2 Status-Independent Panels
**8 Arcs** do not subscribe to status API:
- Xi, Mu, Nu, Omicron, Zeta, Iota, Epsilon, Delta

These panels rely solely on telemetry intake for data.

---

## 6. Signal Rendering Capability Matrix

| Arc | Status API | Telemetry Intake | Signal Rendering | Current Signals |
|-----|------------|------------------|------------------|-----------------|
| Theta | ✅ | ✅ | ✅ (JSON dump) | ❌ None |
| Sigma | ✅ | ✅ | ✅ (JSON dump) | ❌ None |
| Omega | ✅ | ✅ | ✅ (JSON dump) | ❌ None |
| Lambda | ✅ | ✅ | ✅ (JSON dump) | ❌ None |
| Chi | ✅ | ✅ | ✅ (Custom heartbeat) | ✅ **ACTIVE** |
| Xi | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Mu | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Nu | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Omicron | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Zeta | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Iota | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Epsilon | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Delta | ❌ | ✅ | ✅ (JSON dump) | ❌ None |
| Rho² Lodge | ✅ | ✅ | ✅ (JSON dump) | ❌ None |

---

## 7. Key Observations

### 7.1 Architecture Strengths
- ✅ **Unified telemetry intake** — all Arcs use same mechanism
- ✅ **Passive observation** — no mutations, no commands, no business logic
- ✅ **Fail-silent design** — graceful degradation when services unavailable
- ✅ **Signal-ready** — all panels can render signals when received
- ✅ **Truthful fetch** — explicit unavailable states, no mock data

### 7.2 Current State
- ✅ **1 active signal emitter** (Chi heartbeat)
- ⚠️ **13 silent Arcs** (wired but no signals)
- ⚠️ **8 minimal shells** (placeholder UI, telemetry-ready)

### 7.3 Signal Emission Status
- **Active:** Chi (heartbeat, every 60s)
- **Inactive:** All other Arcs (no signals emitted)

### 7.4 Panel Maturity Levels
1. **Mature** (6 Arcs): Full status UI + telemetry intake
   - Theta, Sigma, Omega, Lambda, Chi, Rho² Lodge
2. **Minimal** (8 Arcs): Placeholder UI + telemetry intake
   - Xi, Mu, Nu, Omicron, Zeta, Iota, Epsilon, Delta

---

## 8. Conclusion

The SAGE Enterprise UI Arc console system is **architecturally sound** with a unified telemetry intake mechanism. All 14 Arc panels are **passive observers** capable of rendering signals when received. Currently, only **Arc Chi** has an active signal emitter (heartbeat), while the remaining 13 Arcs are **telemetry-ready but silent**.

The system demonstrates:
- ✅ Consistent shared infrastructure
- ✅ Passive observation patterns
- ✅ Signal rendering capability across all panels
- ✅ Graceful degradation when services unavailable

**Recommendation:** The system is ready for additional signal emitters. Any Arc can begin emitting signals via the `/api/sage/signals` endpoint, and the corresponding panel will automatically render them via the shared telemetry intake mechanism.

---

**End of Report**
