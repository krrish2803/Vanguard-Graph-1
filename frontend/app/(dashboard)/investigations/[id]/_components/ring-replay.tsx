"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import type { TimelineEvent } from "@/lib/mock-data"

interface RingReplayProps {
  timeline: TimelineEvent[]
}

export function RingReplay({ timeline }: RingReplayProps) {
  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-4">Ring Replay</CardTitle>
        <div className="space-y-0">
          {timeline.map((event, i) => {
            const severityColor =
              event.severity === "danger" ? "red" : event.severity === "warning" ? "amber" : "blue"
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-3 pb-6 last:pb-0"
              >
                {i < timeline.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[var(--bg-border)]" />
                )}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-${severityColor}-500/10`}
                >
                  <div className={`w-2 h-2 rounded-full bg-${severityColor}-500`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-[var(--text-primary)]">Step {event.step}</p>
                    <Badge
                      variant="status"
                      className={`text-[10px] ${
                        event.severity === "danger"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : event.severity === "warning"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {event.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-primary)]">{event.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{event.detail}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
