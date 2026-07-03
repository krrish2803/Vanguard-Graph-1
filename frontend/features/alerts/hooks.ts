import { useQuery } from "@tanstack/react-query"
import { alertsApi } from "./api"
import type { AlertFilters } from "./types"

export function useAlerts(filters?: AlertFilters) {
  return useQuery({
    queryKey: ["alerts", filters],
    queryFn: () => alertsApi.list(filters),
  })
}

export function useAlert(id: string) {
  return useQuery({
    queryKey: ["alerts", id],
    queryFn: () => alertsApi.getById(id),
    enabled: !!id,
  })
}
