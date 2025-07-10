import React from 'react';

export const DocumentInstructions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded">
        <p className="text-sm font-medium text-cyan-800 mb-3">
          Ensure that your documents meet the following specifications before uploading:
        </p>
        <ol className="list-decimal pl-8 text-sm text-cyan-700 space-y-2">
          <li>File Format: Only PDF, JPG, JPEG, or PNG formats are accepted.</li>
          <li>File Size: Maximum size of 10MB per file.</li>
          <li>File Naming: File names should only contain English letters and numbers and within 50 characters.</li>
          <li>File Security: Do not upload encrypted or password-protected files.</li>
          <li>Combining Documents: Combine documents of the same type into a single file.</li>
          <li>Submission Requirement: You are not required to mail or fax your documents.</li>
        </ol>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-800">
          <span className="font-medium">For NUS College:</span> Please upload your Promotional Examination, 
          together with your Preliminary Examination results, under the respective document type. 
          Please upload a testimonial or referee letter from your school (optional).
        </p>
      </div>
    </div>
  );
};