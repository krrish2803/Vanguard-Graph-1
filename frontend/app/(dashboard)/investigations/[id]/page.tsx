"use client"

import { useInvestigation } from "@/features/investigations/hooks"
import { CardSkeleton } from "@/components/ui/skeleton"
import { InvestigationHeader } from "./_components/investigation-header"
import { RiskMemoCard } from "./_components/risk-memo-card"
import { EvidencePanel } from "./_components/evidence-panel"
import { RingReplay } from "./_components/ring-replay"

export default function InvestigationDetailPage({ params }: { params: { id: string } }) {
  const { data: investigation, isLoading } = useInvestigation(params.id)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    )
  }

  if (!investigation) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-[var(--text-secondary)]">Investigation not found</p>
      </div>
    )
  }

  return (
    <div>
      <InvestigationHeader investigation={investigation} />
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 space-y-6">
          <RiskMemoCard memo={investigation.memo} />
          <RingReplay timeline={investigation.timeline} />
        </div>
        <div className="col-span-1">
          <EvidencePanel evidence={investigation.evidence} />
        </div>
      </div>
    </div>
  )
}
