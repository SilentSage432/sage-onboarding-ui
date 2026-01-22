# SAGE Onboarding UI - Comprehensive Architecture Documentation

**Generated:** 2025-01-27  
**Purpose:** Systems analyst documentation mapping the complete Onboarding UI codebase structure, flows, capabilities, and extension points.

---

## 1. OVERALL PURPOSE

### Conceptual Design
The SAGE Onboarding UI is a **multi-stage enterprise onboarding wizard** designed to configure a sovereign operating system environment for organizations. It functions as a **progressive configuration interface** that collects organizational context, security posture, operational priorities, and agent selections to generate a deployment blueprint.

### User/Operator Assumptions
- **Enterprise-first**: The UI assumes enterprise/business users (no personal account type selection exists in the current flow)
- **Trusted operator**: No explicit authentication gates exist—the UI assumes the user has legitimate access
- **Progressive disclosure**: Users are guided through configuration rather than presented with all options at once
- **Domain expertise**: The UI assumes users understand their organization's structure, industry, and operational needs
- **Consent model**: Security posture selection implies consent for automation and external integrations

### System Lifecycle Stage
This UI represents the **initialization phase** of the SAGE ecosystem lifecycle:
1. **Pre-activation**: Organization profile and security configuration
2. **Activation**: Rho² cryptographic identity verification (mandatory gate)
3. **Configuration**: Agent selection and operational priority setting
4. **Deployment**: Environment provisioning and boot sequence
5. **Post-activation**: Transition to the SAGE OS Console for ongoing operations

The onboarding flow bridges the gap between **zero-state** (no SAGE environment) and **operational-state** (fully provisioned SAGE OS Console).

---

## 2. STRUCTURE & FLOW

### Entry Points

**Primary Entry:**
- Route: `/wizard` → `app/wizard/page.tsx`
- Auto-initializes enterprise flow via `beginEnterpriseFlow()` hook
- Wrapped in `EnterpriseFormWrapper` providing React Hook Form context with Zod validation

**Alternative Entry (Post-Wizard):**
- Route: `/wizard/initializing` → `app/wizard/initializing/page.tsx`
- Boot sequence visualization page (can be accessed directly if localStorage contains agent data)

**Legacy Entry (Init Screen):**
- Route: `/(init)/init-screen` → `app/(init)/init-screen/page.tsx`
- Terminal-style boot sequence visualization (appears to be a parallel implementation)

### Step-by-Step Flow

The wizard follows a **strictly linear progression** with 6 counted steps + 1 system step:

#### Step 1: Organization Profile (`business-industry`)
- **Component**: `app/wizard/steps/business/OrganizationProfile.tsx`
- **Data Collected**:
  - Organization name (required, min 2 chars)
  - Industry type: `retail`, `contractor`, `professional`, `healthcare`
  - Organization size: `solo`, `1-10`, `11-50`, `51-200`, `201+`
  - Region (optional free text)
  - **Adaptive fields** based on industry selection:
    - Retail: SKUs, online store presence, inventory frequency
    - Contractor: Field techs count, dispatch software, service radius
    - Professional: Billing model, document workflow, team size
    - Healthcare: HIPAA compliance, record system, staff per location
- **Gating Logic**: None—all fields optional except organization name (validated via Zod schema)
- **Progression**: Can proceed immediately after entering organization name

#### Step 2: Security Posture (`business-security`)
- **Component**: `app/wizard/steps/business/SecurityPosture.tsx`
- **Data Collected**:
  - Security posture: `low`, `moderate`, `strict` (required, defaults to `moderate`)
  - Allow SAGE Autonomous Automation (checkbox, defaults to `true`)
  - Allow External Integrations (checkbox, defaults to `false`)
- **Gating Logic**: None—defaults allow progression
- **Progression**: Immediate—no validation gates

#### Step 3: Rho² Verification (`rho2-verification`)
- **Component**: `app/wizard/steps/security/Rho2VerificationCard.tsx`
- **Purpose**: Mandatory cryptographic identity layer verification
- **Behavior**: 
  - Simulated verification process (1.5s delay)
  - Custom navigation (handles its own `setStepIndex` call)
  - Cannot proceed until "verified" state is set
