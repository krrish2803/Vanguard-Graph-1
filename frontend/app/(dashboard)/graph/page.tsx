"use client"

import { useGraphData } from "@/features/graph/hooks"
import { PageHeader } from "@/components/shared/page-header"
import { CardSkeleton } from "@/components/ui/skeleton"
import { GraphCanvas } from "./_components/graph-canvas"
import { GraphLegend } from "./_components/graph-legend"

export default function GraphPage() {
  const { data: graphData, isLoading } = useGraphData()

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader title="Fraud Graph" description="Visualize entity relationships and fraud rings" />
      <div className="flex-1 glass rounded-xl overflow-hidden relative">
        {isLoading ? (
          <div className="p-6"><CardSkeleton /></div>
        ) : graphData ? (
          <>
            <GraphCanvas nodes={graphData.nodes} links={graphData.links} />
            <GraphLegend />
          </>
        ) : null}
      </div>
    </div>
  )
}
