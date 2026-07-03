import { AIProvider, AIRequest, AIResponse, MemoInput, MemoResult, AIProviderName } from './ai.types'
import { NvidiaProvider } from './providers/nvidia.provider'
import { MockAIProvider } from './providers/mock.provider'
import { buildRingSummaryPrompt } from './prompts/ring-summary.prompt'
import { buildNextActionPrompt } from './prompts/next-action.prompt'
import { buildRiskMemoPrompt } from './prompts/risk-memo.prompt'
import { applyInputGuardrails } from './ai.guardrails'
import { logger } from '../../config/logger'
import { env } from '../../config/env'

function createProvider(name?: AIProviderName): AIProvider {
  const resolved = name || (env.NVIDIA_API_KEY ? 'nvidia' : 'mock')
  switch (resolved) {
    case 'nvidia':
      return new NvidiaProvider()
    case 'mock':
      return new MockAIProvider()
    default:
      return new MockAIProvider()
  }
}

export class AIService {
  private provider: AIProvider

  constructor(provider?: AIProvider) {
    this.provider = provider ?? createProvider()
  }

  async generateText(request: AIRequest): Promise<AIResponse> {
    const guardrail = applyInputGuardrails(request)
    if (!guardrail.passed) {
      throw new Error(`AI request blocked by guardrails: ${guardrail.violations.join('; ')}`)
    }

    logger.info('AI text generation', { model: request.model, messageCount: request.messages.length })
    return this.provider.generate(request)
  }

  async generateMemo(input: MemoInput): Promise<MemoResult> {
    logger.info('AI memo generation', { type: input.type, merchantId: input.merchantId })

    let prompt: string
    switch (input.type) {
      case 'ring-summary':
        prompt = buildRingSummaryPrompt({
          businessName: input.businessName,
          merchantId: input.merchantId,
          fraudRingData: {
            sharedEntityId: (input.graphData as any)?.sharedEntityId ?? 'unknown',
            connectedAccounts: (input.graphData as any)?.connectedAccounts ?? [],
            accountCount: (input.graphData as any)?.accountCount ?? 0,
          },
          enrichment: input.enrichmentData as Record<string, unknown> | undefined,
        })
        break
      case 'next-action':
        prompt = buildNextActionPrompt({
          businessName: input.businessName,
          merchantId: input.merchantId,
          riskScore: input.riskScore,
          riskLevel: input.riskLevel,
          graphLinks: input.graphData as Record<string, unknown>[] | undefined,
          enrichment: input.enrichmentData as Record<string, unknown> | undefined,
        })
        break
      case 'risk-memo':
        prompt = buildRiskMemoPrompt({
          businessName: input.businessName,
          merchantId: input.merchantId,
          riskScore: input.riskScore,
          riskLevel: input.riskLevel,
          enrichmentData: input.enrichmentData as Record<string, unknown> | undefined,
          graphData: input.graphData as Record<string, unknown> | undefined,
        })
        break
    }

    const request: AIRequest = {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      maxTokens: 2048,
    }

    const response = await this.generateText(request)

    return {
      content: response.content,
      model: response.model,
      usage: response.usage,
    }
  }
}