- **Gating Logic**: **CRITICAL GATE**—must complete verification before continuing
- **Progression**: Blocked until verification button clicked and state transitions to `verified`

#### Step 4: Operational Priorities (`operational-priorities`)
- **Component**: `app/wizard/steps/business/OperationalPriorities.tsx`
- **Data Collected**: Multi-select from 6 priorities:
  - `efficiency`: Operational efficiency optimization
  - `security`: Security & threat reduction
  - `analytics`: Analytics & forecasting
  - `automation`: Automation & workflows
  - `inventory`: Inventory intelligence
  - `team`: Team collaboration
- **Storage**: Stored in `useOnboardingDataStore` (separate from form context)
- **Gating Logic**: None—can proceed with zero selections
- **Impact**: Priorities influence agent recommendations in Step 5

#### Step 5: Agent Marketplace (`business-agent-marketplace`)
- **Component**: `app/wizard/steps/business/AgentMarketplaceStep.tsx`
- **Purpose**: Browse, filter, and select agents from the SAGE agent marketplace
- **Data Collected**: Array of agent IDs (stored in form context as `agents`)
- **Features**:
  - **Baseline agents**: Always-present federation agents (Rho² Guard, HADRA-01)
  - **Starter bundles**: Pre-configured agent packs (Operational Essentials, Security & Compliance, Automation First, Intelligence & Predictive, Full Enterprise Mesh)
  - **Smart recommendations**: Context-aware suggestions based on:
    - Industry type
    - Company size
    - Security posture
    - Operational priorities
    - Selected modules
  - **Agent dependencies**: Auto-adds required dependencies, prompts for recommended ones
  - **Category filtering**: Automation, Monitoring, Security, Analytics, Intelligence
  - **Search**: Text-based agent filtering
- **Gating Logic**: None—can proceed with zero agents selected (though critical recommendations are auto-selected)
- **Auto-selection**: Critical priority recommendations are automatically added on mount
- **Progression**: Can proceed immediately (no minimum agent requirement)

#### Step 6: Review & Initialize (`business-summary`)
- **Component**: `app/wizard/steps/business.tsx` → `BusinessSummaryStep`
- **Purpose**: Final review before environment initialization
- **Displays**:
  - Organization overview (name, industry, region)
  - Security posture summary
  - Selected modules list
  - Selected agents list
  - Infrastructure readiness checklist (static)
  - Deployment status indicators
- **Action**: "Finalize Deployment Blueprint & Initialize SAGE" button navigates to `/wizard/initializing`
- **Gating Logic**: None—review is informational only

#### Step 7: Final Setup (`final-setup`) [SYSTEM STEP]
- **Component**: `app/wizard/steps/FinalSetup.tsx`
- **Purpose**: Simulated environment preparation with progress messages
- **Behavior**: 
  - Sequential status messages (5 steps, 1.4s each)
  - Progress bar animation
  - "Enter Console" button appears on completion
  - Calls `onFinish` handler which navigates to `/wizard/initializing`
- **Gating Logic**: None—automated progression

### Conditional Paths & Branching

**Current State**: The wizard is **strictly linear** with no branching logic. All users follow the same 7-step sequence.

**Implicit Branching Points** (not yet implemented):
- Industry-specific adaptive panels in Step 1 (UI adapts, but flow remains linear)
- Security posture influences recommendations but doesn't change flow
- Operational priorities influence recommendations but don't gate progression

### Readiness Checks

**Explicit Validation**:
- Organization name: Minimum 2 characters (Zod schema validation)
- Rho² verification: Must complete verification before proceeding (Step 3)

**Implicit Readiness** (no blocking):
- All other steps allow progression with empty/default values
- Agent selection has no minimum requirement
- Operational priorities can be empty
- Security posture defaults to `moderate`

**Data Persistence**:
- Form data stored in React Hook Form context (validated via Zod schema)
- Agent selections stored in both form context and localStorage (`sage_selected_agents`)
- Module selections stored in localStorage (`sage_selected_modules`)
- Operational priorities stored in Zustand store (`useOnboardingDataStore`)

---

## 3. FEATURES & CAPABILITIES

### Feature Inventory

#### A. Organization Profile Collection
- **Location**: `app/wizard/steps/business/OrganizationProfile.tsx`
- **Status**: Active
- **Data Collected**:
  - Basic org metadata (name, industry, size, region)
  - Industry-specific adaptive fields (retail, contractor, professional, healthcare)
