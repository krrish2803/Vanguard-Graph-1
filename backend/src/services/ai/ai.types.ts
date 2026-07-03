import { z } from 'zod'

export type AIProviderName = 'nvidia' | 'mock'

export interface AIRequest {
  model?: string
  systemPrompt?: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  temperature?: number
  maxTokens?: number
}

export interface AIResponse {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface AIProvider {
  readonly name: AIProviderName
  generate(request: AIRequest): Promise<AIResponse>
}

export type MemoType = 'ring-summary' | 'next-action' | 'risk-memo'

export interface MemoInput {
  type: MemoType
  merchantId: string
  businessName: string
  riskScore: number
  riskLevel: string
  enrichmentData?: Record<string, unknown>
  graphData?: Record<string, unknown>
}

export interface MemoResult {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface GuardrailResult {
  passed: boolean
  violations: string[]
}

export const AIRequestSchema = z.object({
  model: z.string().optional(),
  systemPrompt: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
})

export const MemoInputSchema: z.ZodType<MemoInput> = z.object({
  type: z.enum(['ring-summary', 'next-action', 'risk-memo']),
  merchantId: z.string(),
  businessName: z.string(),
  riskScore: z.number(),
  riskLevel: z.string(),
  enrichmentData: z.record(z.unknown()).optional(),
  graphData: z.record(z.unknown()).optional(),
})
