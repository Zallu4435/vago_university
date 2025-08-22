import { z } from "zod";

const namePattern = /^[a-zA-Z\s-']+$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(namePattern, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .refine((value) => !value.match(/[\p{Emoji}]/u), 'Name cannot contain emojis'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(namePattern, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .refine((value) => !value.match(/[\p{Emoji}]/u), 'Name cannot contain emojis'),
  email: z.string()
    .email('Invalid email address')
    .regex(emailPattern, 'Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val, { message: 'You must accept the terms and conditions' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});