- **Permissions Implied**: Assumes user has authority to represent organization
- **Extensibility**: New industry types can be added to `INDUSTRY_TYPES` array and corresponding panel components

#### B. Security Posture Configuration
- **Location**: `app/wizard/steps/business/SecurityPosture.tsx`
- **Status**: Active
- **Data Collected**:
  - Security posture level (low/moderate/strict)
  - Automation consent flag
  - External integration consent flag
- **Trust Implications**: 
  - `allowAutomation: true` grants SAGE autonomous action capabilities
  - `allowExternal: true` permits external API integrations
  - Posture level influences agent recommendations and future security policies
- **Extensibility**: Additional security flags can be added to the form schema

#### C. Rho² Cryptographic Identity Verification
- **Location**: `app/wizard/steps/security/Rho2VerificationCard.tsx`
- **Status**: Active (simulated)
- **Current Behavior**: Mock verification with 1.5s delay
- **Trust Implications**: 
  - Mandatory gate—cannot proceed without verification
  - Establishes "sovereign identity" for the workspace
  - Cryptographically binds workspace to identity
- **Future Integration**: Would connect to actual Rho² identity service
- **Extensibility**: Verification logic can be replaced with real cryptographic handshake

#### D. Operational Priorities Selection
- **Location**: `app/wizard/steps/business/OperationalPriorities.tsx`
- **Status**: Active
- **Data Collected**: Multi-select array of priority IDs
- **Impact**: Feeds into recommendation engine (`app/wizard/engine/recommendations.ts`)
- **Extensibility**: New priorities can be added to the `priorities` array

#### E. Agent Marketplace
- **Location**: `app/wizard/steps/business/AgentMarketplaceStep.tsx`
- **Status**: Active
- **Capabilities**:
  - Agent browsing with category filtering
  - Search functionality
  - Dependency management (auto-adds required, prompts for recommended)
  - Bundle application (one-click agent pack selection)
  - Smart recommendations based on context
  - Agent detail panel for inspection
- **Data Collected**: Array of selected agent IDs
- **Trust Implications**: Each agent selection implies consent for that agent's capabilities
- **Extensibility**: 
  - New agents added to `app/wizard/config/agents.ts`
  - Dependencies configured in `app/wizard/config/agentDependencies.ts`
  - Bundles defined in `app/wizard/config/bundles.ts`

#### F. Recommendation Engine
- **Location**: `app/wizard/engine/recommendations.ts`
- **Status**: Active
- **Capabilities**:
  - Industry-based heuristics (retail → inventory automation, healthcare → audit guard)
  - Company size heuristics (201+ → performance analyzer)
  - Security posture heuristics (strict → audit guard, threat detection)
  - Module-based heuristics (monitoring module → system monitor)
  - Priority-based heuristics (efficiency → workflow automation)
  - Cross-agent dependency scoring
- **Data Sources**: Organization profile, security posture, operational priorities, selected modules
- **Extensibility**: New heuristics can be added as conditional blocks

#### G. Boot Sequence Visualization
- **Location**: `app/wizard/initializing/page.tsx` and `app/(init)/init-screen/page.tsx`
- **Status**: Active (two parallel implementations)
- **Capabilities**:
  - Terminal-style log stream
  - Progress bar
  - Visual effects (Rho² pulse, HADRA pulse, instability pulse, wireframe overlay)
  - Sequential boot messages from multiple boot sequence modules
- **Boot Sequences**:
  - `baseBoot.ts`: Core system initialization
  - `agentBoot.ts`: Agent-specific boot messages (generated from selected agents)
  - `rho2Handshake.ts`: Rho² identity handshake
  - `softErrors.ts`: Error normalization simulation
  - `environmentAssembly.ts`: Environment provisioning
  - `hadraEmergence.ts`: HADRA diagnostic assistant activation
- **Extensibility**: New boot sequence modules can be added

#### H. Form Validation & Schema
- **Location**: `app/wizard/schema/enterprise.ts`
- **Status**: Active
- **Capabilities**: Zod schema validation for enterprise onboarding data
- **Validation Rules**:
  - Organization name: min 2 characters
  - Account type: must be `"business"` (hardcoded)
  - Security posture: enum validation (`low`, `moderate`, `strict`)
  - Industry: enum validation (4 types)
  - Size: enum validation (5 tiers)
