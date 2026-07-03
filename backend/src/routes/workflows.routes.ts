import { Router } from 'express'
import { WorkflowsController } from '../modules/workflows/workflows.controller'
import { WorkflowsService } from '../modules/workflows/workflows.service'
import { WorkflowsRepository } from '../modules/workflows/workflows.repository'
import { RenderClient } from '../services/render/render-client'
import { WorkflowTrigger } from '../services/render/workflow-trigger'

const repository = new WorkflowsRepository()
const renderClient = new RenderClient()
const workflowTrigger = new WorkflowTrigger(renderClient)
const service = new WorkflowsService(repository, workflowTrigger)
const controller = new WorkflowsController(service)

const router = Router()

router.post('/trigger', controller.triggerWorkflow)
router.get('/', controller.getWorkflowRuns)
router.get('/:id', controller.getWorkflowRunById)
router.patch('/:id/status', controller.updateWorkflowStatus)

export default router
