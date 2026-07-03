"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-center mb-4 text-[var(--text-muted)]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="sm" className="mt-4">
          {action.label}
        </Button>
      )}
    </motion.div>
  )
}
