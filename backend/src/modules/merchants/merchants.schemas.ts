import { z } from 'zod';
import { MerchantCategory } from './merchants.types';

export const createMerchantSchema = z.object({
  merchantId: z.string().min(1, 'merchantId required'),
  name: z.string().min(1, 'name required'),
  category: z.nativeEnum(MerchantCategory),
  country: z.string().length(2, 'country must be a 2-letter ISO code'),
});

export const updateRiskSchema = z.object({
  flaggedDelta: z.number().int().nonnegative().optional(),
  totalDelta: z.number().int().nonnegative().optional(),
});

// TS types inko schema se hi infer kar le — single source of truth
export type CreateMerchantDto = z.infer<typeof createMerchantSchema>;
export type UpdateRiskDto = z.infer<typeof updateRiskSchema>;