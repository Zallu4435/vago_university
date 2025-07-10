import { z } from 'zod';

export const joinRequestSchema = z.object({
  reason: z.string().min(1, 'Reason is required.').max(500, 'Reason cannot exceed 500 characters.'),
  additionalInfo: z.string().max(300, 'Additional information cannot exceed 300 characters.').optional(),
});

export type JoinRequestFormValues = z.infer<typeof joinRequestSchema>; 