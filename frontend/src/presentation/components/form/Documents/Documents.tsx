import React, { useState } from 'react';
import { DocumentInstructions } from './DocumentInstructions';
import { DocumentUploadTable } from './DocumentUploadTable';
import { DocumentUpload } from '../../../../domain/types/formTypes';

export interface DocumentUploadSection {
  documents: DocumentUpload[];
}

interface DocumentsProps {
  initialData?: DocumentUploadSection;
  onSave: (data: DocumentUploadSection) => void;
}


export const Documents: React.FC<DocumentsProps> = ({ initialData, onSave }) => {
  const [documents, setDocuments] = useState<DocumentUpload[]>(
    initialData?.documents || [
      { id: 'passport', name: 'Passport' },
      { id: 'birthCert', name: 'Birth Certificate (in lieu of Passport)' },
      { id: 'examResults', name: 'National Level High School Examination result slip' },
      { id: 'ccaRecords', name: 'Co-curricular Activity Records' },
      { id: 'achievements', name: 'Certificate of Achievement' },
      { id: 'testimonials', name: 'Testimonials/Referee Letters' },
    ]
  );

 const handleFileUpload = async (id: string, file: File) => {
    if (!file) return;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB.');
      return;
    }

    const updated = documents.map(doc =>
      doc.id === id
        ? { ...doc, fileName: file.name, fileType: file.type }
        : doc
    );

    setDocuments(updated);
    onSave({ documents: updated });
  };


  const handleFileRemove = (id: string) => {
    const updated = documents.map(doc =>
      doc.id === id ? { ...doc, fileName: undefined, fileType: undefined } : doc
    );
    setDocuments(updated);
    onSave({ documents: updated });
  };


  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Document Upload</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <DocumentInstructions />
        <DocumentUploadTable 
              documents={documents}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
        />
      </div>
    </div>
  );
};