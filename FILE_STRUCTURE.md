# Sage Onboarding UI - Complete File Structure

This document provides a comprehensive overview of the entire file structure for the Sage Onboarding UI project.

---

## Root Directory

```
sage-onboarding-ui/
├── app/                          # Next.js App Router source
├── components/                   # Shared UI and component library
├── lib/                         # Utility helpers and shared logic
├── public/                      # Static assets
├── node_modules/                # Dependencies (excluded from structure)
├── CODEBASE_MAP.md              # High-level codebase documentation
├── FILE_STRUCTURE.md            # This file
├── README.md                    # Project overview
├── components.json              # Component system configuration
├── eslint.config.mjs           # ESLint configuration
├── next.config.js               # Next.js configuration
├── next-env.d.ts                # Next.js TypeScript definitions
├── package.json                 # Project metadata and dependencies
├── package-lock.json            # Locked dependency versions
├── postcss.config.mjs           # PostCSS/Tailwind configuration
└── tsconfig.json                # TypeScript compiler configuration
```

---

## app/ - Next.js App Router

```
app/
├── layout.tsx                   # Root layout wrapping all routes
├── page.tsx                     # Default root page
├── globals.css                  # Global CSS and Tailwind base styles
├── favicon.ico                  # Site favicon
│
├── (boot)/                      # Route group for boot/loading states
│   └── loading/
│       └── page.tsx            # Loading page component
│
├── (init)/                      # Route group for initialization
│   └── init-screen/
│       └── page.tsx            # Initial onboarding/init screen
│
├── (os)/                        # Route group for OS-style console
│   ├── boot/
│   │   └── page.tsx            # Boot page
│   │
│   ├── console/                 # Main console UI
│   │   ├── layout.tsx          # Console layout wrapper
│   │   ├── page.tsx            # Main console dashboard
│   │   │
│   │   ├── [slug]/              # Dynamic route for console panels
│   │   │   └── page.tsx        # Dynamic panel page
│   │   │
│   │   ├── agents/              # Agents panel route
│   │   ├── automations/        # Automations panel route
│   │   ├── components/         # Console-specific components
│   │   │   ├── DesktopPanel.tsx
│   │   │   ├── PanelLoader.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Terminal.tsx
│   │   │   └── TopBar.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard page
│   │   │
│   │   ├── mesh/               # Mesh panel route
│   │   ├── modules/             # Modules panel route
│   │   ├── monitoring/         # Monitoring panel route
│   │   ├── rho2/                # Rho2 panel route
│   │   ├── security/           # Security panel route
│   │   └── settings/           # Settings panel route
│   │
│   └── welcome/
│       └── page.tsx            # Welcome page
│
├── terminal/                    # Terminal interface routes
│   └── hadra/                   # HADRA terminal interface
│       ├── layout.tsx          # HADRA terminal layout
│       ├── page.tsx            # HADRA terminal main page
│       └── components/         # HADRA terminal components
│           ├── ChatStream.tsx
│           ├── InsightPanel.tsx
│           ├── ModuleSidebar.tsx
│           └── TerminalFrame.tsx
│
└── wizard/                      # Onboarding wizard flow
    ├── layout.tsx              # Wizard layout shell
    ├── page.tsx                # Wizard entry page
    │
    ├── components/              # Wizard UI components
    │   ├── AgentCard.tsx       # Agent selection card
    │   ├── AgentFilters.tsx    # Agent filtering UI
    │   ├── FormProvider.tsx    # Form context provider
    │   ├── ModuleCard.tsx      # Module selection card
    │   ├── StepTracker.tsx    # Step progress tracker
    │   ├── TransitionWrapper.tsx  # Step transition animations
    │   ├── WizardCard.tsx      # Wizard card container
    │   ├── WizardNav.tsx       # Wizard navigation controls
    │   ├── WizardShell.tsx     # High-level wizard container
    │   └── steps/              # Step-specific components (empty)
    │
    ├── config/                 # Wizard configuration
    │   ├── agents.ts           # Agent configuration data
    │   └── modules.ts          # Module configuration data
    │
    ├── engine/                 # Wizard logic and recommendations
    │   └── recommendations.ts  # Recommendation engine
    │
    ├── initializing/
    │   └── page.tsx            # Initialization page
    │
    ├── schema/                 # Data schemas
    │   └── enterprise.ts      # Enterprise schema definitions
    │
    ├── steps/                  # Wizard step implementations
    │   ├── index.ts            # Step registry and ordering
    │   ├── select.tsx          # Step selector/dispatcher
    │   ├── business.tsx        # Business onboarding flow
    │   ├── BusinessAgentMarketplace.tsx
    │   ├── BusinessAgentSelect.tsx
    │   ├── BusinessModuleSelect.tsx
    │   ├── FinalSetup.tsx      # Final setup step
    │   │
    │   ├── business/           # Business-specific steps
    │   │   ├── AgentMarketplaceStep.tsx
    │   │   ├── ModulesStep.tsx
    │   │   ├── OrganizationProfile.tsx
    │   │   └── SecurityPosture.tsx
    │   │
    │   ├── personal/           # Personal-specific steps (empty)
    │   │
    │   └── security/           # Security-related steps
    │       └── Rho2VerificationCard.tsx
    │
    └── store/                  # State management stores
        ├── useOnboardingDataStore.ts  # Onboarding data persistence
        └── useWizardStore.ts         # Wizard navigation state
```

