import { z } from 'zod';

export const DeclarationSchema = z.object({
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Privacy Notice' }),
  }),
  marketingEmail: z.boolean().optional(),
  marketingCall: z.boolean().optional(),
});

export type DeclarationFormData = z.infer<typeof DeclarationSchema>;