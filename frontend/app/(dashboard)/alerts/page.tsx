"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { AlertFilters } from "./_components/alert-filters"
import { AlertsTable } from "./_components/alerts-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { AlertFilters as AlertFiltersType } from "@/features/alerts/types"

export default function AlertsPage() {
  const [filters, setFilters] = useState<AlertFiltersType>({})

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Monitor and triage fraud alerts across your merchant base"
        action={<Button variant="primary" size="sm">Export</Button>}
      />
      <Card>
        <CardContent>
          <AlertFilters value={filters} onChange={setFilters} />
          <AlertsTable filters={filters} />
        </CardContent>
      </Card>
    </div>
  )
}
