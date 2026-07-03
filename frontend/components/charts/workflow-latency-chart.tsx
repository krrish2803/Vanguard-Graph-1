"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { motion } from "framer-motion"

interface WorkflowLatencyChartProps {
  data: { name: string; duration: number }[]
}

export function WorkflowLatencyChart({ data }: WorkflowLatencyChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
          <XAxis dataKey="name" stroke="#484F58" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#484F58" fontSize={11} tickLine={false} axisLine={false} unit="s" />
          <Tooltip
            contentStyle={{
              background: "#0D1117",
              border: "1px solid #21262D",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#F0F6FC" }}
          />
          <Bar dataKey="duration" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
