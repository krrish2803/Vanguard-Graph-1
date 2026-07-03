import { AIProvider, AIRequest, AIResponse } from '../ai.types'

const MOCK_RESPONSES: Record<string, string> = {
  'ring-summary': `## Fraud Ring Analysis
- **Ring Size**: 3 connected accounts
- **Shared Entity**: Device FP-DEMO-001
- **Risk Level**: HIGH
- **Pattern**: Multiple merchants sharing the same device fingerprint indicates organized fraud.
- **Recommendation**: Flag all accounts for manual review and block further onboarding from this device.`,
  'next-action': `## Recommended Action: REVIEW
**Risk Score**: 85/100
**Rationale**: The merchant exhibits multiple risk indicators including device reuse and disposable email. While not an automatic block, these patterns warrant human investigation before approval.
**Suggested Steps**:
1. Verify business documentation
2. Contact the applicant for additional identity verification
3. Cross-reference with known fraud rings`,
  'risk-memo': `## Risk Assessment Memo
**Merchant**: Test Business
**Overall Risk**: HIGH (Score: 78)
**Key Findings**:
- Device fingerprint linked to 3 other merchants
- Email domain identified as disposable
- KYC verification flagged watchlist hit
**Conclusion**: This merchant presents elevated risk and should be flagged for enhanced due diligence.`,
}

const MATCH_PATTERNS: [RegExp, string][] = [
  [/fraud ring|ring.summary|potential fraud ring/i, 'ring-summary'],
  [/next.action|recommended action|approve|review|block/i, 'next-action'],
  [/risk[-\s]?memo|risk assessment|compliance officer/i, 'risk-memo'],
]

export class MockAIProvider implements AIProvider {
  readonly name = 'mock' as const

  async generate(request: AIRequest): Promise<AIResponse> {
    const userMsg = request.messages.find(m => m.role === 'user')?.content ?? ''
    const matchedKey = MATCH_PATTERNS.find(([re]) => re.test(userMsg))?.[1]
    const content = matchedKey ? MOCK_RESPONSES[matchedKey] : 'Mock AI response: No concerns identified.'

    await new Promise(r => setTimeout(r, 50))

    return {
      content,
      model: 'mock-model',
      usage: {
        promptTokens: request.messages.length * 10,
        completionTokens: content.split(' ').length,
        totalTokens: request.messages.length * 10 + content.split(' ').length,
      },
    }
  }
}
