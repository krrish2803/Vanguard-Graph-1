"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"

interface RiskDistributionChartProps {
  data: { name: string; value: number; color: string }[]
}

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#0D1117",
              border: "1px solid #21262D",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            itemStyle={{ color: "#F0F6FC" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 -mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-[var(--text-secondary)]">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
