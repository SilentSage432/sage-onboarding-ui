"use client";

import { create } from "zustand";
import type {
  ObservationEvent,
  ObservationEventType,
  ObservationSubsystem,
  ObservationSeverity,
} from "@/lib/console/observationVocabulary";

/**
 * Readiness State Store
 * 
 * This store holds readiness metadata for progressive revelation.
 * It is PASSIVE and NON-AUTHORITATIVE - it does not unlock capabilities.
 * It exists only so the UI can read state and display appropriate information.
 * 
 * All unlocking logic must be implemented separately when ready.
 */

export type Consent = {
  id: string;
  type: string;
  granted: boolean;
  grantedAt?: number;
  description: string;
};

export type ConsentEvent = {
  id: string;
  consentId: string;
  action: 'granted' | 'revoked';
  timestamp: number;
  reason?: string;
};

export type CapabilityLock = {
  capabilitySlug: string;
  reason: string;
  gates: Array<{
    type: 'time' | 'behavior' | 'consent' | 'observation';
    condition: string;
    status: 'pending' | 'met' | 'unmet';
  }>;
};

/**
 * System perspective determines what capabilities are visible to the user.
 * This is separate from readiness/unlocking - it's about existence, not availability.
 */
export type SystemPerspective = 'architect' | 'operator' | 'participant' | 'observer';

export type ReadinessState = {
  // System perspective (determines visibility, not unlocking)
  /**
   * Current system perspective of the user.
   * - architect: YubiKey/Rho² verified users (see architect-only modules)
   * - operator: Default console users (matches current "OPERATOR • ACTIVE" UI)
   * - participant: Invited/collaborative users
   * - observer: Read-only users
   * 
   * This does NOT unlock capabilities - it only changes what modules exist in the user's reality.
   * Default: 'operator' (matches current UI assumptions)
   */
  systemPerspective: SystemPerspective;
  
  // Time-based state
  /**
   * Timestamp when onboarding was completed (activation time).
   * Set when wizard completes. Used for time-based calculations.
   */
  activationTime: number | null;
  
  /**
   * Derived value: days since activation.
   * Calculated from activationTime, not enforced.
   */
  daysSinceActivation: number;
  
  /**
   * Timestamp when the current console session started.
   * Set when console layout mounts. Used for temporal framing.
   * This is a boundary marker - no interpretation or decisions.
   */
  currentSessionStartTime: number | null;
  
  // Behavior-based state (placeholders)
  /**
   * Counter for automation events observed.
   * Placeholder - not enforced.
   */
  automationEventCount: number;
  
  /**
   * Observation events recorded over time.
   * Uses vocabulary types for semantic structure.
   * This is passive memory - no interpretation or decisions.
   */
  observationEvents: ObservationEvent[];
  
  /**
   * Placeholder for learning milestones.
   * Not enforced - structure only.
   */
  learningMilestones: string[];
  
  // Consent-based state (placeholders)
  /**
   * Active consents granted by operator.
   * Placeholder - not enforced.
   */
  activeConsents: Consent[];
  
  /**
   * History of consent events.
   * Placeholder - not enforced.
   */
  consentHistory: ConsentEvent[];
  
  // Capability unlock state (read-only, not authoritative)
  /**
   * List of capability slugs that are unlocked.
   * This is a READ-ONLY reflection of state, not an enforcement mechanism.
   * Empty by default - unlocking logic must be implemented separately.
   */
  unlockedCapabilities: string[];
  
  /**
   * Metadata about locked capabilities.
   * Descriptive only - not enforced.
   */
  lockedCapabilities: CapabilityLock[];
  
  // Observation state (placeholders)
  /**
   * Current observation phase.
   * Placeholder - not enforced.
   */
  observationPhase: 'initial' | 'learning' | 'ready';
  
  /**
   * Placeholder for observed patterns.
   * Not enforced - structure only.
   */
  observedPatterns: Array<{
    id: string;
    type: string;
    confidence: number;
    timestamp: number;
  }>;
  
  /**
   * Panel visit observations (session-only, perceptual infrastructure).
   * Tracks operator attention patterns for temporal continuity awareness.
   * This is passive observation only - no authority, no persistence, no behavior change.
   */
  panelVisits: Array<{
    panelSlug: string;
    lastViewedAt: number;
    viewCount: number;
  }>;
  
  // Actions (passive setters - no unlock logic)
  /**
   * Set activation time (typically called on wizard completion).
   * Does not unlock anything - just records the timestamp.
   */
  setActivationTime: (time: number) => void;
  
  /**
   * Update automation event count.
   * Does not unlock anything - just records the count.
   */
  setAutomationEventCount: (count: number) => void;
  
  /**
   * Add an observation event.
   * Does not unlock anything - just records the event.
   * Uses vocabulary types for semantic structure.
   */
  addObservationEvent: (event: ObservationEvent) => void;
  
  /**
   * Add a learning milestone.
   * Does not unlock anything - just records the milestone.
   */
  addLearningMilestone: (milestone: string) => void;
  
  /**
   * Grant a consent.
   * Does not unlock anything - just records the consent.
   */
  grantConsent: (consent: Consent) => void;
  
  /**
   * Revoke a consent.
   * Does not unlock anything - just records the revocation.
   */
  revokeConsent: (consentId: string) => void;
  
  /**
   * Set unlocked capabilities (read-only reflection).
   * This should only be called by unlock logic (not implemented here).
   * This store does not determine what should be unlocked.
   */
  setUnlockedCapabilities: (slugs: string[]) => void;
  
  /**
   * Set locked capability metadata.
   * Descriptive only - not enforced.
   */
  setLockedCapabilities: (locks: CapabilityLock[]) => void;
  
  /**
   * Set observation phase.
   * Placeholder - not enforced.
   */
  setObservationPhase: (phase: ReadinessState['observationPhase']) => void;
  
  /**
   * Set system perspective.
   * This changes visibility of modules, not their unlock status.
   * Typically called on Rho² verification success to set 'architect'.
   */
  setSystemPerspective: (perspective: SystemPerspective) => void;
  
  /**
   * Set current session start time.
   * Called when console session begins. This is a boundary marker only.
   * Does not unlock anything or change behavior.
   */
  setCurrentSessionStartTime: (timestamp: number) => void;
  
  /**
   * Observe a panel visit (perceptual infrastructure only).
   * Records operator attention for temporal continuity awareness.
   * Session-only observation - no persistence, no authority, no behavior change.
   */
  observePanelVisit: (panelSlug: string) => void;
  
  /**
   * Reset readiness state (for testing/development).
   */
  reset: () => void;
};

