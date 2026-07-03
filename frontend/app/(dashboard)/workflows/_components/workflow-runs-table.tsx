"use client"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { TableSkeleton } from "@/components/ui/skeleton"
import { WorkflowStatusPill } from "./workflow-status-pill"
import { formatTimeAgo } from "@/lib/formatters"
import type { WorkflowRun } from "@/lib/mock-data"

interface WorkflowRunsTableProps {
  workflows: WorkflowRun[]
  isLoading: boolean
}

export function WorkflowRunsTable({ workflows, isLoading }: WorkflowRunsTableProps) {
  if (isLoading) return <TableSkeleton rows={5} />

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Run</TableHead>
          <TableHead>Merchant</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workflows.map((w) => (
          <TableRow key={w.id}>
            <TableCell className="font-mono text-[var(--text-primary)]">{w.id}</TableCell>
            <TableCell className="text-[var(--text-primary)]">{w.merchantName}</TableCell>
            <TableCell className="text-xs text-[var(--text-secondary)]">{w.workflowType.replace(/_/g, " ")}</TableCell>
            <TableCell><WorkflowStatusPill status={w.status} /></TableCell>
            <TableCell className="text-xs text-[var(--text-muted)]">{w.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
