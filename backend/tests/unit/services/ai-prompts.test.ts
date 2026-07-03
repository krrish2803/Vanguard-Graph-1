import { describe, it, expect } from 'vitest'
import { buildRingSummaryPrompt } from '../../../src/services/ai/prompts/ring-summary.prompt'
import { buildNextActionPrompt } from '../../../src/services/ai/prompts/next-action.prompt'
import { buildRiskMemoPrompt } from '../../../src/services/ai/prompts/risk-memo.prompt'

describe('AI prompt templates', () => {
  describe('buildRingSummaryPrompt', () => {
    it('includes merchant and fraud ring data', () => {
      const prompt = buildRingSummaryPrompt({
        businessName: 'Test Biz',
        merchantId: 'm-001',
        fraudRingData: {
          sharedEntityId: 'FP-123',
          connectedAccounts: ['m-001', 'm-002'],
          accountCount: 2,
        },
      })
      expect(prompt).toContain('Test Biz')
      expect(prompt).toContain('m-001')
      expect(prompt).toContain('FP-123')
      expect(prompt).toContain('m-002')
      expect(prompt).toContain('fraud ring')
    })

    it('includes enrichment data when provided', () => {
      const prompt = buildRingSummaryPrompt({
        businessName: 'Biz',
        merchantId: 'm-1',
        fraudRingData: { sharedEntityId: 'FP-1', connectedAccounts: ['m-1'], accountCount: 1 },
        enrichment: { deviceRisk: { score: 85 } },
      })
      expect(prompt).toContain('deviceRisk')
      expect(prompt).toContain('85')
    })

    it('omits enrichment section when not provided', () => {
      const prompt = buildRingSummaryPrompt({
        businessName: 'Biz',
        merchantId: 'm-1',
        fraudRingData: { sharedEntityId: 'FP-1', connectedAccounts: ['m-1'], accountCount: 1 },
      })
      expect(prompt).not.toContain('Additional Enrichment')
    })
  })

  describe('buildNextActionPrompt', () => {
    it('includes risk data and asks for action', () => {
      const prompt = buildNextActionPrompt({
        businessName: 'Test Merchant',
        merchantId: 'm-001',
        riskScore: 78,
        riskLevel: 'high',
      })
      expect(prompt).toContain('Test Merchant')
      expect(prompt).toContain('78')
      expect(prompt).toContain('high')
      expect(prompt).toContain('APPROVE')
      expect(prompt).toContain('REVIEW')
      expect(prompt).toContain('BLOCK')
    })

    it('includes graph links when provided', () => {
      const prompt = buildNextActionPrompt({
        businessName: 'Biz',
        merchantId: 'm-1',
        riskScore: 50,
        riskLevel: 'medium',
        graphLinks: [{ fromId: 'm-1', toId: 'm-2', relationship: 'shared_device' }],
      })
      expect(prompt).toContain('shared_device')
    })
  })

  describe('buildRiskMemoPrompt', () => {
    it('includes all risk fields', () => {
      const prompt = buildRiskMemoPrompt({
        businessName: 'Acme Corp',
        merchantId: 'm-42',
        riskScore: 85,
        riskLevel: 'high',
      })
      expect(prompt).toContain('Acme Corp')
      expect(prompt).toContain('m-42')
      expect(prompt).toContain('85')
      expect(prompt).toContain('high')
      expect(prompt).toContain('risk memo')
    })

    it('includes enrichment and graph data when provided', () => {
      const prompt = buildRiskMemoPrompt({
        businessName: 'Biz',
        merchantId: 'm-1',
        riskScore: 60,
        riskLevel: 'medium',
        enrichmentData: { kycResult: 'failed' },
        graphData: { ringSize: 3 },
      })
      expect(prompt).toContain('kycResult')
      expect(prompt).toContain('ringSize')
    })
  })
})