- **Extensibility**: Schema can be extended with new fields

### Dormant/Unused Features

**Personal Account Type**: 
- Schema includes `accountType: z.enum(["business"])` but personal flow is disabled
- `app/wizard/steps/select.tsx` contains unused `AccountTypeStep` component
- Personal-specific step folders exist but are empty

**Modules Selection**:
- Form schema includes `modules: z.array(z.string()).default([])` but no UI exists for module selection
- Module data is stored but never collected from user
- Recommendation engine references modules but they're always empty

---

## 4. PROGRESSIVE DISCLOSURE MECHANISMS

### Information Revelation Strategy

**Step-by-Step Disclosure**:
- Each step reveals only the information needed for that stage
- Agent marketplace (Step 5) is hidden until organization context is collected
- Recommendations are calculated progressively as data accumulates

**Adaptive UI Elements**:
- **Industry Panels**: Step 1 reveals industry-specific fields only after industry selection
- **Agent Recommendations**: Step 5 shows recommendations only after priorities are set
- **Dependency Prompts**: Agent dependencies are revealed when an agent is selected

**Hidden by Default**:
- Agent detail panels (shown on click/hover)
- Bundle descriptions (shown on hover)
- Smart recommendations (shown only if selections exist)
- Configuration health indicators (shown only when agents are selected)

### Timing & Consent Assumptions

**Immediate Progression**: Most steps allow immediate progression with minimal data entry
- Assumes users can provide accurate information quickly
- No "save draft" functionality—assumes single-session completion

**Rho² Verification Timing**: 
- Mandatory pause point—forces user to acknowledge cryptographic identity
- Simulated delay (1.5s) creates intentional friction

**Boot Sequence Timing**:
- Fixed delays between boot messages create sense of system activity
- Final transition to console happens automatically after sequence completes

**Consent Model**:
- Security posture step implies consent for automation/external integrations
- Agent selection implies consent for agent capabilities
- No explicit "terms of service" or "privacy policy" acceptance

### Maturity Assumptions

**User Sophistication**: 
- Assumes users understand:
  - Organization structure and industry classification
  - Security posture implications
  - Agent capabilities and dependencies
  - Operational priorities

**Domain Knowledge**:
- Industry-specific fields assume domain expertise (e.g., HIPAA compliance, SKU counts)
- Agent marketplace assumes understanding of automation, monitoring, security concepts

**Technical Comfort**:
- Terminal-style boot sequence assumes comfort with technical interfaces
- No "beginner mode" or simplified explanations

---

## 5. SECURITY & TRUST SURFACES

### Authentication & Authorization

**Current State**: **No explicit authentication or authorization checks exist**
- No login gates
- No session management
- No user identity verification
- No role-based access control

**Implicit Trust Model**:
- Assumes user has legitimate access to configure organization
- No verification that user represents the organization they're configuring
- No multi-user or team collaboration features

### Identity & Verification

**Rho² Sovereign Identity**:
- **Location**: `app/wizard/steps/security/Rho2VerificationCard.tsx`
- **Current Implementation**: Simulated verification (no actual cryptographic operation)
- **Intended Purpose**: Establish cryptographic identity for workspace
- **Trust Implications**: 
  - Mandatory gate suggests critical security function
  - "Sovereign identity" language implies decentralized, self-sovereign identity model
  - Verification binds workspace cryptographically

**Future Security Hooks**:
- Rho² verification is the primary extension point for real identity verification
- Security posture settings could feed into future access control policies
- Agent selections could influence future permission matrices

### Consent & Control Language

**Security Posture Step**:
- "Allow SAGE Autonomous Automation" — implies granting autonomous action capabilities
- "Allow External Integrations" — implies consent for external API access
- Language suggests user retains control but grants broad permissions

**Agent Selection**:
- No explicit consent language per agent
- Implicit consent through selection
- Dependency prompts suggest user awareness of agent relationships

**Rho² Verification**:
- "Mandatory cryptographic identity layer" — authoritative language
- "Must be completed before activation can proceed" — hard requirement
- Language emphasizes security and integrity

