import { z } from 'zod';

export const clubSchema = z.object({
  name: z.string().min(2, 'Club name must be at least 2 characters'),
  type: z.string().min(1, 'Club type is required'),
  members: z.string().regex(/^[0-9]+$/, 'Members must be a number').optional().or(z.literal('')),
  icon: z.string().default('🎓'),
  color: z.string().default('#8B5CF6'),
  status: z.enum(['active', 'inactive']).default('active').optional(),
  role: z.string().min(1, 'Role is required'),
  nextMeeting: z.string().optional(),
  about: z.string().optional(),
  createdBy: z.string().min(2, 'Creator name is required'),
  upcomingEvents: z.array(
    z.object({
      date: z.string().min(10, 'Date is required'),
      description: z.string().min(5, 'Description must be at least 5 characters'),
    })
  ).optional(),
}); 