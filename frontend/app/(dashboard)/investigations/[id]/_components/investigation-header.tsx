"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatters"
import type { Investigation } from "@/lib/mock-data"

interface InvestigationHeaderProps {
  investigation: Investigation
}

export function InvestigationHeader({ investigation }: InvestigationHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{investigation.merchantName}</h1>
          <Badge variant="risk" riskLevel={investigation.riskLevel} glow>
            {investigation.riskScore}
          </Badge>
          <Badge variant="status">{investigation.status.replace("_", " ")}</Badge>
        </div>
        <p className="text-sm text-[var(--text-secondary)] font-mono">
          {investigation.id} · Created {formatDate(investigation.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="danger" size="sm">Block Merchant</Button>
        <Button variant="primary" size="sm">Escalate</Button>
      </div>
    </div>
  )
}
