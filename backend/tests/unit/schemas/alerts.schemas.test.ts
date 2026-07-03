import { describe, it, expect } from 'vitest'
import { AlertQuerySchema, UpdateAlertStatusSchema } from '../../../src/modules/alerts/alerts.schemas'

describe('AlertQuerySchema', () => {
  it('provides defaults for empty query', () => {
    const result = AlertQuerySchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(20)
    }
  })

  it('accepts valid filters', () => {
    const result = AlertQuerySchema.safeParse({
      merchantId: 'cm-123',
      riskLevel: 'high',
      status: 'open',
      page: '2',
      limit: '50',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.merchantId).toBe('cm-123')
      expect(result.data.riskLevel).toBe('high')
      expect(result.data.status).toBe('open')
    }
  })

  it('rejects invalid riskLevel', () => {
    const result = AlertQuerySchema.safeParse({ riskLevel: 'extreme' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = AlertQuerySchema.safeParse({ status: 'deleted' })
    expect(result.success).toBe(false)
  })

  it('accepts valid date range', () => {
    const result = AlertQuerySchema.safeParse({
      dateFrom: '2025-01-01T00:00:00.000Z',
      dateTo: '2025-12-31T23:59:59.000Z',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid date format', () => {
    const result = AlertQuerySchema.safeParse({ dateFrom: 'not-a-date' })
    expect(result.success).toBe(false)
  })
})

describe('UpdateAlertStatusSchema', () => {
  it('accepts valid status change', () => {
    const result = UpdateAlertStatusSchema.safeParse({ status: 'under_review' })
    expect(result.success).toBe(true)
  })

  it('accepts status with optional note', () => {
    const result = UpdateAlertStatusSchema.safeParse({ status: 'resolved', note: 'Investigated and cleared' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = UpdateAlertStatusSchema.safeParse({ status: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('rejects note exceeding 500 chars', () => {
    const result = UpdateAlertStatusSchema.safeParse({ status: 'open', note: 'x'.repeat(501) })
    expect(result.success).toBe(false)
  })
})
