/**
 * HADRA Mock Engine
 * Simulates HADRA's diagnostic and response system
 * 
 * This will be replaced with real backend integration in future phases
 * Now uses the enhanced mock intelligence for better responses
 */

import { hadraBus } from "@/lib/hadra/hadraEventBus";
import { sendToHadra } from "@/lib/hadra/hadraMockIntelligence";
import type { HadraConsoleMessage, HadraInsight } from "@/types/hadra";

// Auto-start mock engine when module loads
if (typeof window !== "undefined") {
  // Listen for console messages and generate responses using enhanced mock intelligence
  hadraBus.on("consoleMessage", async (msg: HadraConsoleMessage) => {
    // Only process operator messages
    if (msg.role !== "operator") return;

    // Show "analyzing" indicator
    hadraBus.emit("insight", {
      role: "hadra",
      content: "Analyzing...",
      ts: Date.now(),
      severity: "info",
      subsystem: "system",
    } as HadraInsight);

    // Use enhanced mock intelligence for responses
    const response = await sendToHadra(msg.content);

    // Emit HADRA's response (this will appear after "Analyzing...")
    hadraBus.emit("insight", {
      role: "hadra",
      content: response,
      ts: Date.now(),
      severity: "info",
      subsystem: "system",
    } as HadraInsight);
  });
}

