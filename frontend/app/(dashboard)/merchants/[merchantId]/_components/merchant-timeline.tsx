"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import type { Merchant } from "@/lib/mock-data"
import { formatTimeAgo } from "@/lib/formatters"
import { Clock, Shield, AlertTriangle, Ban } from "lucide-react"

interface MerchantTimelineProps {
  merchant: Merchant
}

export function MerchantTimeline({ merchant }: MerchantTimelineProps) {
  const events = [
    { icon: Clock, title: "Merchant created", detail: formatTimeAgo(merchant.createdAt), severity: "info" as const },
    { icon: Shield, title: "Signals collected", detail: "Device, IP, bank, email fingerprints recorded", severity: "info" as const },
    ...(merchant.riskLevel === "high" || merchant.riskLevel === "medium"
      ? [{ icon: AlertTriangle as React.ComponentType<{ className?: string }>, title: "Risk assessment triggered", detail: `Score: ${merchant.riskScore}/100 — ${merchant.riskLevel.toUpperCase()}`, severity: "warning" as const }]
      : []),
    ...(merchant.status === "blocked"
      ? [{ icon: Ban as React.ComponentType<{ className?: string }>, title: "Merchant blocked", detail: "Flagged by automated fraud detection", severity: "danger" as const }]
      : []),
  ]

  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-4">Timeline</CardTitle>
        <div className="space-y-0">
          {events.map((event, i) => {
            const Icon = event.icon
            return (
              <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                {i < events.length - 1 && (
                  <div className="absolute left-[11px] top-7 bottom-0 w-px bg-[var(--bg-border)]" />
                )}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    event.severity === "danger"
                      ? "bg-red-500/10 text-red-400"
                      : event.severity === "warning"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">{event.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{event.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
