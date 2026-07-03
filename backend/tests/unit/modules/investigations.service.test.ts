import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InvestigationsService } from '../../../src/modules/investigations/investigations.service'
import { NotFoundError } from '../../../src/shared/errors'

const mockRepository = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  findByMerchantId: vi.fn(),
  update: vi.fn(),
}

const mockInvestigation = {
  id: 'inv-1',
  merchantId: 'm-1',
  status: 'pending',
  riskScore: null,
  riskMemo: null,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
}

describe('InvestigationsService', () => {
  let service: InvestigationsService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new InvestigationsService(mockRepository as any)
  })

  it('creates an investigation', async () => {
    mockRepository.create.mockResolvedValue(mockInvestigation)
    const result = await service.create({ merchantId: 'm-1' })
    expect(result).toEqual(mockInvestigation)
    expect(mockRepository.create).toHaveBeenCalledWith({ merchantId: 'm-1' })
  })

  it('finds all with query', async () => {
    const paginated = { data: [mockInvestigation], total: 1, page: 1, limit: 20 }
    mockRepository.findAll.mockResolvedValue(paginated)
    const result = await service.findAll({ page: 1, limit: 20 })
    expect(result).toEqual(paginated)
  })

  describe('findById', () => {
    it('returns investigation when found', async () => {
      mockRepository.findById.mockResolvedValue(mockInvestigation)
      const result = await service.findById('inv-1')
      expect(result).toEqual(mockInvestigation)
    })

    it('throws NotFoundError when not found', async () => {
      mockRepository.findById.mockResolvedValue(null)
      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundError)
    })
  })

  it('finds by merchant id', async () => {
    mockRepository.findByMerchantId.mockResolvedValue(mockInvestigation)
    const result = await service.findByMerchantId('m-1')
    expect(result).toEqual(mockInvestigation)
  })

  describe('update', () => {
    it('updates when investigation exists', async () => {
      mockRepository.findById.mockResolvedValue(mockInvestigation)
      mockRepository.update.mockResolvedValue({ ...mockInvestigation, status: 'completed' })
      const result = await service.update('inv-1', { status: 'completed' })
      expect(result.status).toBe('completed')
    })

    it('throws NotFoundError when not found', async () => {
      mockRepository.findById.mockResolvedValue(null)
      await expect(service.update('nonexistent', { status: 'completed' })).rejects.toThrow(NotFoundError)
    })
  })
})
