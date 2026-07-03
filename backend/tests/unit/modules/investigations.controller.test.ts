import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InvestigationsController } from '../../../src/modules/investigations/investigations.controller'

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

describe('InvestigationsController', () => {
  let controller: InvestigationsController
  let service: any
  let res: any

  beforeEach(() => {
    vi.clearAllMocks()
    service = { create: vi.fn(), findAll: vi.fn(), findById: vi.fn(), findByMerchantId: vi.fn(), update: vi.fn() }
    controller = new InvestigationsController(service)
    res = mockRes()
  })

  it('create: returns 201 with investigation', async () => {
    const inv = { id: 'inv-1', merchantId: 'm-1' }
    service.create.mockResolvedValue(inv)
    const req = mockReq({ body: { merchantId: 'm-1' } })
    await controller.create(req, res, mockNext)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: inv })
  })

  it('create: passes validation errors to next', async () => {
    const req = mockReq({ body: {} })
    await controller.create(req, res, mockNext)
    expect(mockNext).toHaveBeenCalled()
    expect(mockNext.mock.calls[0][0]).toBeInstanceOf(Error)
  })

  it('findAll: returns paginated results', async () => {
    const result = { data: [], total: 0, page: 1, limit: 20 }
    service.findAll.mockResolvedValue(result)
    const req = mockReq({ query: {} })
    await controller.findAll(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, ...result })
  })

  it('findById: returns investigation', async () => {
    const inv = { id: 'inv-1' }
    service.findById.mockResolvedValue(inv)
    const req = mockReq({ params: { id: 'inv-1' } })
    await controller.findById(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: inv })
  })

  it('findById: passes errors to next', async () => {
    service.findById.mockRejectedValue(new Error('not found'))
    const req = mockReq({ params: { id: 'bad' } })
    await controller.findById(req, res, mockNext)
    expect(mockNext).toHaveBeenCalledWith(new Error('not found'))
  })

  it('findByMerchantId: returns investigation when found', async () => {
    const inv = { id: 'inv-1', merchantId: 'm-1' }
    service.findByMerchantId.mockResolvedValue(inv)
    const req = mockReq({ params: { merchantId: 'm-1' } })
    await controller.findByMerchantId(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: inv })
  })

  it('findByMerchantId: returns null when not found', async () => {
    service.findByMerchantId.mockResolvedValue(null)
    const req = mockReq({ params: { merchantId: 'none' } })
    await controller.findByMerchantId(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: null })
  })

  it('update: updates and returns investigation', async () => {
    const inv = { id: 'inv-1', status: 'completed' }
    service.update.mockResolvedValue(inv)
    const req = mockReq({ params: { id: 'inv-1' }, body: { status: 'completed' } })
    await controller.update(req, res, mockNext)
    expect(res.json).toHaveBeenCalledWith({ success: true, data: inv })
  })
})
