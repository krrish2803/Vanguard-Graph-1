import apiClient from "@/lib/api-client"
import { mockGraphData } from "@/lib/mock-data"

export const graphApi = {
  getGraph: async () => {
    try {
      const res = await apiClient.get("/graph/fraud-rings?minAccounts=2")
      return res.data
    } catch {
      return JSON.parse(JSON.stringify(mockGraphData))
    }
  },
}
