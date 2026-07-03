import apiClient from "@/lib/api-client"
import { mockInvestigations } from "@/lib/mock-data"
import type { Investigation } from "@/lib/mock-data"

export const investigationsApi = {
  list: async (): Promise<Investigation[]> => {
    try {
      const res = await apiClient.get("/investigations")
      return res.data
    } catch {
      return [...mockInvestigations]
    }
  },
  getById: async (id: string): Promise<Investigation | undefined> => {
    try {
      const res = await apiClient.get(`/investigations/${id}`)
      return res.data
    } catch {
      return mockInvestigations.find((i) => i.id === id)
    }
  },
}
