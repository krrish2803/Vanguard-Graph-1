"use client"

import { cn } from "@/lib/utils"
import { getRiskColor, getRiskGlow, type RiskLevel } from "@/lib/formatters"

interface BadgeProps {
  className?: string
  children: React.ReactNode
  variant?: "default" | "risk" | "status" | "outline"
  riskLevel?: RiskLevel
  glow?: boolean
}

export function Badge({ className, children, variant = "default", riskLevel, glow }: BadgeProps) {
  if (variant === "risk" && riskLevel) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
          riskLevel === "high" && "bg-red-500/10 text-red-400 border-red-500/20",
          riskLevel === "medium" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
          riskLevel === "low" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          glow && riskLevel === "high" && "risk-pulse",
          className
        )}
        style={glow ? { boxShadow: `0 0 12px ${getRiskGlow(riskLevel)}` } : undefined}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getRiskColor(riskLevel) }} />
        {children}
      </span>
    )
  }

  if (variant === "status") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
          className
        )}
      >
        {children}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[var(--text-secondary)]",
        className
      )}
    >
      {children}
    </span>
  )
}
