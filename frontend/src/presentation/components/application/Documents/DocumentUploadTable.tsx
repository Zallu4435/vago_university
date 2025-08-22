import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DocumentUpload } from '../../../../domain/validation/user/DocumentSchema';

interface DocumentUploadTableProps {
  documents: DocumentUpload[];
  onFileUpload: (id: string, file: File) => void;
  onFileRemove: (id: string) => void;
}

export const DocumentUploadTable: React.FC<DocumentUploadTableProps> = ({
  documents,
  onFileUpload,
  onFileRemove,
}) => {
  const { formState: { errors } } = useFormContext();

  return (
    <div className="border border-cyan-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-cyan-50 border-b border-cyan-200">
            <th className="py-3 px-6 text-left text-cyan-800 font-medium w-1/6">Action</th>
            <th className="py-3 px-6 text-left text-cyan-800 font-medium w-3/6">Supporting Documents</th>
            <th className="py-3 px-6 text-left text-cyan-800 font-medium w-2/6">File(s)</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <tr key={doc.id} className="border-b border-cyan-100 hover:bg-cyan-50">
              <td className="py-4 px-6">
                <label className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm cursor-pointer inline-block">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFileUpload(doc.id, file);
                    }}
                  />
                </label>
              </td>
              <td className="py-4 px-6 text-cyan-800">{doc.name}</td>
              <td className="py-4 px-6">
                {doc.fileName ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-cyan-600">{doc.fileName}</span>
                    <button
                      onClick={() => onFileRemove(doc.id)}
                      className="text-red-400 hover:text-red-500"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-cyan-400 italic">No file uploaded</span>
                )}
                {Array.isArray(errors.documents) && errors.documents[index] && (
                  <p className="text-sm text-red-700 mt-1">
                    {errors.documents[index]?.fileName?.message || 'File is required'}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};