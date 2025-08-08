import { z } from "zod";
export type SessionFormData = z.infer<typeof sessionSchema>;

export const sessionSchema = z.object({
    title: z.string().min(1, 'Session title is required'),
    instructor: z.string().min(1, 'Instructor is required'),
    course: z.string().min(1, 'Course is required'),
    date: z.string()
        .min(1, 'Date is required')
        .refine(val => {
            const selectedDate = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }, 'Cannot select a past date'),
    time: z.string().min(1, 'Time is required'),
    duration: z.string()
        .refine(val => val && !isNaN(Number(val)) && Number(val) > 0, 'Please enter a valid duration'),
    maxAttendees: z.string()
        .refine(val => val && !isNaN(Number(val)) && Number(val) > 0, 'Please enter a valid maximum number of attendees'),
    description: z.string().optional(),
    tags: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
}).superRefine((data, ctx) => {
    if (data.date && data.time) {
        const selectedDateTime = new Date(`${data.date}T${data.time}`);
        const now = new Date();
        if (selectedDateTime <= now) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Cannot select a past time',
                path: ['time'],
            });
        }
    }
});

