"use client"

import { Drawer } from "@/components/ui/drawer"
import type { GraphNode } from "@/lib/mock-data"

interface NodeDrawerProps {
  node: GraphNode | null
  onClose: () => void
}

export function NodeDrawer({ node, onClose }: NodeDrawerProps) {
  return (
    <Drawer open={!!node} onClose={onClose} title={node?.label || ""}>
      {node && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>ID</Label>
            <p className="text-sm font-mono text-[var(--text-primary)]">{node.id}</p>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <p className="text-sm text-[var(--text-primary)]">{node.type}</p>
          </div>
          {node.riskScore !== undefined && (
            <div className="space-y-2">
              <Label>Risk Score</Label>
              <p className="text-sm text-[var(--text-primary)]">{node.riskScore}/100</p>
            </div>
          )}
        </div>
      )}
    </Drawer>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">{children}</p>
}
