import { z } from "zod";

const namePattern = /^[a-zA-Z\s-']+$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const subjectPattern = /^[a-zA-Z0-9\s.,!?()-]+$/;

export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(namePattern, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .refine((value) => !value.match(/[\p{Emoji}]/u), 'Name cannot contain emojis'),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .regex(emailPattern, 'Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters'),
  
  subject: z.string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject cannot exceed 200 characters')
    .regex(subjectPattern, 'Subject can only contain letters, numbers, and basic punctuation')
    .refine((value) => !value.match(/[\p{Emoji}]/u), 'Subject cannot contain emojis'),
  
  message: z.string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
    .refine((value) => !value.match(/^\s+|\s+$/g), 'Message cannot start or end with whitespace')
    .refine((value) => value.split(/\s+/).length >= 3, 'Message must contain at least 3 words')
    .refine((value) => !value.match(/[\p{Emoji}]/u), 'Message cannot contain emojis'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
