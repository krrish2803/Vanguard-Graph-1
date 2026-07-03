"use client"

import { useInvestigations } from "@/features/investigations/hooks"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { InvestigationsTable } from "./_components/investigations-table"
import { TableSkeleton } from "@/components/ui/skeleton"

export default function InvestigationsPage() {
  const { data: investigations, isLoading } = useInvestigations()

  return (
    <div>
      <PageHeader
        title="Investigations"
        description="Deep-dive investigations into suspicious merchant activities"
      />
      <Card>
        <CardContent>
          {isLoading ? <TableSkeleton rows={4} /> : <InvestigationsTable investigations={investigations || []} />}
        </CardContent>
      </Card>
    </div>
  )
}
