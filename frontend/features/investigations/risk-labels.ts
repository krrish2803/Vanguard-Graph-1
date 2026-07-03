export function getRiskLabelColor(label: string): string {
  const map: Record<string, string> = {
    HIGH: "text-red-400",
    MEDIUM: "text-amber-400",
    LOW: "text-emerald-400",
    "FRAUD RING": "text-purple-400",
  }
  return map[label] ?? "text-[var(--text-secondary)]"
}
