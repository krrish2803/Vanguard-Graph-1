import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AlertsService } from '../../../src/modules/alerts/alerts.service'
import { NotFoundError } from '../../../src/shared/errors'

const mockRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  updateStatus: vi.fn(),
}

const mockAlert = {
  id: 'alert-1',
  merchantId: 'cm-123',
  riskScore: 85,
  riskLevel: 'high' as const,
  status: 'open' as const,
  summary: 'Suspicious activity detected',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

describe('AlertsService', () => {
  let service: AlertsService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new AlertsService(mockRepository as any)
  })

  describe('getAlerts', () => {
    it('returns paginated alerts', async () => {
      const paginatedResult = {
        data: [mockAlert],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }
      mockRepository.findAll.mockResolvedValue(paginatedResult)

      const result = await service.getAlerts({ page: 1, limit: 20 })

      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 })
      expect(result).toEqual(paginatedResult)
    })

    it('passes filters to repository', async () => {
      const filters = {
        merchantId: 'cm-123',
        riskLevel: 'high' as const,
        status: 'open' as const,
        page: 1,
        limit: 10,
      }
      mockRepository.findAll.mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })

      await service.getAlerts(filters)

      expect(mockRepository.findAll).toHaveBeenCalledWith(filters)
    })
  })

  describe('getAlertById', () => {
    it('returns alert when found', async () => {
      mockRepository.findById.mockResolvedValue(mockAlert)

      const result = await service.getAlertById('alert-1')

      expect(mockRepository.findById).toHaveBeenCalledWith('alert-1')
      expect(result).toEqual(mockAlert)
    })

    it('throws NotFoundError when alert not found', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(service.getAlertById('nonexistent')).rejects.toThrow(NotFoundError)
    })
  })

  describe('updateAlertStatus', () => {
    it('updates alert status when alert exists', async () => {
      const dto = { status: 'under_review' as const }
      const updatedAlert = { ...mockAlert, status: 'under_review' as const }
      mockRepository.findById.mockResolvedValue(mockAlert)
      mockRepository.updateStatus.mockResolvedValue(updatedAlert)

      const result = await service.updateAlertStatus('alert-1', dto)

      expect(mockRepository.findById).toHaveBeenCalledWith('alert-1')
      expect(mockRepository.updateStatus).toHaveBeenCalledWith('alert-1', dto)
      expect(result.status).toBe('under_review')
    })

    it('throws NotFoundError when alert not found', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(service.updateAlertStatus('nonexistent', { status: 'resolved' })).rejects.toThrow(NotFoundError)
      expect(mockRepository.updateStatus).not.toHaveBeenCalled()
    })
  })
})
