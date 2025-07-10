import { z } from 'zod';

export const enquiryReplySchema = z.object({
  replyMessage: z.string().min(1, 'Reply message is required'),
});

export type EnquiryReplyFormData = z.infer<typeof enquiryReplySchema>; 