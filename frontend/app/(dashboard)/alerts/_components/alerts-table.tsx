"use client"

import { useAlerts } from "@/features/alerts/hooks"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { TableSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { formatTimeAgo } from "@/lib/formatters"
import { Bell } from "lucide-react"
import Link from "next/link"
import type { AlertFilters } from "@/features/alerts/types"

interface AlertsTableProps {
  filters: AlertFilters
}

export function AlertsTable({ filters }: AlertsTableProps) {
  const { data: alerts, isLoading } = useAlerts(filters)

  if (isLoading) return <TableSkeleton rows={6} />
  if (!alerts || alerts.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="w-6 h-6" />}
        title="No alerts found"
        description="No alerts match the current filters."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Merchant</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Summary</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((a) => (
          <TableRow key={a.id}>
            <TableCell>
              <Link href={`/alerts/${a.id}`} className="font-mono text-blue-400 hover:text-blue-300">
                {a.id}
              </Link>
            </TableCell>
            <TableCell className="text-[var(--text-primary)]">{a.merchantName}</TableCell>
            <TableCell>
              <Badge variant="risk" riskLevel={a.riskLevel} glow>
                {a.riskScore}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="status">{a.status.replace("_", " ")}</Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate">{a.summary}</TableCell>
            <TableCell className="text-[var(--text-muted)] text-xs">{formatTimeAgo(a.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
