import { describe, it, expect, vi } from 'vitest'
import { requestIdMiddleware } from '../../../src/middleware/request-id.middleware'

describe('requestIdMiddleware', () => {
  it('assigns a UUID to req.id', () => {
    const req = {} as any
    const res = { setHeader: vi.fn() } as any
    const next = vi.fn()

    requestIdMiddleware(req, res, next)

    expect(req.id).toBeDefined()
    expect(typeof req.id).toBe('string')
    expect(req.id.length).toBeGreaterThan(0)
  })

  it('sets X-Request-ID header on response', () => {
    const req = {} as any
    const res = { setHeader: vi.fn() } as any
    const next = vi.fn()

    requestIdMiddleware(req, res, next)

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-ID', req.id)
  })

  it('calls next()', () => {
    const req = {} as any
    const res = { setHeader: vi.fn() } as any
    const next = vi.fn()

    requestIdMiddleware(req, res, next)

    expect(next).toHaveBeenCalledOnce()
  })

  it('generates unique IDs for consecutive requests', () => {
    const next = vi.fn()
    const req1 = {} as any
    const req2 = {} as any
    const res = { setHeader: vi.fn() } as any

    requestIdMiddleware(req1, res, next)
    requestIdMiddleware(req2, res, next)

    expect(req1.id).not.toBe(req2.id)
  })
})