### Encryption & Access Control

**Current State**: **No encryption or access control implemented in UI**
- Form data stored in browser localStorage (unencrypted)
- No encryption of sensitive organization data
- No access control for viewing/editing configuration

**Future Extension Points**:
- Security posture settings could trigger encryption requirements
- Rho² verification could establish encryption keys
- Agent selections could define access control boundaries

### Data Privacy

**Data Collection**:
- Organization name, industry, size, region
- Industry-specific operational data (SKUs, tech counts, etc.)
- Security preferences
- Operational priorities
- Agent selections

**Data Storage**:
- React Hook Form context (in-memory during session)
- Zustand stores (in-memory during session)
- localStorage (persists across sessions, unencrypted)

**Data Transmission**: 
- No API calls visible in current implementation
- Data appears to be client-side only until "Finalize" action

---

## 6. EXTENSION POINTS

### Domain-Based Feature Unlocking

**Current Foundation**:
- Industry-specific adaptive panels (`OrganizationProfile.tsx`)
- Industry-based agent recommendations (`recommendations.ts`)

**Extension Opportunities**:
1. **Industry-Specific Steps**: Add industry-specific wizard steps after organization profile
2. **Industry-Specific Agents**: Create industry-specific agent categories
3. **Industry-Specific Modules**: Unlock modules based on industry selection
4. **Regional Compliance**: Add region-based compliance steps (GDPR, CCPA, etc.)

**Implementation Hooks**:
- `INDUSTRY_TYPES` array in `OrganizationProfile.tsx` can be extended
- `recommendAgents()` function can add industry-specific logic
- New step components can be added to `getEnterpriseSteps()` array

### Observation-First Workflows

**Current State**: Configuration-first (user provides data, then system configures)

**Extension Opportunities**:
1. **Data Collection Phase**: Add step to connect data sources (APIs, databases, file uploads)
2. **Observation Period**: Add "observation mode" where system collects data before agent activation
3. **Data Preview**: Show collected data before agent selection
4. **Pattern Detection**: Analyze collected data to suggest agents

**Implementation Hooks**:
- Add new step type: `observation` or `data-collection`
- Create data source connection components
- Extend recommendation engine to use observed data

### Conditional Panel/Console Revelation

**Current State**: All panels/consoles available after onboarding

**Extension Opportunities**:
1. **Feature Flags**: Gate console panels based on agent selections
2. **Progressive Unlocking**: Unlock features as users complete tasks
3. **Role-Based Panels**: Show different panels based on user role
4. **Maturity Gates**: Unlock advanced features after basic features are mastered

**Implementation Hooks**:
- Agent selections stored in form context can be read by console layout
- Console layout (`app/(os)/console/layout.tsx`) can conditionally render panels
- New Zustand store can track "unlocked features"

### User-Specific Feature Visibility

**Current State**: Single-user model, no user differentiation

**Extension Opportunities**:
1. **User Roles**: Add role selection (admin, operator, viewer)
2. **Team Onboarding**: Multi-user onboarding flow
3. **Permission Matrix**: Define permissions per role
4. **User-Specific Recommendations**: Personalize based on user role

**Implementation Hooks**:
- Add user role to form schema
- Create role-based recommendation logic
- Extend console to show role-specific features

### Mobile-First or Notification-Driven Interactions

**Current State**: Desktop-focused, full-page wizard

**Extension Opportunities**:
1. **Mobile Wizard**: Responsive wizard optimized for mobile
2. **Progressive Web App**: Installable PWA for mobile access
3. **Notification System**: Push notifications for onboarding progress
4. **SMS/Email Steps**: Add verification steps via SMS/email
5. **QR Code Flow**: Generate QR code for mobile device pairing

**Implementation Hooks**:
- Wizard layout can be made responsive
- Add notification service integration
- Create mobile-specific step components

### Additional Extension Points

**Multi-Tenant Support**:
- Add organization/workspace selection step
- Support multiple organizations per user
- Organization switching in console

**Integration Onboarding**:
- Add step to connect external services (Slack, email, APIs)
- OAuth flow for third-party integrations
- API key management

**Advanced Configuration**:
- Add "advanced mode" toggle
- Expose low-level configuration options
- Custom agent configuration

