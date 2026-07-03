import apiClient from "@/lib/api-client"
import { mockAlerts } from "@/lib/mock-data"
import type { Alert } from "@/lib/mock-data"

export const alertsApi = {
  list: async (filters?: { riskLevel?: string; status?: string }): Promise<Alert[]> => {
    try {
      const res = await apiClient.get("/alerts")
      let data = res.data
      if (filters?.riskLevel) data = data.filter((a: any) => a.riskLevel === filters.riskLevel)
      if (filters?.status) data = data.filter((a: any) => a.status === filters.status)
      return data
    } catch {
      let filtered = [...mockAlerts]
      if (filters?.riskLevel) filtered = filtered.filter((a) => a.riskLevel === filters.riskLevel)
      if (filters?.status) filtered = filtered.filter((a) => a.status === filters.status)
      return filtered
    }
  },
  getById: async (id: string): Promise<Alert | undefined> => {
    try {
      const res = await apiClient.get(`/alerts/${id}`)
      return res.data
    } catch {
      return mockAlerts.find((a) => a.id === id)
    }
  },
}
