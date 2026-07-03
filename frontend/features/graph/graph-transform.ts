import type { GraphNode, GraphLink } from "@/lib/mock-data"

export interface ForceNode extends GraphNode {
  x?: number
  y?: number
}

export interface ForceLink {
  source: string | ForceNode
  target: string | ForceNode
  label: string
  suspicious: boolean
}

export function transformToForceGraph(data: { nodes: GraphNode[]; links: GraphLink[] }) {
  return {
    nodes: data.nodes.map((n) => ({ ...n })) as ForceNode[],
    links: data.links.map((l) => ({ ...l })) as ForceLink[],
  }
}
