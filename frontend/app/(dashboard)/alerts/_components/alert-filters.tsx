"use client"

import { cn } from "@/lib/utils"
import type { AlertFilters as AlertFiltersType } from "@/features/alerts/types"

const riskLevels = ["all", "low", "medium", "high"]
const statuses = ["all", "open", "under_review", "resolved", "escalated"]

interface AlertFiltersProps {
  value: AlertFiltersType
  onChange: (filters: AlertFiltersType) => void
}

export function AlertFilters({ value, onChange }: AlertFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Risk</span>
        {riskLevels.map((r) => (
          <button
            key={r}
            onClick={() => onChange({ ...value, riskLevel: r === "all" ? undefined : r })}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              (r === "all" && !value.riskLevel) || value.riskLevel === r
                ? "bg-blue-500/10 text-blue-400"
                : "text-[var(--text-muted)] hover:bg-white/5"
            )}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>
      <div className="w-px h-6 bg-[var(--bg-border)]" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Status</span>
        {statuses.map((s) => {
          const label = s === "under_review" ? "Under Review" : s.charAt(0).toUpperCase() + s.slice(1)
          return (
            <button
              key={s}
              onClick={() => onChange({ ...value, status: s === "all" ? undefined : s })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                (s === "all" && !value.status) || value.status === s
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-[var(--text-muted)] hover:bg-white/5"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
