import { z } from 'zod';

export const diplomaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  thumbnail: z.string().url('Thumbnail must be a valid URL').optional().or(z.literal('')),
  duration: z.string().min(1, 'Duration is required'),
  prerequisites: z.array(z.string()).optional(),
  status: z.boolean().default(true),
});

export type DiplomaFormData = z.infer<typeof diplomaSchema>; 