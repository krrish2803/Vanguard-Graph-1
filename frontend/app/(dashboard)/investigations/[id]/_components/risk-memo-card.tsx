"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface RiskMemoCardProps {
  memo: string
}

export function RiskMemoCard({ memo }: RiskMemoCardProps) {
  return (
    <Card glow="red">
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <CardTitle className="mb-2">Risk Memo</CardTitle>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{memo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
