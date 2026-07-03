import type { GraphNode, GraphLink } from "@/lib/mock-data"

export type { GraphNode, GraphLink }
export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
