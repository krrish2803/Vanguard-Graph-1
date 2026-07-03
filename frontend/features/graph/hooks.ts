import { useQuery } from "@tanstack/react-query"
import { graphApi } from "./api"

export function useGraphData() {
  return useQuery({
    queryKey: ["graph"],
    queryFn: graphApi.getGraph,
  })
}
