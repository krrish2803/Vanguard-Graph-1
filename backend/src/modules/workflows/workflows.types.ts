import { WorkflowTriggerPayload } from '../../services/render/workflow-trigger'

export type WorkflowType = 'ONBOARDING'
export type WorkflowRunStatus = 'running' | 'succeeded' | 'failed' | 'canceled'

export interface WorkflowRun {
  id: string
  merchantId: string
  workflowType: WorkflowType
  status: WorkflowRunStatus
  renderRunId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowTriggerDTO {
  merchantId: string
  workflowType: WorkflowType
  renderRunId?: string
}

export interface WorkflowQuery {
  page?: number
  limit?: number
  merchantId?: string
  workflowType?: WorkflowType
  status?: WorkflowRunStatus
}

export interface WorkflowTriggerResponse {
  workflowRun: WorkflowRun
  renderDeploy: {
    deployId: string
    status: string
  }
}

export type { WorkflowTriggerPayload }
