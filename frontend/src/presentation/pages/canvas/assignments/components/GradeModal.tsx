import React from 'react';
import { FiX, FiAward, FiFileText, FiDownload, FiCheckCircle, FiAlertCircle, FiCalendar, FiClock } from 'react-icons/fi';
import { Assignment } from '../types/AssignmentTypes';
import { formatDueDate } from '../utils/assignmentUtils';
import { userAssignmentService } from '../services/userAssignmentService';

interface GradeModalProps {
  assignment: Assignment;
  onClose: () => void;
}

export const GradeModal: React.FC<GradeModalProps> = ({ assignment, onClose }) => {
  if (!assignment.submission) {
    return null;
  }

  const submission = assignment.submission;

  const handleFileDownload = async (fileUrl: string, fileName: string) => {
    try {
      console.log('=== GRADE MODAL FILE DOWNLOAD STARTED ===');
      console.log('📁 File details:', { fileUrl, fileName });
      
      let actualFileName = fileName;
      if (fileUrl.includes('.png') || fileUrl.includes('.jpg') || fileUrl.includes('.jpeg')) {
        const urlParts = fileUrl.split('.');
        const actualExtension = urlParts[urlParts.length - 1].split('?')[0];
        if (fileName.toLowerCase().endsWith('.pdf')) {
          actualFileName = fileName.replace('.pdf', `.${actualExtension}`);
        }
      }

      // Use the new download service method (similar to materials)
      const blob = await userAssignmentService.downloadReferenceFile(fileUrl, actualFileName);
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = actualFileName;
      link.style.display = 'none';
      
      console.log('📎 Download link properties:', {
        href: link.href,
        download: link.download
      });
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
      console.log('✅ Grade modal file download triggered successfully');
    } catch (error) {
      console.error('❌ Error downloading grade modal file:', error);
      console.log('🔄 Falling back to direct download...');
      // Fallback: try direct download
      try {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('❌ Fallback download also failed:', fallbackError);
        // Last resort: open in new tab
        window.open(fileUrl, '_blank');
      }
    }
    
    console.log('=== GRADE MODAL FILE DOWNLOAD ENDED ===');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-md sm:rounded-lg shadow-lg w-full max-w-full sm:max-w-lg min-h-[300px] sm:min-h-[400px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b">
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 line-clamp-2">{assignment.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 sm:p-2.5 rounded-full transition-colors">
            <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
          {/* Grade Section */}
          {submission.status === 'reviewed' && submission.marks !== undefined && (
            <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-medium text-gray-800">Grade</h3>
                <FiAward className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
              <div className="mt-2 flex items-center gap-2 sm:gap-4">
                <span className="text-2xl sm:text-3xl font-bold text-green-600">{submission.marks}/{assignment.maxMarks}</span>
                <span className="text-base sm:text-lg text-green-600">
                  {Math.round((submission.marks / assignment.maxMarks) * 100)}%
                </span>
              </div>
              {submission.feedback && (
                <p className="mt-2 text-gray-600 text-xs sm:text-sm">Feedback: {submission.feedback}</p>
              )}
            </div>
          )}

          {/* Submission Status */}
          <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">Submission Status</h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {submission.status === 'reviewed' ? (
                  <FiCheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <FiAlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span>Status: {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FiCalendar className="h-4 w-4 text-gray-500" />
                <span>Submitted: {new Date(submission.submittedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FiClock className="h-4 w-4 text-gray-500" />
                <span>Due: {formatDueDate(assignment.dueDate)}</span>
              </div>
              <span className={`text-xs sm:text-sm ${submission.isLate ? 'text-red-500' : 'text-green-500'}`}>
                {submission.isLate ? 'Late Submission' : 'On Time'}
              </span>
            </div>
          </div>

          {/* Submitted Files */}
          {submission.files && submission.files.length > 0 && (
            <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">Submitted Files</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {submission.files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FiFileText className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-gray-800 line-clamp-1">{file.fileName}</p>
                        <p className="text-gray-500">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFileDownload(file.fileUrl, file.fileName)}
                      className="text-blue-500 hover:text-blue-700 p-1 sm:p-2 rounded-full"
                    >
                      <FiDownload className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignment Details */}
          <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">Assignment Details</h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">Subject</p>
                <p>{assignment.subject}</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Description</p>
                <p>{assignment.description}</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Maximum Marks</p>
                <p>{assignment.maxMarks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 sm:p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 sm:py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};