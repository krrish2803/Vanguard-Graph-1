import { describe, it, expect, vi } from 'vitest'
import { ZodError, z } from 'zod'
import { Prisma } from '@prisma/client'
import { errorMiddleware } from '../../../src/middleware/error.middleware'
import { AppError, NotFoundError } from '../../../src/shared/errors'

function createMocks() {
  const req = { method: 'GET', path: '/test', id: 'req-123' } as any
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  const next = vi.fn()
  return { req, res, next }
}

describe('errorMiddleware', () => {
  it('handles ZodError with 400 and field details', () => {
    const { req, res, next } = createMocks()
    const schema = z.object({ name: z.string().min(1) })
    let zodError: ZodError
    try { schema.parse({ name: '' }) } catch (e) { zodError = e as ZodError }

    errorMiddleware(zodError!, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: expect.any(String) }),
        ]),
      },
    })
  })

  it('handles Prisma P2002 conflict with 409', () => {
    const { req, res, next } = createMocks()
    const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '5.22.0',
    })

    errorMiddleware(prismaError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'A record with this value already exists',
      },
    })
  })

  it('handles AppError with custom status and code', () => {
    const { req, res, next } = createMocks()
    const appError = new NotFoundError('Merchant')

    errorMiddleware(appError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Merchant not found',
      },
    })
  })

  it('handles generic Error with 500', () => {
    const { req, res, next } = createMocks()
    const genericError = new Error('Something went wrong')

    errorMiddleware(genericError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    })
  })

  it('logs the error with request details', () => {
    const { req, res, next } = createMocks()
    const error = new Error('test error')
    errorMiddleware(error, req, res, next)
  })
})
