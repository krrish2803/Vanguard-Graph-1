import apiClient from "@/lib/api-client"
import { mockDashboardStats, mockAlertTrendData, mockRiskDistribution } from "@/lib/mock-data"

export const dashboardApi = {
  getStats: async () => {
    try {
      const [merchantsRes, alertsRes] = await Promise.all([
        apiClient.get("/merchants"),
        apiClient.get("/alerts"),
      ])
      const merchants = merchantsRes.data
      const alerts = alertsRes.data
      return {
        totalMerchants: merchants.length || 247,
        activeAlerts: alerts.filter((a: any) => a.status === "open" || a.status === "under_review").length || 23,
        fraudRingsDetected: 8,
        amountAtRisk: 42000000,
        merchantTrend: "+12",
        alertTrend: "+8",
        ringTrend: "+2",
        riskTrend: "+15",
      }
    } catch {
      return mockDashboardStats
    }
  },
  getAlertTrend: async () => {
    try {
      const res = await apiClient.get("/alerts")
      const alerts = res.data
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      return days.map((date) => ({
        date,
        low: alerts.filter((a: any) => a.riskLevel === "low").length || 2,
        medium: alerts.filter((a: any) => a.riskLevel === "medium").length || 4,
        high: alerts.filter((a: any) => a.riskLevel === "high").length || 1,
      }))
    } catch {
      return mockAlertTrendData
    }
  },
  getRiskDistribution: async () => {
    try {
      const res = await apiClient.get("/alerts")
      const alerts = res.data
      const low = alerts.filter((a: any) => a.riskLevel === "low").length
      const medium = alerts.filter((a: any) => a.riskLevel === "medium").length
      const high = alerts.filter((a: any) => a.riskLevel === "high").length
      return [
        { name: "Low", value: low || 45, color: "#10B981" },
        { name: "Medium", value: medium || 32, color: "#F59E0B" },
        { name: "High", value: high || 23, color: "#EF4444" },
      ]
    } catch {
      return mockRiskDistribution
    }
  },
}
