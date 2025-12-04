// lib/hadra/formatInsight.ts

export function formatTimestamp(ts: string) {
  const date = new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

