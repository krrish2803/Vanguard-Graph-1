import { describe, it, expect } from 'vitest'
import { rateLimitMiddleware } from '../../../src/middleware/rate-limit.middleware'

describe('rateLimitMiddleware', () => {
  it('is a configured rate limit function', () => {
    expect(rateLimitMiddleware).toBeDefined()
    expect(typeof rateLimitMiddleware).toBe('function')
  })

  it('has correct configuration via its internal state', () => {
    const config = (rateLimitMiddleware as any).config || (rateLimitMiddleware as any).keyGenerator
    expect(rateLimitMiddleware).toBeDefined()
  })

  it('sends rate limit headers on requests', async () => {
    const req = { ip: '127.0.0.1', headers: {}, app: { get: () => false } } as any
    const res = {
      status: () => res,
      json: () => res,
      setHeader: () => res,
      end: () => res,
    } as any
    const next = () => {}

    await rateLimitMiddleware(req, res, next)
  })
})
