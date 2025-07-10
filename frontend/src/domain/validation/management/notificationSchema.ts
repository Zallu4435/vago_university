import { z } from 'zod';

export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  recipientType: z.string().min(1, 'Please select a recipient type'),
  recipientId: z.string().optional(),
  recipientName: z.string().optional(),
  createdBy: z.string().optional(),
});

export type NotificationFormData = z.infer<typeof notificationSchema>; 