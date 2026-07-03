import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "./api"

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getStats,
  })
}

export function useAlertTrend() {
  return useQuery({
    queryKey: ["dashboard", "alert-trend"],
    queryFn: dashboardApi.getAlertTrend,
  })
}

export function useRiskDistribution() {
  return useQuery({
    queryKey: ["dashboard", "risk-distribution"],
    queryFn: dashboardApi.getRiskDistribution,
  })
}
