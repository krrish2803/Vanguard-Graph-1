import { RenderClient } from './render-client'
import { logger } from '../../config/logger'

export type WorkflowRunStatus = 'running' | 'succeeded' | 'failed' | 'canceled'

export interface WorkflowStatusResult {
  deployId: string
  status: WorkflowRunStatus
  finishedAt: string | null
}

export class WorkflowStatus {
  constructor(private client: RenderClient) {}

  async check(serviceId: string, deployId: string): Promise<WorkflowStatusResult> {
    logger.info('Checking workflow status', { serviceId, deployId })

    const result = await this.client.getDeployStatus(serviceId, deployId)

    return {
      deployId,
      status: this.normalizeStatus(result.status),
      finishedAt: result.finishedAt,
    }
  }

  private normalizeStatus(status: string): WorkflowRunStatus {
    const lower = status.toLowerCase()
    if (lower.includes('live') || lower.includes('build')) return 'running'
    if (lower.includes('success') || lower.includes('complete')) return 'succeeded'
    if (lower.includes('fail') || lower.includes('error')) return 'failed'
    if (lower.includes('cancel')) return 'canceled'
    return 'running'
  }
}
