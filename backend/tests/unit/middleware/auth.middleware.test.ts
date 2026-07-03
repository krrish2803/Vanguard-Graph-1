import { describe, it, expect, vi } from 'vitest'
import { authMiddleware } from '../../../src/middleware/auth.middleware'

vi.mock('../../../src/config/env', () => ({
  env: { JWT_SECRET: 'test-secret-key' },
}))

function createMocks(path: string) {
  const req = {
    path,
    headers: {},
  } as any
  const res = {} as any
  const next = vi.fn()
  return { req, res, next }
}

describe('authMiddleware', () => {
  it('skips auth for /health route', () => {
    const { req, res, next } = createMocks('/api/v1/health')

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(next).toHaveBeenCalledWith()
  })

  it('calls next with UnauthorizedError when no auth header', () => {
    const { req, res, next } = createMocks('/api/v1/investigations')

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    const error = next.mock.calls[0][0]
    expect(error.statusCode).toBe(401)
    expect(error.code).toBe('UNAUTHORIZED')
  })

  it('calls next with UnauthorizedError when auth header is not Bearer', () => {
    const { req, res, next } = createMocks('/api/v1/investigations')
    req.headers.authorization = 'Basic some-token'

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    const error = next.mock.calls[0][0]
    expect(error.statusCode).toBe(401)
  })

  it('calls next with UnauthorizedError when token is missing after Bearer', () => {
    const { req, res, next } = createMocks('/api/v1/investigations')
    req.headers.authorization = 'Bearer '

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    const error = next.mock.calls[0][0]
    expect(error.statusCode).toBe(401)
  })

  it('calls next with UnauthorizedError for invalid token', () => {
    const { req, res, next } = createMocks('/api/v1/investigations')
    req.headers.authorization = 'Bearer invalid-token'

    authMiddleware(req, res, next)

    const error = next.mock.calls[0][0]
    expect(error.statusCode).toBe(401)
  })

  it('sets req.user when token is valid', () => {
    const { req, res, next } = createMocks('/api/v1/investigations')
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({ id: 'user-1', role: 'analyst' }, 'test-secret-key')
    req.headers.authorization = `Bearer ${token}`

    authMiddleware(req, res, next)

    expect(next).toHaveBeenCalledWith()
    expect(req.user).toBeDefined()
    expect(req.user!.id).toBe('user-1')
    expect(req.user!.role).toBe('analyst')
  })
})
