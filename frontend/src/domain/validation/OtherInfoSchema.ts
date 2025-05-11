import { z } from 'zod';

export const HealthConditionSchema = z.object({
  condition: z.string().min(1, 'Health condition is required'),
  details: z
    .string()
    .min(1, 'Details are required')
    .min(10, 'Details must be at least 10 characters long')
    .max(500, 'Details cannot exceed 500 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Details can only contain letters, numbers, spaces, periods, commas, hyphens, and apostrophes')
    .refine(val => val.trim().length > 0, { message: 'Details cannot be only whitespace' }),
});

export const HealthInfoSchema = z.object({
  hasHealthSupport: z.enum(['true', 'false'], {
    required_error: 'Please select whether you have health support needs',
  }),
  conditions: z.array(HealthConditionSchema).optional().default([]),
  medicalConditions: z.string().min(1, 'Medical conditions information is required'),
  disabilities: z.string().optional(),
  specialNeeds: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.hasHealthSupport === 'true') {
    if (!data.conditions || data.conditions.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['conditions'],
        message: 'At least one health condition is required if you have health support needs',
      });
    }
    if (data.conditions && data.conditions.length > 0) {
      const expectedDetails = data.conditions.map(c => `${c.condition}: ${c.details}`).join('; ');
      if (data.medicalConditions !== expectedDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['medicalConditions'],
          message: 'Medical conditions must match the provided health conditions',
        });
      }
    }
  } else if (data.hasHealthSupport === 'false') {
    if (data.medicalConditions !== 'None') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['medicalConditions'],
        message: 'Medical conditions must be "None" if you have no health support needs',
      });
    }
    if (data.conditions && data.conditions.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['conditions'],
        message: 'No conditions should be provided if you have no health support needs',
      });
    }
  }
});

export const LegalInfoSchema = z.object({
  hasCriminalRecord: z.enum(['true', 'false'], {
    required_error: 'Please select whether you have a criminal record',
  }),
  criminalRecord: z.string().min(1, 'Criminal record information is required'),
  legalProceedings: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.hasCriminalRecord === 'true') {
    if (!data.criminalRecord.trim() || data.criminalRecord === 'None') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['criminalRecord'],
        message: 'Criminal record details are required if you have a criminal record',
      });
    }
    if (data.criminalRecord.length > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['criminalRecord'],
        message: 'Criminal record details cannot exceed 1000 characters',
      });
    }
  } else if (data.hasCriminalRecord === 'false') {
    if (data.criminalRecord !== 'None') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['criminalRecord'],
        message: 'Criminal record must be "None" if you have no criminal record',
      });
    }
  }
});

export const OtherInformationSchema = z.object({
  health: HealthInfoSchema,
  legal: LegalInfoSchema,
});

export type OtherInformationFormData = z.infer<typeof OtherInformationSchema>;

export type HealthCondition = z.infer<typeof HealthConditionSchema>;

export interface OtherInformationSection {
  health?: {
    hasHealthSupport: 'true' | 'false' | null;
    conditions: Array<{
      condition: string;
      details: string;
    }>;
    medicalConditions: string;
    disabilities?: string;
    specialNeeds?: string;
  };
  legal?: {
    hasCriminalRecord: 'true' | 'false' | null;
    criminalRecord: string;
    legalProceedings?: string;
  };
};