**Onboarding Analytics**:
- Track completion rates per step
- Identify drop-off points
- A/B test different flows

**Resume Capability**:
- Save progress to backend
- Resume from last completed step
- Multi-session support

---

## 7. UI/UX PHILOSOPHY

### Design Patterns

**Wizard Pattern**:
- Multi-step linear flow
- Progress indicator (step tracker + progress bar)
- Back/Next navigation
- Final review step

**Card-Based Layout**:
- Each step rendered in card container (`WizardCard`, `Card` components)
- Consistent spacing and visual hierarchy
- Dark theme with subtle borders and backgrounds

**Panel System**:
- Agent detail panels slide in from side
- Modal-like overlays for bundle previews
- Sidebar navigation in console (post-onboarding)

**Terminal Aesthetic**:
- Boot sequence uses terminal-style log stream
- Monospace font for technical feel
- Command-line inspired progress indicators

### Complexity Treatment

**Progressive Complexity**:
- Starts simple (organization name)
- Builds complexity (industry-specific fields)
- Peaks at agent marketplace (most complex step)
- Simplifies at review (summary view)

**Information Architecture**:
- Grouped related fields (organization, security, priorities)
- Category-based agent organization
- Hierarchical display (categories → agents → details)

**Cognitive Load Management**:
- One concept per step
- Clear step labels and descriptions
- Visual progress indicators reduce uncertainty
- Contextual help via hover descriptions

### Design Priorities

**Clarity Over Minimalism**:
- Detailed descriptions for each step
- Explicit labels and instructions
- No hidden or ambiguous actions

**Authority Over Guidance**:
- Authoritative language ("Mandatory", "Must be completed")
- Technical terminology (Rho², sovereign identity, federation)
- Assumes user competence

**Guidance Where Needed**:
- Smart recommendations provide guidance
- Dependency prompts guide agent selection
- Review step provides final guidance

**Visual Hierarchy**:
- Dark background with light text
- Gradient backgrounds and glows create depth
- Color coding for priorities (critical=red, operational=blue, optional=purple)
- Status indicators (checkmarks, badges)

### Interaction Patterns

**Click-to-Select**:
- Industry types: button selection
- Operational priorities: card selection
- Agents: checkbox selection

**Hover-to-Reveal**:
- Agent descriptions on hover
- Bundle details on hover
- Contextual information banners

**Progressive Enhancement**:
- Works without JavaScript (form submission)
- Enhanced with animations and transitions
- Smooth step transitions with Framer Motion

---

## 8. LIMITATIONS & CONSTRAINTS

### What the UI is NOT Designed to Do (Yet)

**Multi-User Collaboration**:
- No team member invitation
- No role assignment
- No collaborative editing
- Single-user model only

**Draft Saving & Resume**:
- No "save draft" functionality
- No backend persistence of progress
- Assumes single-session completion
- Cannot resume from interruption

**Validation & Error Recovery**:
- Minimal validation (only organization name)
- No error recovery flows
- No validation error messages displayed
- No "are you sure?" confirmations

**Personal Account Type**:
- Personal flow disabled (code exists but unused)
- Only enterprise/business flow active
- No personal-specific features

**Module Selection**:
- Modules referenced in schema but no UI exists
- Cannot select modules during onboarding
- Modules always empty array

**Real Authentication**:
- No login/signup flow
- No user account management
- No session management
- No password reset

**Real Rho² Integration**:
- Rho² verification is simulated
- No actual cryptographic operations
- No real identity service integration

**Backend Integration**:
- No API calls visible
- Data stored client-side only
- No backend validation
- No server-side agent provisioning

### Structural Constraints

**Linear Flow Limitation**:
- Strictly sequential steps
- No branching or conditional flows
- Cannot skip steps
- Cannot revisit completed steps (except back button)

**State Management Constraints**:
- Form data in React Hook Form (session-only)
- Additional data in Zustand stores (session-only)
- localStorage used for agent/module persistence (limited)
- No centralized state management for complex flows

**Component Coupling**:
- Wizard steps tightly coupled to form context
- Recommendation engine tightly coupled to form data structure
- Difficult to extract steps for reuse

**Routing Constraints**:
- Next.js App Router structure limits flexibility
- Route groups `(os)`, `(init)`, `(boot)` create organizational complexity
- Dynamic routes `[slug]` exist but underutilized

