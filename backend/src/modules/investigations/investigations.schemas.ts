import { z } from 'zod'

export const CreateInvestigationSchema = z.object({
  merchantId: z.string().min(1, 'Merchant ID is required'),
})

export const UpdateInvestigationSchema = z.object({
  status: z.enum(['pending', 'ingesting', 'enriching', 'graph_linking', 'scoring', 'generating_memo', 'completed', 'failed']).optional(),
  riskScore: z.number().int().min(0).max(100).nullable().optional(),
  riskMemo: z.string().nullable().optional(),
})

export const InvestigationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  merchantId: z.string().optional(),
  status: z.enum(['pending', 'ingesting', 'enriching', 'graph_linking', 'scoring', 'generating_memo', 'completed', 'failed']).optional(),
})
