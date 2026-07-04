import apiClient from "@/lib/api-client"
import { mockGraphData } from "@/lib/mock-data"

export const graphApi = {
  getGraph: async () => {
    try {
      const res = await apiClient.get("/graph/fraud-rings?minAccounts=2")
      const rings = res.data
      if (Array.isArray(rings) && rings.length === 0) {
        return JSON.parse(JSON.stringify(mockGraphData))
      }
      return rings
    } catch {
      return JSON.parse(JSON.stringify(mockGraphData))
    }
  },
}
