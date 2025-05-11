import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentInstructions } from './DocumentInstructions';
import { DocumentUploadTable } from './DocumentUploadTable';
import { DocumentUpload, DocumentUploadSectionFormData, DocumentUploadSectionSchema } from '../../../../domain/validation/DocumentSchema';

export interface DocumentUploadSection {
  documents: DocumentUpload[];
}

interface DocumentsProps {
  initialData?: DocumentUploadSection;
  onSave: (data: DocumentUploadSection) => void;
}

export const Documents: React.FC<DocumentsProps> = ({ initialData, onSave }) => {
  const defaultDocuments: DocumentUpload[] = [
    { id: 'passport', name: 'Passport' },
    { id: 'birthCert', name: 'Birth Certificate (in lieu of Passport)' },
    { id: 'examResults', name: 'National Level High School Examination result slip' },
    { id: 'ccaRecords', name: 'Co-curricular Activity Records' },
    { id: 'achievements', name: 'Certificate of Achievement' },
    { id: 'testimonials', name: 'Testimonials/Referee Letters' },
  ];

  const methods = useForm<DocumentUploadSectionFormData>({
    resolver: zodResolver(DocumentUploadSectionSchema),
    defaultValues: {
      documents: initialData?.documents?.length === 6 ? initialData.documents : defaultDocuments,
    },
    mode: 'onChange',
  });

  const { setValue, formState: { errors }, watch } = methods;

  const handleFileUpload = async (id: string, file: File) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Allowed types are PDF, JPEG, JPG, PNG.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB.');
      return;
    }

    const documents = watch('documents');
    const updatedDocuments = documents.map(doc =>
      doc.id === id
        ? { ...doc, fileName: file.name, fileType: file.type }
        : doc
    );

    setValue('documents', updatedDocuments, { shouldValidate: true });
    onSave({ documents: updatedDocuments });
  };

  const handleFileRemove = (id: string) => {
    const documents = watch('documents');
    const updatedDocuments = documents.map(doc =>
      doc.id === id ? { ...doc, fileName: undefined, fileType: undefined } : doc
    );
    setValue('documents', updatedDocuments, { shouldValidate: true });
    onSave({ documents: updatedDocuments });
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <h2 className="text-xl font-semibold text-cyan-900">Document Upload</h2>
        </div>

        <div className="p-6 space-y-6">
          {errors.documents && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <p className="text-sm text-red-700">{errors.documents.message}</p>
            </div>
          )}
          <DocumentInstructions />
          <DocumentUploadTable
            documents={watch('documents')}
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
          />
        </div>
      </div>
    </FormProvider>
  );
};