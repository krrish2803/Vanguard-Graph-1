import { describe, it, expect } from 'vitest'
import { GenerateTextSchema, GenerateMemoSchema, AnalyzeFraudRingSchema } from '../../../src/services/ai/ai.schemas'

describe('AI schemas', () => {
  describe('GenerateTextSchema', () => {
    it('accepts valid request with defaults', () => {
      const result = GenerateTextSchema.parse({
        messages: [{ role: 'user', content: 'Hello' }],
      })
      expect(result.messages).toHaveLength(1)
      expect(result.model).toBe('nvidia/llama-3.1-nemotron-70b-instruct')
      expect(result.temperature).toBe(0.3)
      expect(result.maxTokens).toBe(1024)
    })

    it('accepts custom model and params', () => {
      const result = GenerateTextSchema.parse({
        model: 'custom-model',
        messages: [{ role: 'user', content: 'Hi' }],
        temperature: 0.5,
        maxTokens: 512,
      })
      expect(result.model).toBe('custom-model')
      expect(result.temperature).toBe(0.5)
      expect(result.maxTokens).toBe(512)
    })

    it('rejects invalid temperature', () => {
      expect(() =>
        GenerateTextSchema.parse({
          messages: [{ role: 'user', content: 'Hi' }],
          temperature: 3,
        }),
      ).toThrow()
    })

    it('rejects negative maxTokens', () => {
      expect(() =>
        GenerateTextSchema.parse({
          messages: [{ role: 'user', content: 'Hi' }],
          maxTokens: -1,
        }),
      ).toThrow()
    })

    it('accepts empty messages array', () => {
      const result = GenerateTextSchema.parse({ messages: [] })
      expect(result.messages).toEqual([])
    })

    it('rejects invalid role', () => {
      expect(() =>
        GenerateTextSchema.parse({
          messages: [{ role: 'system', content: 'Hi' }],
        }),
      ).toThrow()
    })

    it('accepts assistant messages', () => {
      const result = GenerateTextSchema.parse({
        messages: [
          { role: 'user', content: 'Hi' },
          { role: 'assistant', content: 'Hello' },
        ],
      })
      expect(result.messages).toHaveLength(2)
    })
  })

  describe('GenerateMemoSchema', () => {
    it('accepts valid memo input', () => {
      const result = GenerateMemoSchema.parse({
        type: 'risk-memo',
        merchantId: 'm-1',
        businessName: 'Test Biz',
        riskScore: 75,
        riskLevel: 'high',
      })
      expect(result.type).toBe('risk-memo')
    })

    it('accepts optional enrichment data', () => {
      const result = GenerateMemoSchema.parse({
        type: 'ring-summary',
        merchantId: 'm-1',
        businessName: 'Test',
        riskScore: 50,
        riskLevel: 'medium',
        enrichmentData: { deviceRisk: { score: 80 } },
      })
      expect(result.enrichmentData).toEqual({ deviceRisk: { score: 80 } })
    })

    it('rejects invalid memo type', () => {
      expect(() =>
        GenerateMemoSchema.parse({
          type: 'invalid-type',
          merchantId: 'm-1',
          businessName: 'Test',
          riskScore: 50,
          riskLevel: 'medium',
        }),
      ).toThrow()
    })

    it('rejects missing required fields', () => {
      expect(() => GenerateMemoSchema.parse({})).toThrow()
    })
  })

  describe('AnalyzeFraudRingSchema', () => {
    it('accepts valid fraud ring data', () => {
      const result = AnalyzeFraudRingSchema.parse({
        merchantIds: ['m-1', 'm-2'],
        fraudRingData: {
          sharedEntityId: 'FP-123',
          connectedAccounts: ['m-1', 'm-2', 'm-3'],
          accountCount: 3,
        },
      })
      expect(result.merchantIds).toHaveLength(2)
    })

    it('rejects empty merchantIds', () => {
      expect(() =>
        AnalyzeFraudRingSchema.parse({
          merchantIds: [],
          fraudRingData: { sharedEntityId: 'x', connectedAccounts: [], accountCount: 0 },
        }),
      ).toThrow()
    })
  })
})
