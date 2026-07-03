"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getStatusColor } from "@/lib/formatters"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = getStatusColor(status)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
      )}
      style={{
        backgroundColor: `${color}10`,
        color,
        borderColor: `${color}20`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status.replace("_", " ")}
    </span>
  )
}
