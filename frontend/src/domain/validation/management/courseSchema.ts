import { z } from 'zod';

export const courseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().optional(),
  specialization: z.string().min(1, 'Specialization is required'),
  credits: z.number().min(0, 'Credits must be 0 or greater'),
  faculty: z.string().min(1, 'Faculty is required'),
  schedule: z.string().optional(),
  maxEnrollment: z.number().min(0, 'Max enrollment must be 0 or greater'),
  prerequisites: z.array(z.string()).optional(),
  term: z.string().min(1, 'Term is required'),
});

export type CourseFormData = z.infer<typeof courseSchema>; 