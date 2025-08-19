import React, { useState, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaEye, FaSpinner } from 'react-icons/fa';
import { DocumentUpload } from '../../../../domain/types/application';
import { documentUploadService } from '../../../../application/services/documentUploadService';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentUpload | null;
}

export const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  isOpen,
  onClose,
  document: doc
}) => {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  usePreventBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen && doc) {
      fetchDocument();
    }
  }, [isOpen, doc]);

  const fetchDocument = async () => {
    if (!doc) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await documentUploadService.getDocument(doc.id);
      
      if (response && response.pdfData) {
        setPdfData(response.pdfData);
      } else {
        setError('Failed to load document - no PDF data received');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Document fetch error:', err);
      setError(error.message || 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.2)' }}>
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-3">
            <FaFileAlt size={20} />
            {doc.name}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-cyan-100 transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <strong className="text-cyan-800">Document Name:</strong>
                <span className="text-gray-900 font-medium">{doc.fileName || 'Not uploaded'}</span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-cyan-800">File Type:</strong>
                <span className="text-gray-900 font-medium">{doc.fileType || 'PDF'}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-cyan-100 pt-4">
            {loading ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <FaSpinner className="text-cyan-600 mx-auto mb-2 animate-spin" size={48} />
                    <p className="text-gray-600">Loading document...</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <FaFileAlt className="text-red-400 mx-auto mb-2" size={48} />
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            ) : pdfData ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center mb-4">
                  <h4 className="text-lg font-semibold text-cyan-800 flex items-center gap-2">
                    <FaEye size={16} />
                    Document Preview
                  </h4>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <iframe
                    src={`data:application/pdf;base64,${pdfData}`}
                    className="w-full h-96"
                    title={doc.fileName || 'Document Preview'}
                    style={{ minHeight: '400px' }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <FaFileAlt className="text-gray-400 mx-auto mb-2" size={48} />
                    <p className="text-gray-500 text-sm">
                      Document not uploaded
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {doc.fileName || 'No file available'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6 pt-4 border-t border-cyan-100">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal; 