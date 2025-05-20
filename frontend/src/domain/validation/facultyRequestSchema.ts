// src/domain/validation/facultyRequestSchema.ts
import { z } from 'zod';

export const facultyRequestSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  
  email: z.string()
    .email('Please enter a valid email address'),
  
  phone: z.string()
    .regex(/^\d{10,}$/, 'Please enter a valid phone number'),
  
  department: z.string()
    .min(1, 'Please select a department'),
  
  qualification: z.string()
    .min(1, 'Please select your qualification'),
  
  experience: z.string()
    .min(1, 'Please select your experience'),
  
  aboutMe: z.string()
    .max(1000, 'About me must be less than 1000 characters')
    .optional(),
  
  cv: z.instanceof(FileList)
    .refine((files) => files.length > 0, 'CV is required')
    .refine((files) => {
      const file = files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'doc', 'docx'].includes(extension || '');
    }, 'Please upload PDF or DOC files only')
    .refine((files) => files[0].size <= 5 * 1024 * 1024, 'File size must be less than 5MB'),
  
  certificates: z.instanceof(FileList)
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      const file = files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['pdf', 'jpg', 'jpeg', 'png'].includes(extension || '');
    }, 'Please upload PDF, JPG or PNG files only')
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0].size <= 5 * 1024 * 1024;
    }, 'File size must be less than 5MB'),
  
  acceptTerms: z.boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions')
});

export type FacultyRequestFormData = z.infer<typeof facultyRequestSchema>;