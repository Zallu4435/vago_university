import { z } from 'zod';

export const programmeChoiceSchema = z.object({
  programme: z.string().min(1, 'Programme is required'),
  preferredMajor: z.string().optional(),
}).refine(
  (data) => {
    // If programme requires a major (e.g., certain programmes), preferredMajor must be provided
    const programmesRequiringMajor = ['Engineering', 'Science']; // Adjust based on your programmeOptions
    if (programmesRequiringMajor.includes(data.programme) && !data.preferredMajor) {
      return false;
    }
    return true;
  },
  {
    message: 'Preferred Major is required for this programme',
    path: ['preferredMajor'],
  }
);

// Context-aware schema creator to check for duplicates
export const createProgrammeChoiceSchema = (existingChoices: { programme: string; preferredMajor: string }[]) =>
  programmeChoiceSchema.refine(
    (data) => {
      // Check if programme already exists in choices
      return !existingChoices.some(choice => choice.programme === data.programme);
    },
    {
      message: 'This programme has already been selected',
      path: ['programme'],
    }
  );

export const choiceOfStudySchema = z.array(programmeChoiceSchema).min(1, 'At least one programme is required').max(8, 'Maximum of 8 programmes allowed').refine(
  (choices) => {
    // Check if Dentistry or Medicine is included, it must be 1st or 2nd
    const restrictedProgrammes = ['Dentistry', 'Medicine'];
    const restrictedIndices = choices
      .map((choice, idx) => (restrictedProgrammes.includes(choice.programme) ? idx : -1))
      .filter(idx => idx !== -1);
    if (restrictedIndices.length > 0 && restrictedIndices.some(idx => idx > 1)) {
      return false;
    }
    return true;
  },
  {
    message: 'Dentistry or Medicine must be ranked as 1st or 2nd choice',
  }
).refine(
  (choices) => {
    // Check if Law is included, it must be 1st, 2nd, or 3rd
    const lawIndices = choices
      .map((choice, idx) => (choice.programme === 'Law' ? idx : -1))
      .filter(idx => idx !== -1);
    if (lawIndices.length > 0 && lawIndices.some(idx => idx > 2)) {
      return false;
    }
    return true;
  },
  {
    message: 'Law must be ranked as 1st, 2nd, or 3rd choice',
  }
);

export type ProgrammeChoiceFormData = z.infer<typeof programmeChoiceSchema>;
export type ChoiceOfStudyFormData = z.infer<typeof choiceOfStudySchema>;