---

## components/ - Component Library

```
components/
├── console/                     # Console-specific components
│   └── panels/                 # Console panel components
│       ├── AgentDetailPanel.tsx
│       ├── AgentsPanel.tsx
│       ├── MeshPanel.tsx
│       ├── Rho2Panel.tsx
│       └── SecurityPanel.tsx
│
├── hadra/                      # HADRA interface components
│   ├── HADRA.tsx              # Main HADRA component
│   ├── HADRAButton.tsx        # HADRA trigger button
│   ├── HADRADiagnostics.tsx   # HADRA diagnostics display
│   └── HADRAIntro.tsx         # HADRA introduction component
│
├── onboarding/                 # Onboarding components (empty)
│
├── system/                     # System-level components
│   ├── DockIcon.tsx           # Dock icon component
│   └── HadraConsole.tsx       # HADRA console wrapper
│
└── ui/                         # Reusable UI primitives
    ├── badge.tsx              # Badge component
    ├── button.tsx             # Button component
    ├── card.tsx               # Card container component
    ├── form.tsx               # Form component
    ├── input.tsx              # Text input component
    ├── progress.tsx           # Progress indicator
    └── tabs.tsx               # Tabs component
```

---

## lib/ - Utility Libraries

```
lib/
├── console/
│   └── moduleRegistry.tsx      # Console module registry
└── utils.ts                    # General utility helpers
```

---

## public/ - Static Assets

```
public/
├── file.svg                    # File icon SVG
├── globe.svg                   # Globe icon SVG
├── next.svg                    # Next.js logo
├── vercel.svg                  # Vercel logo
└── window.svg                  # Window/frame icon SVG
```

---

## Configuration Files

```
Root/
├── components.json             # Component system config (shadcn/ui)
├── eslint.config.mjs           # ESLint linting rules
├── next.config.js              # Next.js framework config
├── next-env.d.ts               # Next.js TypeScript definitions
├── package.json                # NPM package manifest
├── package-lock.json           # Dependency lock file
├── postcss.config.mjs          # PostCSS/Tailwind processing
└── tsconfig.json               # TypeScript compiler config
```

---

## Documentation Files

```
Root/
├── CODEBASE_MAP.md             # High-level codebase documentation
├── FILE_STRUCTURE.md           # Complete file structure (this file)
└── README.md                   # Project overview and setup
```

---

## File Count Summary

- **Total TypeScript/TSX Files**: ~86 files
- **App Router Pages**: ~20+ route pages
- **Components**: ~30+ component files
- **Configuration**: 8 config files
- **Static Assets**: 5 SVG files

---

## Key Directories

### 🎯 Core Application Routes
- `app/(os)/console/` - Main OS console interface
- `app/wizard/` - Onboarding wizard flow
- `app/terminal/hadra/` - HADRA terminal interface

### 🧩 Component Organization
- `components/ui/` - Design system primitives
- `components/console/panels/` - Console panel components
- `components/hadra/` - HADRA-specific components

### 📦 State & Configuration
- `app/wizard/store/` - Wizard state management
- `app/wizard/config/` - Wizard configuration data
- `app/wizard/schema/` - Data schema definitions

### 🛠️ Utilities & Libraries
- `lib/` - Shared utility functions
- `lib/console/` - Console-specific utilities

---

*Last Updated: Generated from current codebase structure*

