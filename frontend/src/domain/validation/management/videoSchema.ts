import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string().min(2, 'Video title must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  module: z.string()
    .min(1, 'Module is required')
    .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1, 'Module must be a valid number at least 1'),
  order: z.string()
    .optional()
    .refine((val) => !val || (!isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1), 'Order must be a valid number at least 1'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['Draft', 'Published']),
}); 