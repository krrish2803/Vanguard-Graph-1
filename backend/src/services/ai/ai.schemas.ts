import { z } from 'zod'
import { AIRequestSchema, MemoInputSchema } from './ai.types'

export { AIRequestSchema, MemoInputSchema }

export const GenerateTextSchema = AIRequestSchema.extend({
  model: z.string().default('nvidia/llama-3.1-nemotron-70b-instruct'),
  temperature: z.number().min(0).max(2).default(0.3),
  maxTokens: z.number().positive().default(1024),
})

export const GenerateMemoSchema = MemoInputSchema

export const AnalyzeFraudRingSchema = z.object({
  merchantIds: z.array(z.string()).min(1),
  fraudRingData: z.object({
    sharedEntityId: z.string(),
    connectedAccounts: z.array(z.string()),
    accountCount: z.number(),
  }),
})
