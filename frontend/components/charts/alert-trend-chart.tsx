"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { motion } from "framer-motion"

interface AlertTrendChartProps {
  data: { date: string; low: number; medium: number; high: number }[]
}

export function AlertTrendChart({ data }: AlertTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
          <XAxis dataKey="date" stroke="#484F58" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#484F58" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0D1117",
              border: "1px solid #21262D",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#F0F6FC" }}
          />
          <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: "#EF4444" }} />
          <Line type="monotone" dataKey="medium" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3, fill: "#F59E0B" }} />
          <Line type="monotone" dataKey="low" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: "#10B981" }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
