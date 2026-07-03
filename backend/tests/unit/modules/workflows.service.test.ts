import { describe, it, expect, vi, beforeEach } from 'vitest'
import { WorkflowsService } from '../../../src/modules/workflows/workflows.service'
import { WorkflowsRepository } from '../../../src/modules/workflows/workflows.repository'
import { WorkflowTrigger } from '../../../src/services/render/workflow-trigger'
import { NotFoundError } from '../../../src/shared/errors'

vi.mock('../../../src/config/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

vi.mock('../../../src/config/postgres', () => ({
  prismaClient: {
    workflowRun: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
  },
  getPrismaClient: vi.fn().mockResolvedValue({}),
}))

const mockRenderTrigger = {
  trigger: vi.fn(),
}

const mockWorkflowRun = {
  id: 'wr-001',
  merchantId: 'M-001',
  workflowType: 'ONBOARDING',
  status: 'running',
  renderRunId: 'dep-123',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

describe('WorkflowsService', () => {
  let service: WorkflowsService
  let repository: WorkflowsRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repository = new WorkflowsRepository()
    service = new WorkflowsService(repository, mockRenderTrigger as unknown as WorkflowTrigger)
  })

  describe('getWorkflowRuns', () => {
    it('returns paginated workflow runs', async () => {
      const { prismaClient } = await import('../../../src/config/postgres')
      vi.mocked(prismaClient.workflowRun.findMany).mockResolvedValue([mockWorkflowRun] as any)
      vi.mocked(prismaClient.workflowRun.count).mockResolvedValue(1)

      const result = await service.getWorkflowRuns({ page: 1, limit: 20 })

      expect(result.data).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })

  describe('getWorkflowRunById', () => {
    it('returns workflow run when found', async () => {
      const { prismaClient } = await import('../../../src/config/postgres')
      vi.mocked(prismaClient.workflowRun.findUnique).mockResolvedValue(mockWorkflowRun as any)

      const result = await service.getWorkflowRunById('wr-001')

      expect(result.id).toBe('wr-001')
    })

    it('throws NotFoundError when not found', async () => {
      const { prismaClient } = await import('../../../src/config/postgres')
      vi.mocked(prismaClient.workflowRun.findUnique).mockResolvedValue(null)

      await expect(service.getWorkflowRunById('nonexistent')).rejects.toThrow(NotFoundError)
    })
  })

  describe('triggerWorkflow', () => {
    it('triggers a workflow and creates a run record', async () => {
      const { prismaClient } = await import('../../../src/config/postgres')
      mockRenderTrigger.trigger.mockResolvedValue({ deployId: 'dep-123', status: 'live', url: 'https://example.com' })
      vi.mocked(prismaClient.workflowRun.create).mockResolvedValue(mockWorkflowRun as any)

      const result = await service.triggerWorkflow('M-001', 'ONBOARDING', { name: 'Test' })

      expect(result.workflowRun.id).toBe('wr-001')
      expect(result.renderDeploy.deployId).toBe('dep-123')
      expect(mockRenderTrigger.trigger).toHaveBeenCalledWith({
        merchantId: 'M-001',
        eventType: 'ONBOARDING',
        data: { name: 'Test' },
      })
    })
  })

  describe('updateWorkflowStatus', () => {
    it('updates status when run exists', async () => {
      const { prismaClient } = await import('../../../src/config/postgres')
      vi.mocked(prismaClient.workflowRun.findUnique).mockResolvedValue(mockWorkflowRun as any)
      vi.mocked(prismaClient.workflowRun.update).mockResolvedValue({ ...mockWorkflowRun, status: 'succeeded' } as any)

      const result = await service.updateWorkflowStatus('wr-001', 'succeeded')

      expect(result.status).toBe('succeeded')
    })

    it('throws NotFoundError when run does not exist', async () => {
      const { prismaClient } = await import('../../../src/config/postgres')
      vi.mocked(prismaClient.workflowRun.findUnique).mockResolvedValue(null)

      await expect(service.updateWorkflowStatus('nonexistent', 'succeeded')).rejects.toThrow(NotFoundError)
    })
  })
})
