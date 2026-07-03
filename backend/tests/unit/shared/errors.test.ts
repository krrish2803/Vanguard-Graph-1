import { describe, it, expect } from 'vitest'
import { AppError, NotFoundError, ValidationError, ConflictError, UnauthorizedError } from '../../../src/shared/errors'

describe('AppError', () => {
  it('creates with statusCode, code, and message', () => {
    const err = new AppError(418, 'TEAPOT', "I'm a teapot")
    expect(err.statusCode).toBe(418)
    expect(err.code).toBe('TEAPOT')
    expect(err.message).toBe("I'm a teapot")
    expect(err.name).toBe('AppError')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('NotFoundError', () => {
  it('creates with 404 status and resource message', () => {
    const err = new NotFoundError('Merchant')
    expect(err.statusCode).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
    expect(err.message).toBe('Merchant not found')
    expect(err.name).toBe('NotFoundError')
    expect(err).toBeInstanceOf(AppError)
  })
})

describe('ValidationError', () => {
  it('creates with 400 status and custom message', () => {
    const err = new ValidationError('Invalid email format')
    expect(err.statusCode).toBe(400)
    expect(err.code).toBe('VALIDATION_ERROR')
    expect(err.message).toBe('Invalid email format')
    expect(err.name).toBe('ValidationError')
    expect(err).toBeInstanceOf(AppError)
  })
})

describe('ConflictError', () => {
  it('creates with 409 status and custom message', () => {
    const err = new ConflictError('Email already exists')
    expect(err.statusCode).toBe(409)
    expect(err.code).toBe('CONFLICT')
    expect(err.message).toBe('Email already exists')
    expect(err.name).toBe('ConflictError')
    expect(err).toBeInstanceOf(AppError)
  })
})

describe('UnauthorizedError', () => {
  it('creates with 401 status and default message', () => {
    const err = new UnauthorizedError()
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
    expect(err.message).toBe('Authentication required')
    expect(err.name).toBe('UnauthorizedError')
    expect(err).toBeInstanceOf(AppError)
  })
})
