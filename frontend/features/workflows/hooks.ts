import { useQuery } from "@tanstack/react-query"
import { workflowsApi } from "./api"

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: workflowsApi.list,
  })
}
