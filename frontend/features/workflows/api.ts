import apiClient from "@/lib/api-client"
import { mockWorkflowRuns } from "@/lib/mock-data"
import type { WorkflowRun } from "@/lib/mock-data"

export const workflowsApi = {
  list: async (): Promise<WorkflowRun[]> => {
    try {
      const res = await apiClient.get("/workflows")
      return res.data
    } catch {
      return [...mockWorkflowRuns]
    }
  },
}
