"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { EmptyState } from "@/components/shared/empty-state"
import { formatTimeAgo } from "@/lib/formatters"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Investigation } from "@/lib/mock-data"

interface InvestigationsTableProps {
  investigations: Investigation[]
}

export function InvestigationsTable({ investigations }: InvestigationsTableProps) {
  const router = useRouter()

  if (investigations.length === 0) {
    return (
      <EmptyState
        icon={<Search className="w-6 h-6" />}
        title="No investigations"
        description="No investigations have been opened yet."
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
          <TableHead>Evidence</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {investigations.map((inv) => (
          <TableRow key={inv.id} onClick={() => router.push(`/investigations/${inv.id}`)}>
            <TableCell className="font-mono text-blue-400">{inv.id}</TableCell>
            <TableCell className="text-[var(--text-primary)]">{inv.merchantName}</TableCell>
            <TableCell>
              <Badge variant="risk" riskLevel={inv.riskLevel} glow>
                {inv.riskScore}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="status">{inv.status.replace("_", " ")}</Badge>
            </TableCell>
            <TableCell className="text-[var(--text-muted)]">{inv.evidence.length} items</TableCell>
            <TableCell className="text-xs text-[var(--text-muted)]">{formatTimeAgo(inv.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
