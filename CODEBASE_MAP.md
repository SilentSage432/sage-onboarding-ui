## CODEBASE MAP

High-level map of the repository, with **short purpose notes** for every file.  
Onboarding wizard–related files are marked with **[ONBOARDING WIZARD]**.

---

## Root

- `app/` — **Next.js App Router source; all pages, layouts, and route groups.**
- `components/` — **Shared UI and onboarding components.**
- `lib/` — **Utility helpers shared across the app.**
- `public/` — **Static assets served by Next.js.**
- `node_modules/` — **Installed dependencies (managed by npm).**
- `components.json` — **Component system configuration (e.g., for UI library tooling).**
- `eslint.config.mjs` — **ESLint configuration for linting and code quality.**
- `next-env.d.ts` — **TypeScript definitions injected by Next.js.**
- `next.config.ts` — **Next.js framework configuration.**
- `package.json` — **Project metadata, scripts, and dependencies.**
- `package-lock.json` — **Locked dependency versions for reproducible installs.**
- `postcss.config.mjs` — **PostCSS/Tailwind processing configuration.**
- `README.md` — **Project overview and developer notes.**
- `tsconfig.json` — **TypeScript compiler configuration.**

---

## app/

- `app/layout.tsx` — **Root layout for the app; wraps all routes with shared UI and providers.**
- `app/page.tsx` — **Default root page (e.g., landing or redirect entry).**
- `app/globals.css` — **Global CSS and Tailwind base styles applied to the entire app.**
- `app/favicon.ico` — **Site favicon used by the browser.**

### app/(init)/

- `app/(init)/` — **Route group for initialization / first-run experiences.**
  - `app/(init)/init-screen/` — **Namespace for the initial onboarding/init screen route.**
    - `app/(init)/init-screen/page.tsx` — **Init screen page component shown before main OS console.**

### app/(os)/

- `app/(os)/` — **Route group for the operating system–style console.**
  - `app/(os)/console/` — **Namespace for the primary console UI route.**
    - `app/(os)/console/page.tsx` — **Main OS console page rendering the operator bridge console.**

### app/wizard/  **[ONBOARDING WIZARD]**

- `app/wizard/` — **Top-level route for the onboarding wizard flow.** **[ONBOARDING WIZARD]**
  - `app/wizard/layout.tsx` — **Layout shell for all wizard steps and navigation.** **[ONBOARDING WIZARD]**
  - `app/wizard/page.tsx` — **Entry page that mounts the onboarding wizard experience.** **[ONBOARDING WIZARD]**

#### app/wizard/components/  **[ONBOARDING WIZARD]**

- `app/wizard/components/` — **Presentation components composing the wizard UI.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/WizardShell.tsx` — **High-level container/shell for the multi-step wizard UI.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/WizardStep.tsx` — **Generic step wrapper handling layout and step transitions.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/TransitionWrapper.tsx` — **Animation/transition wrapper for smooth step changes.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/WizardShell.tsx` — **(duplicate path listing for clarity) Core shell structuring wizard content and controls.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/WizardStep.tsx` — **(duplicate path listing for clarity) Base step component used by individual step pages.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/Step1.tsx` — **View component for the first wizard step.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/Step2Business.tsx` — **View component for the business-mode second wizard step.** **[ONBOARDING WIZARD]**
  - `app/wizard/components/Step2Personal.tsx` — **View component for the personal-mode second wizard step.** **[ONBOARDING WIZARD]**

#### app/wizard/steps/  **[ONBOARDING WIZARD]**

- `app/wizard/steps/` — **Step registry and per-mode step implementations for the wizard.** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/index.ts` — **Central index/registry describing available steps and their ordering.** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/select.tsx` — **Step selector/dispatcher component that chooses which step to render.** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/business.tsx` — **Composition of business onboarding steps and logic.** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/personal.tsx` — **Composition of personal onboarding steps and logic.** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/Step2Business.tsx` — **Dedicated implementation of the business second step (wizard flavor).** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/Step2Personal.tsx` — **Dedicated implementation of the personal second step (wizard flavor).** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/business/` — **(currently empty or reserved) Folder for business-specific step files.** **[ONBOARDING WIZARD]**
  - `app/wizard/steps/personal/` — **(currently empty or reserved) Folder for personal-specific step files.** **[ONBOARDING WIZARD]**

#### app/wizard/config/

- `app/wizard/config/` — **Configuration space for wizard behavior (e.g., copy, rules, flows).**

#### app/wizard/store/  **[ONBOARDING WIZARD]**

- `app/wizard/store/` — **State stores backing the wizard UX.** **[ONBOARDING WIZARD]**
  - `app/wizard/store/useWizardStore.ts` — **Primary wizard store managing current step, navigation, and flow state.** **[ONBOARDING WIZARD]**
  - `app/wizard/store/useOnboardingDataStore.ts` — **Store for persisting onboarding form data across steps.** **[ONBOARDING WIZARD]**

---

## components/

- `components/onboarding/` — **Standalone onboarding steps, likely used by wizard or console.** **[ONBOARDING WIZARD]**
  - `components/onboarding/Step1.tsx` — **Onboarding step one component (content + fields).** **[ONBOARDING WIZARD]**
  - `components/onboarding/Step2.tsx` — **Onboarding step two component (content + fields).** **[ONBOARDING WIZARD]**
  - `components/onboarding/Step3.tsx` — **Onboarding step three component (content + fields).** **[ONBOARDING WIZARD]**
  - `components/onboarding/Step4.tsx` — **Onboarding step four component (content + fields / finalization).** **[ONBOARDING WIZARD]**

- `components/ui/` — **Reusable design-system style UI primitives.**
  - `components/ui/button.tsx` — **Button component styled with Tailwind, used across the app.**
  - `components/ui/card.tsx` — **Card container component for grouping related content.**
  - `components/ui/input.tsx` — **Text input component with consistent styling and behavior.**
  - `components/ui/progress.tsx` — **Progress indicator component (e.g., step progress).**
  - `components/ui/tabs.tsx` — **Tabs component for segmented navigation.**

---

## lib/

- `lib/utils.ts` — **Utility helpers (e.g., className merging, formatting helpers).**

---

## public/

- `public/file.svg` — **SVG asset used somewhere in the UI (generic file icon/art).**
- `public/globe.svg` — **SVG globe icon, likely used for world/connection imagery.**
- `public/next.svg` — **Next.js logo asset.**
- `public/vercel.svg` — **Vercel logo asset.**
- `public/window.svg` — **SVG representing a window/frame UI element.**


