import { z } from 'zod';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = z.object({
    email: z.string()
        .email({ message: 'Please enter a valid email' })
        .regex(emailPattern, 'Please enter a valid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email cannot exceed 100 characters'),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(50, 'Password cannot exceed 50 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
})

export type LoginFormData = z.infer<typeof loginSchema>;
