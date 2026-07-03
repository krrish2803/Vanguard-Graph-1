import { describe, it, expect } from 'vitest'
import { CreateInvestigationSchema, UpdateInvestigationSchema, InvestigationQuerySchema } from '../../../src/modules/investigations/investigations.schemas'

describe('Investigations schemas', () => {
  describe('CreateInvestigationSchema', () => {
    it('accepts valid input', () => {
      const result = CreateInvestigationSchema.parse({ merchantId: 'cm-123' })
      expect(result.merchantId).toBe('cm-123')
    })

    it('rejects empty merchantId', () => {
      expect(() => CreateInvestigationSchema.parse({ merchantId: '' })).toThrow()
    })

    it('rejects missing merchantId', () => {
      expect(() => CreateInvestigationSchema.parse({})).toThrow()
    })
  })

  describe('UpdateInvestigationSchema', () => {
    it('accepts status update', () => {
      const result = UpdateInvestigationSchema.parse({ status: 'completed' })
      expect(result.status).toBe('completed')
    })

    it('accepts riskScore update', () => {
      const result = UpdateInvestigationSchema.parse({ riskScore: 85 })
      expect(result.riskScore).toBe(85)
    })

    it('accepts null riskScore', () => {
      const result = UpdateInvestigationSchema.parse({ riskScore: null })
      expect(result.riskScore).toBeNull()
    })

    it('rejects invalid status', () => {
      expect(() => UpdateInvestigationSchema.parse({ status: 'invalid' })).toThrow()
    })

    it('rejects riskScore out of range', () => {
      expect(() => UpdateInvestigationSchema.parse({ riskScore: -1 })).toThrow()
      expect(() => UpdateInvestigationSchema.parse({ riskScore: 101 })).toThrow()
    })

    it('accepts empty update', () => {
      const result = UpdateInvestigationSchema.parse({})
      expect(result).toEqual({})
    })
  })

  describe('InvestigationQuerySchema', () => {
    it('applies defaults', () => {
      const result = InvestigationQuerySchema.parse({})
      expect(result.page).toBe(1)
      expect(result.limit).toBe(20)
    })

    it('accepts status filter', () => {
      const result = InvestigationQuerySchema.parse({ status: 'completed' })
      expect(result.status).toBe('completed')
    })

    it('rejects invalid status filter', () => {
      expect(() => InvestigationQuerySchema.parse({ status: 'bogus' })).toThrow()
    })

    it('coerces string page to number', () => {
      const result = InvestigationQuerySchema.parse({ page: '3' })
      expect(result.page).toBe(3)
    })
  })
})
