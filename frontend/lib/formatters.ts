import { formatDistanceToNow, format } from "date-fns"

export type RiskLevel = "low" | "medium" | "high"

export function formatRiskScore(score: number): string {
  return `${score}/100`
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  return `₹${amount.toLocaleString("en-IN")}`
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return format(d, "MMM d, yyyy HH:mm")
}

export function getRiskColor(level: RiskLevel): string {
  const colors = { low: "#10B981", medium: "#F59E0B", high: "#EF4444" }
  return colors[level]
}

export function getRiskGlow(level: RiskLevel): string {
  const glows = { low: "rgba(16,185,129,0.3)", medium: "rgba(245,158,11,0.3)", high: "rgba(239,68,68,0.3)" }
  return glows[level]
}

export function getRiskBadgeClass(level: RiskLevel): string {
  const classes = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20 risk-pulse",
  }
  return classes[level]
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    open: "#3B82F6",
    under_review: "#F59E0B",
    resolved: "#10B981",
    escalated: "#EF4444",
    completed: "#10B981",
    failed: "#EF4444",
    running: "#3B82F6",
    queued: "#8B949E",
    pending: "#8B949E",
  }
  return map[status] ?? "#8B949E"
}
