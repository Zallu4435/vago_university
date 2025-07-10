import { z } from 'zod';

export const chargeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.string().regex(/^[0-9]+(\.[0-9]{1,2})?$/, 'Valid amount is required').transform(val => Number(val)),
  term: z.string().min(1, 'Term is required'),
  dueDate: z.string().min(10, 'Due date is required'),
  applicableFor: z.string().min(1, 'Applicable for is required'),
});

export type ChargeFormDataRaw = z.infer<typeof chargeSchema>; 