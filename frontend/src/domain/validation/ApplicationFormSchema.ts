import { z } from 'zod';
import { OtherInformationSchema } from './OtherInfoSchema';
import { DocumentUploadSectionSchema } from './DocumentSchema';
import { DeclarationSchema } from './DeclarationSchema';
import { personalFormSchema } from './PersonalFormSchema';
import { choiceOfStudySchema } from './ChoiceOfStudySchema';
import { educationSchema } from './EducationSchema';


export const ApplicationFormSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required').optional(),
  personalInfo: personalFormSchema.optional(),
  choiceOfStudy: choiceOfStudySchema.optional(),
  education: educationSchema.optional(),
//   achievements: AchievementSectionSchema.optional(),
  otherInformation: OtherInformationSchema.optional(),
  documents: DocumentUploadSectionSchema.optional(),
  declaration: DeclarationSchema.optional(),
}).refine(data => {
  if (data.declaration?.privacyPolicy) {
    return !!data.personalInfo && !!data.choiceOfStudy && !!data.education && !!data.otherInformation && !!data.documents;
  }
  return true;
}, {
  message: 'All required sections must be completed before submission',
  path: [],
});

export type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;