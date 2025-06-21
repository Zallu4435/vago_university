import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentInstructions } from './DocumentInstructions';
import { DocumentUploadTable } from './DocumentUploadTable';
import { DocumentUpload, DocumentUploadSectionFormData, DocumentUploadSectionSchema } from '../../../../domain/validation/DocumentSchema';
import { toast } from 'react-hot-toast';
import { documentUploadService } from '../../../../application/services/documentUploadService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const useAuth = () => {
  const { token, user, collection } = useSelector((state: RootState) => state.auth);
  return { token, user, collection };
};

export interface DocumentUploadSection {
  documents: DocumentUpload[];
}

interface DocumentsProps {
  initialData?: DocumentUploadSection;
  onSave: (data: DocumentUploadSection) => void;
  applicationId: string;
}

// Define the ref type
interface DocumentsRef {
  trigger: () => Promise<boolean>;
  getValues: () => DocumentUploadSection;
}

// Wrap with forwardRef
export const Documents = React.forwardRef<DocumentsRef, DocumentsProps>(
  ({ initialData, onSave, applicationId }, ref) => {
    const { token } = useAuth();
    
    // console.log('Documents component rendered with:', {
    //   applicationId,
    //   hasToken: !!token,
    //   initialData: !!initialData
    // });

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

    const { setValue, formState: { errors }, watch, trigger } = methods;
    const currentDocuments = watch('documents');

    // Expose trigger method via ref
    React.useImperativeHandle(ref, () => ({
      trigger: async () => {
        const isValid = await trigger();
        console.log('Documents trigger validation result:', { isValid, errors });
        
        if (isValid) {
          methods.clearErrors();
        }
        
        return isValid;
      },
      getValues: () => ({ documents: currentDocuments }),
    }));

    const handleFileUpload = async (id: string, file: File) => {
      console.log('handleFileUpload called with:', { id, fileName: file.name, applicationId });
      
      if (!file || !token) {
        console.error('Missing file or token:', { hasFile: !!file, hasToken: !!token });
        return;
      }

      if (!applicationId || applicationId === '') {
        console.error('Application ID is missing or empty:', applicationId);
        toast.error('Application ID is missing. Please refresh the page and try again.');
        return;
      }

      const validTypes = ['application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Only PDF files are allowed.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB.');
        return;
      }

      try {
        console.log('Starting document upload with applicationId:', applicationId);
        // Upload to Cloudinary
        const uploadResult = await documentUploadService.uploadDocument(applicationId, id, file, token);

        // Update the document with Cloudinary URL
        const documents = watch('documents');
        const updatedDocuments = documents.map(doc =>
          doc.id === id
            ? { 
                ...doc, 
                fileName: file.name, 
                fileType: file.type,
                cloudinaryUrl: uploadResult.url 
              }
            : doc
        );

        setValue('documents', updatedDocuments, { shouldValidate: true });
        toast.success('Document uploaded successfully!');
      } catch (error: any) {
        console.error('Error uploading document:', error);
        toast.error(error.message || 'Failed to upload document');
      }
    };

    const handleFileRemove = (id: string) => {
      const documents = watch('documents');
      const updatedDocuments = documents.map(doc =>
        doc.id === id ? { ...doc, fileName: undefined, fileType: undefined, cloudinaryUrl: undefined } : doc
      );
      setValue('documents', updatedDocuments, { shouldValidate: true });
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
  }
);

// Optional: Set display name for better debugging
Documents.displayName = 'Documents';