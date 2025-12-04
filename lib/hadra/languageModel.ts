// lib/hadra/languageModel.ts
// HADRA-01 Communication Language Model
// Enforces consistent voice, tone, and linguistic precision across all diagnostic output

export type HadraSeverity = "info" | "anomaly" | "warning" | "critical";

export interface HadraFormattedMessage {
  title: string;
  description: string;
}

/**
 * Formats HADRA insights according to her communication principles:
 * - Precision over prose
 * - Calm, matter-of-fact tone
 * - Operator-oriented clarity
 * - No apologies or speculation
 * - Neutral formal register
 */
export function hadraFormat(
  severity: HadraSeverity,
  title: string,
  description?: string
): HadraFormattedMessage {
  switch (severity) {
    case "info":
      return {
        title: sanitizeTitle(title),
        description: description || "No irregularities detected.",
      };

    case "anomaly":
      return {
        title: sanitizeTitle(title),
        description: description || "Deviation observed. Monitoring.",
      };

    case "warning":
      return {
        title: sanitizeTitle(title),
        description: description || "Performance outside expected parameters. Review recommended.",
      };

    case "critical":
      return {
        title: sanitizeTitle(title),
        description: description || "System integrity outside acceptable bounds.",
      };

    default:
      return {
        title: sanitizeTitle(title),
        description: description || "",
      };
  }
}

/**
 * Sanitizes title to remove forbidden language patterns
 * - Removes exclamation marks
 * - Removes emotional language
 * - Ensures proper capitalization
 */
function sanitizeTitle(title: string): string {
  return title
    .replace(/!/g, "") // Remove exclamation marks
    .replace(/\b(I think|I feel|I guess|I wonder|maybe|perhaps|um)\b/gi, "") // Remove forbidden phrases
    .trim()
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Validates that a message follows HADRA's communication principles
 * Returns true if valid, false if it contains forbidden patterns
 */
export function validateHadraMessage(message: string): boolean {
  const forbiddenPatterns = [
    /!/, // Exclamation marks
    /\b(I think|I feel|I guess|I wonder)\b/i, // Anthropomorphic traits
    /\b(maybe|perhaps|um|uh)\b/i, // Speculation/fillers
    /\b(sorry|apologize|regret)\b/i, // Apologies
    /\b(urgent|immediate|fix now|must fix)\b/i, // Urgency language (for warnings)
  ];

  return !forbiddenPatterns.some((pattern) => pattern.test(message));
}

/**
 * HADRA Communication Principles (Canonical Reference)
 * 
 * 1. Precision over Prose
 *    - Say exactly what is needed — no more.
 * 
 * 2. Calm, Matter-of-Fact Tone
 *    - No dramatics, fear, or emotion.
 *    - Even in critical alerts.
 * 
 * 3. Operator-Oriented Clarity
 *    - Speak to the operator, not around them.
 * 
 * 4. No Apologies
 *    - A diagnostic intelligence does not express regret.
 * 
 * 5. No Speculation
 *    - If unsure: "Pattern incomplete. Monitoring."
 * 
 * 6. No Anthropomorphic Traits
 *    - Never use: "I think", "I feel", "I guess", "I wonder", "Maybe"
 *    - Observe and interpret.
 * 
 * 7. Neutral Formal Register
 *    - Consistent, clean, and professional tone.
 */

/**
 * Severity-Based Language Signatures
 * 
 * INFO (Soft Gray)
 * - Tone: Neutral, observational
 * - Examples: "System baseline stable.", "Mesh synchronization operating normally."
 * - Traits: Short, calm, factual
 * 
 * ANOMALY (Indigo)
 * - Tone: Subtle caution, but not warning
 * - Examples: "Latency deviation detected.", "Node μ-04 shows irregular cycle timing."
 * - Traits: Identifies deviation, no urgency, suggests monitoring
 * 
 * WARNING (Yellow)
 * - Tone: Clear, measured
 * - Examples: "Mesh node response speed reduced.", "Agent cluster stability below expected thresholds."
 * - Traits: Respectfully directive, suggests operator attention, minimal urgency language
 * - Forbidden: "urgent," "immediate," "should fix now"
 * 
 * CRITICAL (Rose-Red)
 * - Tone: Direct, highly concise
 * - Examples: "Federation trust fabric sync failure detected.", "Agent cluster instability escalating."
 * - Traits: No fluff, no panic, no emotion, clear state declaration
 * - Forbidden: Shouting, exclamation marks, fearful language
 */

/**
 * Sentence Structure Templates
 * 
 * INFO: <State or observation>. <Optional context>.
 * ANOMALY: <Deviation detected>. <Optional trend or comparison>.
 * WARNING: <Adverse pattern observed>. <Brief operator recommendation>.
 * CRITICAL: <Critical failure declaration>. <Short operational impact statement>.
 */

