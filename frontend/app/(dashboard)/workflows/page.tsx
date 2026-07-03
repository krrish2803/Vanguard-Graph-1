"use client"

import { useWorkflows } from "@/features/workflows/hooks"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { WorkflowRunsTable } from "./_components/workflow-runs-table"
import { WorkflowLatencyChart } from "@/components/charts/workflow-latency-chart"

export default function WorkflowsPage() {
  const { data: workflows, isLoading } = useWorkflows()

  const latencyData = [
    { name: "KYC Review", duration: 145 },
    { name: "Payout", duration: 130 },
    { name: "Periodic", duration: 210 },
    { name: "Alert", duration: 95 },
    { name: "Escalation", duration: 180 },
  ]

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Automated risk evaluation pipelines"
      />
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{workflows?.length || 0}</p>
            <p className="text-xs text-[var(--text-muted)]">Total Runs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-2xl font-bold text-emerald-400">{workflows?.filter((w) => w.status === "completed").length || 0}</p>
            <p className="text-xs text-[var(--text-muted)]">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-2xl font-bold text-amber-400">{workflows?.filter((w) => w.status === "running" || w.status === "queued").length || 0}</p>
            <p className="text-xs text-[var(--text-muted)]">Active</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">Latency by Workflow Type</p>
            <WorkflowLatencyChart data={latencyData} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">Workflow Runs</p>
            <WorkflowRunsTable workflows={workflows || []} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
