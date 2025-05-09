import React, { useState } from 'react';
import { DocumentInstructions } from './DocumentInstructions';
import { DocumentUploadTable } from './DocumentUploadTable';

interface DocumentUpload {
  id: string;
  name: string;
  file: File | null;
}

export const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { id: 'passport', name: 'Passport', file: null },
    { id: 'birthCert', name: 'Birth Certificate (in lieu of Passport)', file: null },
    { id: 'examResults', name: 'National Level High School Examination result slip', file: null },
    { id: 'ccaRecords', name: 'Co-curricular Activity Records (Junior College/Polytechnic/High School/Secondary School/University)', file: null },
    { id: 'achievements', name: 'Certificate of Achievement', file: null },
    { id: 'testimonials', name: 'Testimonials/Referee Letters', file: null }
  ]);

  const handleFileUpload = async (id: string, file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload PDF, JPG, JPEG, or PNG files only.');
      return;
    }

    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, file } : doc
      )
    );
  };

  const handleFileRemove = (id: string) => {
    setDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, file: null } : doc
      )
    );
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