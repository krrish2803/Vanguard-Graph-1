"use client"

import { cn } from "@/lib/utils"
import type { WorkflowStatus } from "@/lib/mock-data"

interface WorkflowStatusPillProps {
  status: WorkflowStatus
}

const statusConfig: Record<WorkflowStatus, { color: string; label: string; animate?: boolean }> = {
  queued: { color: "bg-gray-500/10 text-gray-400 border-gray-500/20", label: "Queued" },
  running: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Running", animate: true },
  scoring: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Scoring", animate: true },
  generating_memo: { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", label: "Generating Memo", animate: true },
  completed: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Completed" },
  failed: { color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Failed" },
}

export function WorkflowStatusPill({ status }: WorkflowStatusPillProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.color
      )}
    >
      {config.animate && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {!config.animate && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {config.label}
    </span>
  )
}
