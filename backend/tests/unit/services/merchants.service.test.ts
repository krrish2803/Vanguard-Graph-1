import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MerchantsService } from '../../../src/modules/merchants/merchants.service'
import { ConflictError, NotFoundError } from '../../../src/shared/errors'

const mockRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
}

const validDTO = {
  name: 'Test Merchant',
  email: 'test@example.com',
  phone: '1234567890',
  deviceFingerprint: 'FP-ABC-123',
  ipAddress: '192.168.1.1',
  bankAccountNumber: '1234567890',
  bankAccountIfsc: 'HDFC0001234',
}

const mockMerchant = {
  id: 'cm-123',
  ...validDTO,
  status: 'pending' as const,
  riskScore: 0,
  riskLevel: 'low' as const,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

describe('MerchantsService', () => {
  let service: MerchantsService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new MerchantsService(mockRepository as any)
  })

  describe('createMerchant', () => {
    it('creates a merchant successfully', async () => {
      mockRepository.findByEmail.mockResolvedValue(null)
      mockRepository.create.mockResolvedValue(mockMerchant)

      const result = await service.createMerchant(validDTO)

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com')
      expect(mockRepository.create).toHaveBeenCalledWith(validDTO)
      expect(result).toEqual(mockMerchant)
    })

    it('throws ConflictError when email already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue(mockMerchant)

      await expect(service.createMerchant(validDTO)).rejects.toThrow(ConflictError)
      expect(mockRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('getMerchants', () => {
    it('returns paginated merchants', async () => {
      const paginatedResult = {
        data: [mockMerchant],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      }
      mockRepository.findAll.mockResolvedValue(paginatedResult)

      const result = await service.getMerchants({ page: 1, limit: 20 })

      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 20 })
      expect(result).toEqual(paginatedResult)
    })
  })

  describe('getMerchantById', () => {
    it('returns merchant when found', async () => {
      mockRepository.findById.mockResolvedValue(mockMerchant)

      const result = await service.getMerchantById('cm-123')

      expect(mockRepository.findById).toHaveBeenCalledWith('cm-123')
      expect(result).toEqual(mockMerchant)
    })

    it('throws NotFoundError when not found', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(service.getMerchantById('nonexistent')).rejects.toThrow(NotFoundError)
    })
  })

  describe('updateMerchant', () => {
    it('updates merchant when found', async () => {
      const updateData = { name: 'Updated Name' }
      const updatedMerchant = { ...mockMerchant, name: 'Updated Name' }
      mockRepository.findById.mockResolvedValue(mockMerchant)
      mockRepository.update.mockResolvedValue(updatedMerchant)

      const result = await service.updateMerchant('cm-123', updateData)

      expect(mockRepository.findById).toHaveBeenCalledWith('cm-123')
      expect(mockRepository.update).toHaveBeenCalledWith('cm-123', updateData)
      expect(result).toEqual(updatedMerchant)
    })

    it('throws NotFoundError when merchant not found for update', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(service.updateMerchant('nonexistent', { name: 'X' })).rejects.toThrow(NotFoundError)
      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('triggerPayoutChange', () => {
    const payoutData = {
      newBankAccountNumber: '9988776655',
      newBankAccountIfsc: 'ICIC0001234',
      reason: 'Upgraded to business account',
    }

    it('updates bank account details and returns merchant', async () => {
      mockRepository.findById.mockResolvedValue(mockMerchant)
      mockRepository.update.mockResolvedValue({
        ...mockMerchant,
        bankAccountNumber: '9988776655',
        bankAccountIfsc: 'ICIC0001234',
      })

      const result = await service.triggerPayoutChange('cm-123', payoutData)

      expect(mockRepository.findById).toHaveBeenCalledWith('cm-123')
      expect(mockRepository.update).toHaveBeenCalledWith('cm-123', {
        bankAccountNumber: '9988776655',
        bankAccountIfsc: 'ICIC0001234',
      })
      expect(result.bankAccountNumber).toBe('9988776655')
      expect(result.bankAccountIfsc).toBe('ICIC0001234')
    })

    it('throws NotFoundError when merchant not found', async () => {
      mockRepository.findById.mockResolvedValue(null)

      await expect(service.triggerPayoutChange('nonexistent', payoutData)).rejects.toThrow(NotFoundError)
      expect(mockRepository.update).not.toHaveBeenCalled()
    })
  })
})
