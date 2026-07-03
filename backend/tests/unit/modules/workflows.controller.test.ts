import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WorkflowsController } from '../../../src/modules/workflows/workflows.controller'

function mockReq(overrides: Record<string, any> = {}) {
  return {
    body: {},
    query: {},
    params: {},
    ...overrides,
  } as any
}
const mockRes = () => {
  const res: any = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}
const mockNext = vi.fn()

describe('WorkflowsController', () => {
  let controller: WorkflowsController
  let service: any
  let res: any

  beforeEach(() => {
    vi.clearAllMocks()
    service = { getWorkflowRuns: vi.fn(), getWorkflowRunById: vi.fn(), triggerWorkflow: vi.fn(), updateWorkflowStatus: vi.fn() }
    controller = new WorkflowsController(service)
    res = mockRes()
  })

  it('triggerWorkflow: returns 201 with result', async () => {
    const result = { workflowRun: { id: 'wf-1' }, renderDeploy: { deployId: 'dep-1', status: 'live' } }
    service.triggerWorkflow.mockResolvedValue(result)
    const req = mockReq({ body: { merchantId: 'm-1', eventType: 'ONBOARDING' } })
    await controller.triggerWorkflow(req, res, mockNext)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: result })
  })

  it('triggerWorkflow: passes validation errors to next', async () => {
    const req = mockReq({ body: {} })
    await controller.triggerWorkflow(req, res, mockNext)
    expect(mockNext).toHaveBeenCalled()
    expect(mockNext.mock.calls[0][0]).toBeInstanceOf(Error)
  })

  it('triggerWorkflow: rejects invalid eventType', async () => {
    const req = mockReq({ body: { merchantId: 'm-1', eventType: 'PAYOUT_CHANGE' } })
    await controller.triggerWorkflow(req, res, mockNext)
    expect(mockNext).toHaveBeenCalled()
  })

  it('getWorkflowRuns: returns paginated runs', async () => {
    const result = { data: [], total: 0, page: 1, limit: 20 }
    service.getWorkflowRuns.mockResolvedValue(result)
    const req = mockReq({ query: {} })
    await controller.getWorkflowRuns(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, ...result })
  })

  it('getWorkflowRunById: returns run', async () => {
    const run = { id: 'wf-1' }
    service.getWorkflowRunById.mockResolvedValue(run)
    const req = mockReq({ params: { id: 'wf-1' } })
    await controller.getWorkflowRunById(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: run })
  })

  it('updateWorkflowStatus: updates and returns run', async () => {
    const run = { id: 'wf-1', status: 'succeeded' }
    service.updateWorkflowStatus.mockResolvedValue(run)
    const req = mockReq({ params: { id: 'wf-1' }, body: { status: 'succeeded' } })
    await controller.updateWorkflowStatus(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: run })
  })
})