### Architectural Constraints

**Client-Side Only**:
- All logic runs in browser
- No server-side rendering of dynamic content
- No server-side validation
- No backend API integration

**No Data Persistence**:
- No database integration
- No backend storage
- Relies on localStorage (limited, unencrypted)
- Data lost on browser clear

**No Error Handling**:
- No error boundaries
- No error recovery flows
- No user-facing error messages
- Silent failures in many places

**No Loading States**:
- No loading indicators for async operations
- No skeleton screens
- Assumes instant operations

**No Accessibility Features**:
- No ARIA labels visible
- No keyboard navigation support
- No screen reader optimization
- No focus management

### Areas Requiring Refactoring for Long-Lived Use

**State Persistence**:
- Move from localStorage to backend API
- Add database persistence
- Implement session management
- Add draft saving

**Error Handling**:
- Add error boundaries
- Implement error recovery flows
- Add user-facing error messages
- Add validation error display

**Authentication & Authorization**:
- Add login/signup flow
- Implement session management
- Add role-based access control
- Add user account management

**Backend Integration**:
- Create API endpoints for data submission
- Implement agent provisioning backend
- Add environment initialization backend
- Add progress tracking backend

**Modularity**:
- Extract step components for reuse
- Create step registry system
- Decouple form context from steps
- Create plugin system for custom steps

**Testing Infrastructure**:
- Add unit tests for components
- Add integration tests for flows
- Add E2E tests for complete wizard
- Add accessibility tests

**Performance Optimization**:
- Add code splitting for wizard steps
- Implement lazy loading
- Optimize bundle size
- Add performance monitoring

**Internationalization**:
- Add i18n support
- Extract all text to translation files
- Support multiple languages
- Add locale-specific formatting

---

## APPENDIX: File Reference Map

### Core Wizard Files
- `app/wizard/page.tsx` - Entry point, auto-starts enterprise flow
- `app/wizard/layout.tsx` - Wizard layout with neural mesh background
- `app/wizard/components/WizardShell.tsx` - Main wizard container, step orchestration
- `app/wizard/components/FormProvider.tsx` - React Hook Form wrapper with Zod validation
- `app/wizard/store/useWizardStore.ts` - Wizard navigation state (step index, flow type)
- `app/wizard/store/useOnboardingDataStore.ts` - Onboarding data state (operational priorities, selected agents)

### Step Components
- `app/wizard/steps/index.ts` - Step registry and navigation helpers
- `app/wizard/steps/business/OrganizationProfile.tsx` - Step 1: Organization profile
- `app/wizard/steps/business/SecurityPosture.tsx` - Step 2: Security posture
- `app/wizard/steps/security/Rho2VerificationCard.tsx` - Step 3: Rho² verification
- `app/wizard/steps/business/OperationalPriorities.tsx` - Step 4: Operational priorities
- `app/wizard/steps/business/AgentMarketplaceStep.tsx` - Step 5: Agent marketplace
- `app/wizard/steps/business.tsx` - Step 6: Business summary (review)
- `app/wizard/steps/FinalSetup.tsx` - Step 7: Final setup (system step)

### Configuration Files
- `app/wizard/config/agents.ts` - Agent categories and definitions
- `app/wizard/config/agentDependencies.ts` - Agent dependency rules
- `app/wizard/config/bundles.ts` - Pre-configured agent bundles
- `app/wizard/config/modules.ts` - Module definitions (unused)
- `app/wizard/schema/enterprise.ts` - Zod validation schema

### Engine Files
- `app/wizard/engine/recommendations.ts` - Recommendation engine logic

### Boot Sequence Files
- `app/wizard/initializing/page.tsx` - Boot sequence visualization (wizard route)
- `app/(init)/init-screen/page.tsx` - Boot sequence visualization (init route)
- `app/(init)/init-screen/boot-sequences/*.ts` - Boot sequence message generators

### Console Files (Post-Onboarding)
- `app/(os)/console/layout.tsx` - Console layout with HADRA integration
- `app/(os)/console/page.tsx` - Console redirect to dashboard

---

**Document Status**: Complete  
**Last Updated**: 2025-01-27  
**Maintained By**: Systems Analyst / Documentation Architect
