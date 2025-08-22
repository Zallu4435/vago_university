import { z } from 'zod';

export const DocumentUploadSchema = z.object({
  id: z.string().min(1, 'Document ID is required'),
  name: z.string().min(1, 'Document name is required'),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
});

export const DocumentUploadSectionSchema = z.object({
  documents: z
    .array(DocumentUploadSchema)
    .length(6, 'Exactly 6 documents are required')
    .refine(
      data => {
        const passport = data.find(doc => doc.id === 'passport');
        const birthCert = data.find(doc => doc.id === 'birthCert');
        return (passport?.fileName && passport?.fileType) || (birthCert?.fileName && birthCert?.fileType);
      },
      {
        message: 'Either Passport or Birth Certificate must be uploaded',
        path: ['documents'],
      }
    )
    .refine(
      data => {
        const examResults = data.find(doc => doc.id === 'examResults');
        return examResults?.fileName && examResults?.fileType;
      },
      {
        message: 'National Level High School Examination result slip is required',
        path: ['documents'],
      }
    )
    .refine(
      data => {
        return data.every(doc => {
          if (doc.fileType) {
            return ['application/pdf'].includes(doc.fileType);
          }
          return true;
        });
      },
      {
        message: 'Invalid file type. Only PDF files are allowed',
        path: ['documents'],
      }
    ),
});

export type DocumentUploadSectionFormData = z.infer<typeof DocumentUploadSectionSchema>;

export type DocumentUpload = z.infer<typeof DocumentUploadSchema>;