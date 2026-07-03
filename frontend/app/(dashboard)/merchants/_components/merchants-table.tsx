"use client"

import { useMerchants } from "@/features/merchants/hooks"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { TableSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/shared/empty-state"
import { formatRiskScore, formatTimeAgo, getRiskColor } from "@/lib/formatters"
import { Store } from "lucide-react"
import { useRouter } from "next/navigation"

export function MerchantsTable() {
  const { data: merchants, isLoading } = useMerchants()
  const router = useRouter()

  if (isLoading) return <TableSkeleton rows={8} />
  if (!merchants || merchants.length === 0) {
    return (
      <EmptyState
        icon={<Store className="w-6 h-6" />}
        title="No merchants"
        description="No merchants have been onboarded yet."
      />
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Risk Score</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {merchants.map((m) => (
          <TableRow key={m.id} onClick={() => router.push(`/merchants/${m.id}`)}>
            <TableCell className="font-mono text-[var(--text-primary)]">{m.id}</TableCell>
            <TableCell className="text-[var(--text-primary)] font-medium">{m.name}</TableCell>
            <TableCell>{m.email}</TableCell>
            <TableCell>
              <Badge variant="risk" riskLevel={m.riskLevel} glow>
                {formatRiskScore(m.riskScore)}
              </Badge>
            </TableCell>
            <TableCell>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${getRiskColor(m.riskLevel)}10`,
                  color: getRiskColor(m.riskLevel),
                  borderColor: `${getRiskColor(m.riskLevel)}20`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getRiskColor(m.riskLevel) }} />
                {m.status.replace("_", " ")}
              </span>
            </TableCell>
            <TableCell className="text-xs text-[var(--text-muted)]">{formatTimeAgo(m.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
