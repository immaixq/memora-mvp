import { z } from 'zod';

export const createResponseSchema = z.object({
  text: z.string().min(1).max(1000),
});

export const pollVoteSchema = z.object({
  pollOptionId: z.string(),
});

export type CreateResponseData = z.infer<typeof createResponseSchema>;
export type PollVoteData = z.infer<typeof pollVoteSchema>;