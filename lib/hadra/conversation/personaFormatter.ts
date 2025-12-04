/**
 * HADRA Persona Formatter
 * Applies cognitive persona constraints to all output:
 * - Calm tone
 * - High information density
 * - Short sentences
 * - No emotion
 * - No unnecessary details
 * - No exclamation marks
 */

export function personaFormatter(text: string): string {
  return text
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
    .replace(/!+/g, ".") // Replace exclamation marks with periods
    .replace(/\?{2,}/g, "?") // Normalize multiple question marks
    .replace(/\.{3,}/g, "...") // Normalize ellipses
    .replace(/\s+([,.])/g, "$1") // Remove space before punctuation
    .replace(/([,.!?])\s*([,.!?])/g, "$1 $2"); // Ensure space after punctuation
}

