import { Request, Response, NextFunction } from 'express'
import { WorkflowsService } from './workflows.service'
import { z } from 'zod'

const TriggerWorkflowSchema = z.object({
  merchantId: z.string(),
  eventType: z.enum(['ONBOARDING']),
  data: z.record(z.unknown()).optional(),
})

const WorkflowQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  merchantId: z.string().optional(),
  workflowType: z.enum(['ONBOARDING']).optional(),
  status: z.enum(['running', 'succeeded', 'failed', 'canceled']).optional(),
})

const UpdateStatusSchema = z.object({
  status: z.string(),
})

export class WorkflowsController {
  constructor(private service: WorkflowsService) {}

  getWorkflowRuns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = WorkflowQuerySchema.parse(req.query)
      const result = await this.service.getWorkflowRuns(query)
      res.json({ success: true, ...result })
    } catch (err) {
      next(err)
    }
  }

  getWorkflowRunById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const run = await this.service.getWorkflowRunById(req.params.id as string)
      res.json({ success: true, data: run })
    } catch (err) {
      next(err)
    }
  }

  triggerWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = TriggerWorkflowSchema.parse(req.body)
      const result = await this.service.triggerWorkflow(body.merchantId, body.eventType, body.data)
      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }

  updateWorkflowStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status } = UpdateStatusSchema.parse(req.body)
      const run = await this.service.updateWorkflowStatus(req.params.id as string, status)
      res.json({ success: true, data: run })
    } catch (err) {
      next(err)
    }
  }
}
