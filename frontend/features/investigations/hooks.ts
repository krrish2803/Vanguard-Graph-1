import { useQuery } from "@tanstack/react-query"
import { investigationsApi } from "./api"

export function useInvestigations() {
  return useQuery({
    queryKey: ["investigations"],
    queryFn: investigationsApi.list,
  })
}

export function useInvestigation(id: string) {
  return useQuery({
    queryKey: ["investigations", id],
    queryFn: () => investigationsApi.getById(id),
    enabled: !!id,
  })
}
