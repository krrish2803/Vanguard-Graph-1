"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import CountUp from "react-countup"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  trend?: string
  trendUp?: boolean
  icon: React.ReactNode
  color: string
  glow?: string
  decimals?: boolean
}

export function StatCard({ title, value, prefix, suffix, trend, trendUp, icon, color, glow, decimals }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden" glow={glow as any}>
      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: color, boxShadow: `0 0 12px ${color}40` }} />
      <CardContent>
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{title}</span>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold font-mono" style={{ color }}>
          {prefix}
          <CountUp end={value} duration={2} separator="," decimals={decimals ? 1 : 0} />
          {suffix}
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 mt-1.5 text-xs", trendUp ? "text-emerald-400" : "text-red-400")}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend}% this week</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
