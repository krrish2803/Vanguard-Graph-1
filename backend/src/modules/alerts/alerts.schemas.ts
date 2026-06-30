import { z } from 'zod';
import { AlertType, AlertStatus } from './alerts.types';

export const createAlertSchema = z.object({
  transactionId: z.string().min(1),
  type: z.nativeEnum(AlertType),
  riskScore: z.number().min(0).max(100),
  triggeredRules: z.array(z.string()).default([]),
  description: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(AlertStatus),
  assignedTo: z.string().optional(),
  resolution: z.string().optional(),
});

export type CreateAlertDto = z.infer<typeof createAlertSchema>;
export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;