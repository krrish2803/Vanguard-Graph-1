"use client"

import { useCallback, useRef, useState, useEffect, type MouseEvent } from "react"
import type { GraphNode, GraphLink } from "@/lib/mock-data"
import { getRiskColor } from "@/lib/formatters"

interface GraphCanvasProps {
  nodes: GraphNode[]
  links: GraphLink[]
}

export function GraphCanvas({ nodes, links }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    const nodePositions: Record<string, { x: number; y: number }> = {}
    const centerX = w / 2
    const centerY = h / 2

    nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / nodes.length
      const radius = Math.min(w, h) * 0.35
      nodePositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    links.forEach((link) => {
      const source = link.source as string
      const target = link.target as string
      const from = nodePositions[source]
      const to = nodePositions[target]
      if (!from || !to) return

      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(to.x, to.y)
      ctx.strokeStyle = link.suspicious ? "rgba(239, 68, 68, 0.4)" : "rgba(59, 130, 246, 0.2)"
      ctx.lineWidth = link.suspicious ? 2 : 1
      ctx.stroke()
    })

    nodes.forEach((node) => {
      const pos = nodePositions[node.id]
      if (!pos) return

      const color = node.riskScore ? getRiskColor(node.riskLevel!) : "#8B949E"
      const radius = node.type === "Merchant" ? 8 : 6
      const isSelected = selectedNode === node.id

      ctx.beginPath()
      ctx.arc(pos.x, pos.y, isSelected ? radius + 4 : radius, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      if (isSelected) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.fillStyle = "#F0F6FC"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.label, pos.x, pos.y + radius + 14)
    })
  }, [nodes, links, selectedNode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    draw()
  }, [draw])

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      let closest: string | null = null
      let closestDist = 20

      nodes.forEach((node, i) => {
        const angle = (2 * Math.PI * i) / nodes.length
        const radius = Math.min(canvas.width, canvas.height) * 0.35
        const nx = centerX + radius * Math.cos(angle)
        const ny = centerY + radius * Math.sin(angle)
        const dist = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2)
        if (dist < closestDist) {
          closestDist = dist
          closest = node.id
        }
      })

      setSelectedNode(closest === selectedNode ? null : closest)
    },
    [nodes, selectedNode]
  )

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleClick}
      />
      {selectedNode && (
        <div className="absolute bottom-4 left-4 glass rounded-xl p-3 text-sm">
          <p className="text-[var(--text-primary)] font-medium">
            Selected: {nodes.find((n) => n.id === selectedNode)?.label}
          </p>
          <p className="text-[var(--text-muted)] text-xs font-mono">{selectedNode}</p>
        </div>
      )}
    </div>
  )
}
