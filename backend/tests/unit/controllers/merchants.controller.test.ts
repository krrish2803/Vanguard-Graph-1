import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MerchantsController } from '../../../src/modules/merchants/merchants.controller'

const mockService = {
  createMerchant: vi.fn(),
  getMerchants: vi.fn(),
  getMerchantById: vi.fn(),
  updateMerchant: vi.fn(),
  triggerPayoutChange: vi.fn(),
}

const mockMerchant = {
  id: 'cm-123',
  name: 'Test Merchant',
  email: 'test@example.com',
  phone: '1234567890',
  deviceFingerprint: 'FP-ABC-123',
  ipAddress: '192.168.1.1',
  bankAccountNumber: '1234567890',
  bankAccountIfsc: 'HDFC0001234',
  status: 'pending',
  riskScore: 0,
  riskLevel: 'low',
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

describe('MerchantsController', () => {
  let controller: MerchantsController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new MerchantsController(mockService as any)
  })

  describe('createMerchant', () => {
    const validBody = {
      name: 'Test Merchant',
      email: 'test@example.com',
      phone: '1234567890',
      deviceFingerprint: 'FP-ABC-123',
      ipAddress: '192.168.1.1',
      bankAccountNumber: '1234567890',
      bankAccountIfsc: 'HDFC0001234',
    }

    it('returns 201 with merchant on success', async () => {
      mockService.createMerchant.mockResolvedValue(mockMerchant)
      const { req, res, next } = createMocks(validBody)

      await controller.createMerchant(req, res, next)

      expect(mockService.createMerchant).toHaveBeenCalledWith(validBody)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockMerchant })
    })

    it('calls next with error when service throws', async () => {
      const error = new Error('DB error')
      mockService.createMerchant.mockRejectedValue(error)
      const { req, res, next } = createMocks(validBody)

      await controller.createMerchant(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getMerchants', () => {
    it('returns merchant list with query defaults', async () => {
      const paginated = { data: [mockMerchant], total: 1, page: 1, limit: 20, totalPages: 1 }
      mockService.getMerchants.mockResolvedValue(paginated)
      const { req, res, next } = createMocks({}, {}, {})

      await controller.getMerchants(req, res, next)

      expect(mockService.getMerchants).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ success: true, ...paginated })
    })
  })

  describe('getMerchantById', () => {
    it('returns merchant when found', async () => {
      mockService.getMerchantById.mockResolvedValue(mockMerchant)
      const { req, res, next } = createMocks({}, { id: 'cm-123' })

      await controller.getMerchantById(req, res, next)

      expect(mockService.getMerchantById).toHaveBeenCalledWith('cm-123')
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockMerchant })
    })

    it('calls next with error when not found', async () => {
      const error = new Error('Not found')
      mockService.getMerchantById.mockRejectedValue(error)
      const { req, res, next } = createMocks({}, { id: 'nonexistent' })

      await controller.getMerchantById(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('updateMerchant', () => {
    it('updates and returns merchant', async () => {
      const updateData = { name: 'Updated' }
      const updated = { ...mockMerchant, name: 'Updated' }
      mockService.updateMerchant.mockResolvedValue(updated)
      const { req, res, next } = createMocks(updateData, { id: 'cm-123' })

      await controller.updateMerchant(req, res, next)

      expect(mockService.updateMerchant).toHaveBeenCalledWith('cm-123', updateData)
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updated })
    })
  })

  describe('triggerPayoutChange', () => {
    const payoutBody = {
      newBankAccountNumber: '9988776655',
      newBankAccountIfsc: 'ICIC0001234',
      reason: 'Business upgrade',
    }

    it('triggers payout change and returns merchant', async () => {
      const updated = { ...mockMerchant, bankAccountNumber: '9988776655', bankAccountIfsc: 'ICIC0001234' }
      mockService.triggerPayoutChange.mockResolvedValue(updated)
      const { req, res, next } = createMocks(payoutBody, { id: 'cm-123' })

      await controller.triggerPayoutChange(req, res, next)

      expect(mockService.triggerPayoutChange).toHaveBeenCalledWith('cm-123', payoutBody)
      expect(res.json).toHaveBeenCalledWith({ success: true, data: updated })
    })
  })
})