const initialState: Omit<ReadinessState, keyof {
  setActivationTime: never;
  setAutomationEventCount: never;
  addObservationEvent: never;
  addLearningMilestone: never;
  grantConsent: never;
  revokeConsent: never;
  setUnlockedCapabilities: never;
  setLockedCapabilities: never;
  setObservationPhase: never;
  setSystemPerspective: never;
  setCurrentSessionStartTime: never;
  observePanelVisit: never;
  reset: never;
}> = {
  systemPerspective: 'operator', // Default matches current UI assumptions
  activationTime: null,
  daysSinceActivation: 0,
  currentSessionStartTime: null,
  automationEventCount: 0,
  observationEvents: [],
  learningMilestones: [],
  activeConsents: [],
  consentHistory: [],
  unlockedCapabilities: [],
  lockedCapabilities: [],
  observationPhase: 'initial',
  observedPatterns: [],
  panelVisits: [], // Session-only panel visit observations
};

export const useReadinessStore = create<ReadinessState>((set, get) => ({
  ...initialState,
  
  setActivationTime: (time: number) => {
    set({ activationTime: time });
    // Derive days since activation (passive calculation, not enforced)
    const days = Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
    set({ daysSinceActivation: days });
  },
  
  setAutomationEventCount: (count: number) => {
    set({ automationEventCount: count });
  },
  
  addObservationEvent: (event) => {
    set((state) => ({
      observationEvents: [...state.observationEvents, event],
    }));
  },
  
  addLearningMilestone: (milestone: string) => {
    set((state) => ({
      learningMilestones: [...state.learningMilestones, milestone],
    }));
  },
  
  grantConsent: (consent: Consent) => {
    const now = Date.now();
    set((state) => ({
      activeConsents: [...state.activeConsents.filter(c => c.id !== consent.id), { ...consent, granted: true, grantedAt: now }],
      consentHistory: [...state.consentHistory, {
        id: `consent-${now}`,
        consentId: consent.id,
        action: 'granted',
        timestamp: now,
      }],
    }));
  },
  
  revokeConsent: (consentId: string) => {
    const now = Date.now();
    set((state) => ({
      activeConsents: state.activeConsents.filter(c => c.id !== consentId),
      consentHistory: [...state.consentHistory, {
        id: `consent-${now}`,
        consentId,
        action: 'revoked',
        timestamp: now,
      }],
    }));
  },
  
  setUnlockedCapabilities: (slugs: string[]) => {
    set({ unlockedCapabilities: slugs });
  },
  
  setLockedCapabilities: (locks: CapabilityLock[]) => {
    set({ lockedCapabilities: locks });
  },
  
  setObservationPhase: (phase: ReadinessState['observationPhase']) => {
    set({ observationPhase: phase });
  },
  
  setSystemPerspective: (perspective: SystemPerspective) => {
    set({ systemPerspective: perspective });
  },
  
  setCurrentSessionStartTime: (timestamp: number) => {
    set({ currentSessionStartTime: timestamp });
  },
  
  observePanelVisit: (panelSlug: string) => {
    const now = Date.now();
    set((state) => {
      const existingVisit = state.panelVisits.find(v => v.panelSlug === panelSlug);
      if (existingVisit) {
        // Update existing visit: increment count and update timestamp
        return {
          panelVisits: state.panelVisits.map(v =>
            v.panelSlug === panelSlug
              ? { ...v, lastViewedAt: now, viewCount: v.viewCount + 1 }
              : v
          ),
        };
      } else {
        // New visit: add to observations
        return {
          panelVisits: [...state.panelVisits, {
            panelSlug,
            lastViewedAt: now,
            viewCount: 1,
          }],
        };
      }
    });
  },
  
  reset: () => {
    set(initialState);
  },
}));

/**
 * Helper to calculate days since activation (passive, not enforced).
 * This is a utility function that reads from the store.
 */
export const calculateDaysSinceActivation = (): number => {
  const state = useReadinessStore.getState();
  if (!state.activationTime) return 0;
  return Math.floor((Date.now() - state.activationTime) / (1000 * 60 * 60 * 24));
};

/**
 * Update days since activation (called periodically or on mount).
 * This is a passive update - it does not unlock anything.
 */
export const updateDaysSinceActivation = () => {
  const state = useReadinessStore.getState();
  if (state.activationTime) {
    const days = calculateDaysSinceActivation();
    useReadinessStore.setState({ daysSinceActivation: days });
  }
};
