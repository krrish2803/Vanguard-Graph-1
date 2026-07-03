"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import type { Merchant } from "@/lib/mock-data"
import { mockMerchants } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

interface LinkedEntitiesProps {
  merchant: Merchant
}

export function LinkedEntities({ merchant }: LinkedEntitiesProps) {
  const sameDevice = mockMerchants.filter(
    (m) => m.deviceFingerprint === merchant.deviceFingerprint && m.id !== merchant.id
  )
  const sameBank = mockMerchants.filter(
    (m) => m.bankAccountNumber === merchant.bankAccountNumber && m.id !== merchant.id
  )

  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-4">Linked Entities</CardTitle>
        <div className="space-y-6">
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium mb-2">
              Same Device ({sameDevice.length})
            </p>
            {sameDevice.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No other merchants share this device.</p>
            ) : (
              <div className="space-y-2">
                {sameDevice.map((m) => (
                  <div key={m.id} className="flex items-center justify-between glass rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{m.name}</p>
                      <p className="text-xs text-[var(--text-muted)] font-mono">{m.id}</p>
                    </div>
                    <Badge variant="risk" riskLevel={m.riskLevel} glow>
                      {m.riskScore}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] font-medium mb-2">
              Same Bank Account ({sameBank.length})
            </p>
            {sameBank.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No other merchants share this bank account.</p>
            ) : (
              <div className="space-y-2">
                {sameBank.map((m) => (
                  <div key={m.id} className="flex items-center justify-between glass rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{m.name}</p>
                      <p className="text-xs text-[var(--text-muted)] font-mono">{m.id}</p>
                    </div>
                    <Badge variant="risk" riskLevel={m.riskLevel} glow>
                      {m.riskScore}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
