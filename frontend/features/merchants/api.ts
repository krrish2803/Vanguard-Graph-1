import apiClient from "@/lib/api-client"
import { mockMerchants } from "@/lib/mock-data"
import type { Merchant } from "@/lib/mock-data"

export const merchantsApi = {
  list: async (): Promise<Merchant[]> => {
    try {
      const res = await apiClient.get("/merchants")
      return res.data
    } catch {
      return [...mockMerchants]
    }
  },
  getById: async (id: string): Promise<Merchant | undefined> => {
    try {
      const res = await apiClient.get(`/merchants/${id}`)
      return res.data
    } catch {
      return mockMerchants.find((m) => m.id === id)
    }
  },
  create: async (data: Partial<Merchant>): Promise<Merchant> => {
    try {
      const res = await apiClient.post("/merchants", data)
      return res.data
    } catch {
      const newMerchant: Merchant = {
        id: `M-${String(mockMerchants.length + 1).padStart(3, "0")}`,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        deviceFingerprint: data.deviceFingerprint || "",
        ipAddress: data.ipAddress || "",
        bankAccountNumber: data.bankAccountNumber || "",
        bankAccountIfsc: data.bankAccountIfsc || "",
        status: "pending",
        riskScore: 0,
        riskLevel: "low",
        createdAt: new Date().toISOString(),
      }
      return newMerchant
    }
  },
}
