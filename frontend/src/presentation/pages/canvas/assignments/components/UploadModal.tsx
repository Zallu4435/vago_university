import React, { useEffect } from 'react';
import { FiX, FiFileText, FiUpload } from 'react-icons/fi';
import { formatDueDate } from '../utils/assignmentUtils';
import { UploadModalProps } from '../../../../../domain/types/canvas/assignment';


export const UploadModal: React.FC<UploadModalProps> = ({
  assignment,
  styles,
  selectedFile,
  onClose,
  onFileSelect,
  onSubmit
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Black background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-90"></div>
      <div className="relative z-10 w-full max-w-full sm:max-w-md">
        <div className={`${styles.cardBackground} p-4 sm:p-8 rounded-xl sm:rounded-3xl shadow-2xl border-2 border-gray-800 w-full`}>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className={`text-base sm:text-2xl font-bold ${styles.textPrimary}`}>Submit Assignment</h3>
            <button
              onClick={onClose}
              className={`p-2 sm:p-2.5 ${styles.button.secondary} rounded-lg sm:rounded-xl transition-all duration-300`}
              aria-label="Close modal"
            >
              <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className={`block text-xs sm:text-sm font-semibold ${styles.textPrimary} mb-2 sm:mb-3`}>
                Select File to Upload
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onFileSelect(e.target.files[0]);
                    }
                  }}
                  className={`w-full p-3 sm:p-4 border-2 border-dashed ${styles.input.border} rounded-lg sm:rounded-xl ${styles.input.background} transition-colors ${styles.input.focus} text-xs sm:text-base`}
                  aria-label="Upload file"
                />
                {selectedFile && (
                  <div className={`mt-2 sm:mt-3 p-2 sm:p-3 ${styles.backgroundSecondary} rounded-md sm:rounded-lg ${styles.border}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FiFileText className={`h-4 w-4 ${styles.status.info}`} />
                      <span className={`text-xs sm:text-sm ${styles.textPrimary} font-medium`}>
                        {selectedFile.name}
                      </span>
                      <span className={`text-xs ${styles.textSecondary}`}>
                        ({Math.round(selectedFile.size / 1024)} KB)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`${styles.backgroundSecondary} p-3 sm:p-4 rounded-lg sm:rounded-xl ${styles.border}`}>
              <h4 className={`font-semibold ${styles.textPrimary} mb-1 sm:mb-2 text-xs sm:text-base`}>Assignment Details:</h4>
              <p className={`text-xs sm:text-sm ${styles.textSecondary} mb-1`}>
                <strong>Title:</strong> {assignment.title}
              </p>
              <p className={`text-xs sm:text-sm ${styles.textSecondary} mb-1`}>
                <strong>Subject:</strong> {assignment.subject}
              </p>
              <p className={`text-xs sm:text-sm ${styles.textSecondary}`}>
                <strong>Due:</strong> {formatDueDate(assignment.dueDate)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                onClick={onClose}
                className={`px-4 sm:px-6 py-2 sm:py-3 ${styles.button.secondary} rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-xs sm:text-base`}
                aria-label="Cancel upload"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={!selectedFile}
                className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base ${
                  selectedFile 
                    ? `${styles.button.primary} hover:shadow-lg`
                    : `${styles.button.secondary} cursor-not-allowed`
                }`}
                aria-label="Submit assignment"
              >
                <FiUpload className="h-4 w-4" />
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 