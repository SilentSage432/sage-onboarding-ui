/**
 * HADRA Severity Grammar Engine
 * Maps system severity levels to HADRA's phrasing style
 * Ensures severity → tone is always correct and consistent
 */

export type SeverityLevel = "info" | "anomaly" | "warning" | "critical";

export function severityGrammar(severity: SeverityLevel, message: string): string {
  switch (severity) {
    case "info":
      return `Insight available. ${message}`;

    case "anomaly":
      return `Deviation observed. ${message}`;

    case "warning":
      return `Operator, an issue requires attention. ${message}`;

    case "critical":
      return `Operator, a critical event is in progress. ${message}`;

    default:
      return message;
  }
}

