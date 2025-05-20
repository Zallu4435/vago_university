// src/presentation/components/admin/FacultyDetailsModal.tsx
import React from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiAward, FiClock, FiFile, FiDownload } from 'react-icons/fi';

interface FacultyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: any; // Replace 'any' with your Faculty type
}

const FacultyDetailsModal: React.FC<FacultyDetailsModalProps> = ({ isOpen, onClose, faculty }) => {
  if (!isOpen || !faculty) return null;

  const handleDownload = (url: string, filename: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{faculty.fullName}</h2>
              <p className="text-sm text-gray-500">Faculty ID: {faculty._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FiMail className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{faculty.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{faculty.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FiBook className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium capitalize">{faculty.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiAward className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="font-medium capitalize">{faculty.qualification || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiClock className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{faculty.experience || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Documents</h3>
            <div className="space-y-4">
              {/* CV */}
              {faculty.cvUrl && (
                <div className="flex items-center justify-between p-3 bg-white rounded-md border">
                  <div className="flex items-center space-x-3">
                    <FiFile className="text-blue-500" size={20} />
                    <div>
                      <p className="font-medium">Curriculum Vitae</p>
                      <p className="text-sm text-gray-500">Click to view/download</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(faculty.cvUrl, 'CV')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <FiDownload size={20} />
                  </button>
                </div>
              )}

              {/* Certificates */}
              {faculty.certificatesUrl && faculty.certificatesUrl.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-gray-700">Certificates</p>
                  {faculty.certificatesUrl.map((url: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border">
                      <div className="flex items-center space-x-3">
                        <FiFile className="text-blue-500" size={20} />
                        <div>
                          <p className="font-medium">Certificate {index + 1}</p>
                          <p className="text-sm text-gray-500">Click to view/download</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(url, `Certificate-${index + 1}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <FiDownload size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {faculty.aboutMe && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">About</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{faculty.aboutMe}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailsModal;