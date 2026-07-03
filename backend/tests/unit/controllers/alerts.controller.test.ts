import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AlertsController } from '../../../src/modules/alerts/alerts.controller'

const mockService = {
  getAlerts: vi.fn(),
  getAlertById: vi.fn(),
  updateAlertStatus: vi.fn(),
}

const mockAlert = {
  id: 'alert-1',
  merchantId: 'cm-123',
  riskScore: 85,
  riskLevel: 'high',
  status: 'open',
  summary: 'Suspicious activity',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

function createMocks(body: any = {}, params: any = {}, query: any = {}) {
  const req = { body, params, query } as any
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  const next = vi.fn()
  return { req, res, next }
}

describe('AlertsController', () => {
  let controller: AlertsController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new AlertsController(mockService as any)
  })

  describe('getAlerts', () => {
    it('returns alerts with query params', async () => {
      const paginated = { data: [mockAlert], total: 1, page: 1, limit: 20, totalPages: 1 }
      mockService.getAlerts.mockResolvedValue(paginated)
      const { req, res, next } = createMocks({}, {}, { status: 'open' })

      await controller.getAlerts(req, res, next)

      expect(mockService.getAlerts).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ success: true, ...paginated })
    })

    it('calls next with error when service throws', async () => {
      const error = new Error('DB error')
      mockService.getAlerts.mockRejectedValue(error)
      const { req, res, next } = createMocks()

      await controller.getAlerts(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getAlertById', () => {
    it('returns alert when found', async () => {
      mockService.getAlertById.mockResolvedValue(mockAlert)
      const { req, res, next } = createMocks({}, { id: 'alert-1' })

      await controller.getAlertById(req, res, next)

      expect(mockService.getAlertById).toHaveBeenCalledWith('alert-1')
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockAlert })
    })

    it('calls next with error when not found', async () => {
      mockService.getAlertById.mockRejectedValue(new Error('Not found'))
      const { req, res, next } = createMocks({}, { id: 'nonexistent' })

      await controller.getAlertById(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('updateAlertStatus', () => {
    it('updates status successfully', async () => {
      const updated = { ...mockAlert, status: 'resolved' }
      mockService.updateAlertStatus.mockResolvedValue(updated)
      const { req, res, next } = createMocks({ status: 'resolved' }, { id: 'alert-1' })

      await controller.updateAlertStatus(req, res, next)

      expect(mockService.updateAlertStatus).toHaveBeenCalledWith('alert-1', { status: 'resolved' })
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updated })
    })

    it('calls next with error when service throws', async () => {
      mockService.updateAlertStatus.mockRejectedValue(new Error('Update failed'))
      const { req, res, next } = createMocks({ status: 'resolved' }, { id: 'alert-1' })

      await controller.updateAlertStatus(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })
})
