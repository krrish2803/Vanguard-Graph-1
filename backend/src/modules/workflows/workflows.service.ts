import { WorkflowsRepository } from './workflows.repository'
import { WorkflowRun, WorkflowTriggerDTO, WorkflowQuery, WorkflowTriggerResponse } from './workflows.types'
import { WorkflowTrigger, WorkflowTriggerPayload } from '../../services/render/workflow-trigger'
import { NotFoundError } from '../../shared/errors'
import { logger } from '../../config/logger'

export class WorkflowsService {
  constructor(
    private repository: WorkflowsRepository,
    private workflowTrigger: WorkflowTrigger,
  ) {}

  async getWorkflowRuns(query: WorkflowQuery) {
    return this.repository.findAll(query)
  }

  async getWorkflowRunById(id: string): Promise<WorkflowRun> {
    const run = await this.repository.findById(id)
    if (!run) {
      throw new NotFoundError('WorkflowRun')
    }
    return run
  }

  async triggerWorkflow(merchantId: string, eventType: 'ONBOARDING', data: Record<string, unknown> = {}): Promise<WorkflowTriggerResponse> {
    logger.info('Triggering workflow', { merchantId, eventType })

    const triggerPayload: WorkflowTriggerPayload = {
      merchantId,
      eventType,
      data,
    }

    const renderDeploy = await this.workflowTrigger.trigger(triggerPayload)

    const dto: WorkflowTriggerDTO = {
      merchantId,
      workflowType: eventType,
      renderRunId: renderDeploy.deployId,
    }

    const workflowRun = await this.repository.create(dto)

    return {
      workflowRun,
      renderDeploy: {
        deployId: renderDeploy.deployId,
        status: renderDeploy.status,
      },
    }
  }

  async updateWorkflowStatus(id: string, status: string): Promise<WorkflowRun> {
    const run = await this.repository.findById(id)
    if (!run) {
      throw new NotFoundError('WorkflowRun')
    }
    return this.repository.updateStatus(id, status)
  }
}
