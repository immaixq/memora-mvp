import { z } from 'zod';

export const createPromptSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().max(2000).optional(),
  type: z.enum(['TEXT', 'POLL']),
  communityId: z.string().optional(),
  pollOptions: z.array(z.string().min(1).max(100)).min(2).max(10).optional(),
});

export const getPromptsQuerySchema = z.object({
  communityId: z.string().optional(),
  sort: z.enum(['recent', 'trending']).default('recent'),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
});

export type CreatePromptData = z.infer<typeof createPromptSchema>;
export type GetPromptsQuery = z.infer<typeof getPromptsQuerySchema>;