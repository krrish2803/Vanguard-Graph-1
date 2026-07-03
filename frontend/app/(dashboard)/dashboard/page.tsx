"use client"

import { useDashboardStats, useAlertTrend, useRiskDistribution } from "@/features/dashboard/hooks"
import { useAlerts } from "@/features/alerts/hooks"
import { useWorkflows } from "@/features/workflows/hooks"
import { StatCard } from "@/components/shared/stat-card"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTrendChart } from "@/components/charts/alert-trend-chart"
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton, CardSkeleton } from "@/components/ui/skeleton"
import { formatTimeAgo } from "@/lib/formatters"
import { Banknote, Bell, Network, Store, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DashboardOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: trendData, isLoading: trendLoading } = useAlertTrend()
  const { data: riskData, isLoading: riskLoading } = useRiskDistribution()
  const { data: alerts, isLoading: alertsLoading } = useAlerts()
  const { data: workflows, isLoading: workflowsLoading } = useWorkflows()

  return (
    <div>
      <PageHeader title="Dashboard" description="Real-time fraud intelligence overview" />

      <div className="grid grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          <>
            <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
          </>
        ) : stats ? (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <StatCard title="Total Merchants" value={stats.totalMerchants} icon={<Store className="w-4 h-4 text-blue-400" />} color="#3B82F6" glow="blue" trend={stats.merchantTrend} trendUp />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <StatCard title="Active Alerts" value={stats.activeAlerts} icon={<Bell className="w-4 h-4 text-amber-400" />} color="#F59E0B" glow="warning" trend={stats.alertTrend} trendUp={false} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <StatCard title="Fraud Rings" value={stats.fraudRingsDetected} icon={<Network className="w-4 h-4 text-purple-400" />} color="#A855F7" glow="purple" trend={stats.ringTrend} trendUp />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <StatCard title="Amount at Risk" value={stats.amountAtRisk} prefix="₹" icon={<Banknote className="w-4 h-4 text-red-400" />} color="#EF4444" glow="red" trend={stats.riskTrend} trendUp={false} />
            </motion.div>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader><CardTitle>Alert Trend (7 days)</CardTitle></CardHeader>
          <CardContent>
            {trendLoading ? (
              <div className="h-[220px] flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
            ) : trendData ? <AlertTrendChart data={trendData} /> : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Risk Distribution</CardTitle></CardHeader>
          <CardContent>
            {riskLoading ? (
              <div className="h-[220px] flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" /></div>
            ) : riskData ? <RiskDistributionChart data={riskData} /> : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Alerts</CardTitle>
              <Link href="/alerts" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </CardHeader>
          <CardContent>
            {alertsLoading ? <TableSkeleton rows={4} /> : alerts ? (
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Alert</TableHead><TableHead>Merchant</TableHead><TableHead>Risk</TableHead><TableHead>When</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.slice(0, 5).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-[var(--text-primary)]">{a.id}</TableCell>
                      <TableCell>{a.merchantName}</TableCell>
                      <TableCell><Badge variant="risk" riskLevel={a.riskLevel} glow>{a.riskScore}</Badge></TableCell>
                      <TableCell>{formatTimeAgo(a.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Workflows</CardTitle>
              <Link href="/workflows" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
          </CardHeader>
          <CardContent>
            {workflowsLoading ? <TableSkeleton rows={4} /> : workflows ? (
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Run</TableHead><TableHead>Merchant</TableHead><TableHead>Status</TableHead><TableHead>Duration</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.filter((w) => w.status !== "completed" && w.status !== "failed").map((w) => (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono text-[var(--text-primary)]">{w.id}</TableCell>
                      <TableCell>{w.merchantName}</TableCell>
                      <TableCell><Badge variant="status">{w.status}</Badge></TableCell>
                      <TableCell>{w.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
