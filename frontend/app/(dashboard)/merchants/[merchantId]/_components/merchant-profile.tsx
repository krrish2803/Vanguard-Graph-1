"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRiskScore, formatDate } from "@/lib/formatters"
import type { Merchant } from "@/lib/mock-data"

interface MerchantProfileProps {
  merchant: Merchant
}

export function MerchantProfile({ merchant }: MerchantProfileProps) {
  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-4">Merchant Profile</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <p className="text-sm text-[var(--text-primary)]">{merchant.name}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="text-sm text-[var(--text-primary)]">{merchant.email}</p>
          </div>
          <div>
            <Label>Phone</Label>
            <p className="text-sm text-[var(--text-primary)]">{merchant.phone}</p>
          </div>
          <div>
            <Label>Status</Label>
            <p className="text-sm text-[var(--text-primary)]">{merchant.status.replace("_", " ")}</p>
          </div>
          <div>
            <Label>Risk Score</Label>
            <Badge variant="risk" riskLevel={merchant.riskLevel} glow>
              {formatRiskScore(merchant.riskScore)}
            </Badge>
          </div>
          <div>
            <Label>Created</Label>
            <p className="text-sm text-[var(--text-primary)]">{formatDate(merchant.createdAt)}</p>
          </div>
          <div>
            <Label>Device Fingerprint</Label>
            <p className="text-sm font-mono text-[var(--text-primary)]">{merchant.deviceFingerprint}</p>
          </div>
          <div>
            <Label>IP Address</Label>
            <p className="text-sm font-mono text-[var(--text-primary)]">{merchant.ipAddress}</p>
          </div>
          <div>
            <Label>Bank Account</Label>
            <p className="text-sm font-mono text-[var(--text-primary)]">{merchant.bankAccountNumber}</p>
          </div>
          <div>
            <Label>IFSC</Label>
            <p className="text-sm font-mono text-[var(--text-primary)]">{merchant.bankAccountIfsc}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[var(--text-muted)] mb-0.5">{children}</p>
}
