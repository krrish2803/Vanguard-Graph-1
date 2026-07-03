"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Ban } from "lucide-react"
import type { EvidenceItem } from "@/lib/mock-data"

interface EvidencePanelProps {
  evidence: EvidenceItem[]
}

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-4">Evidence</CardTitle>
        <div className="space-y-3">
          {evidence.map((item, i) => (
            <div
              key={i}
              className={`glass rounded-lg p-3 border-l-2 ${
                item.suspicious ? "border-red-500/50" : "border-emerald-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {item.type}
                </span>
                {item.suspicious ? (
                  <Ban className="w-3 h-3 text-red-400" />
                ) : (
                  <Shield className="w-3 h-3 text-emerald-400" />
                )}
              </div>
              <p className="text-sm font-mono text-[var(--text-primary)] mb-1">{item.value}</p>
              <div className="flex items-center gap-2">
                <Badge variant={item.suspicious ? "default" : "default"}>
                  {item.suspicious ? "Suspicious" : "Clean"}
                </Badge>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Shared with {item.sharedWith} {item.sharedWith === 1 ? "entity" : "entities"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
