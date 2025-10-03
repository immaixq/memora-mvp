import { z } from 'zod';

export const createReportSchema = z.object({
  resourceType: z.enum(['PROMPT', 'RESPONSE']),
  resourceId: z.string(),
  reason: z.string().min(1).max(500),
});

export type CreateReportData = z.infer<typeof createReportSchema>;