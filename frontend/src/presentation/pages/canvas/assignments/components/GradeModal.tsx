import React from 'react';
import { FiX, FiAward, FiFileText, FiCheckCircle, FiAlertCircle, FiCalendar, FiClock } from 'react-icons/fi';
import { formatDueDate } from '../utils/assignmentUtils';
import { GradeModalProps } from '../../../../../domain/types/canvas/assignment';
import { usePreferences } from '../../../../../application/context/PreferencesContext';

export const GradeModal: React.FC<GradeModalProps> = ({ assignment, onClose }) => {
  const { styles } = usePreferences();
  
  if (!assignment.submission) {
    return null;
  }

  const submission = assignment.submission;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}></div>
      
      <div className={`${styles.card.background} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border ${styles.border} relative z-10`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl font-bold ${styles.textPrimary} line-clamp-2`}>
              {assignment.title}
            </h2>
            <p className={`text-sm ${styles.textSecondary} mt-1`}>
              Grade & Submission Details
            </p>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${styles.textSecondary}`}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submission.status === 'reviewed' && submission.marks !== undefined && (
            <div className={`p-6 ${styles.backgroundSecondary} rounded-xl border ${styles.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${styles.textPrimary}`}>Your Grade</h3>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiAward className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {submission.marks}/{assignment.maxMarks}
                </div>
                <div className="text-xl text-green-600 font-medium mb-3">
                  {Math.round((submission.marks / assignment.maxMarks) * 100)}%
                </div>
                {submission.feedback && (
                  <div className={`p-4 bg-white rounded-lg border ${styles.border}`}>
                    <p className="text-sm font-semibold text-gray-800 mb-2">Feedback:</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{submission.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={`p-6 ${styles.backgroundSecondary} rounded-xl border ${styles.border}`}>
            <h3 className={`text-lg font-semibold ${styles.textPrimary} mb-4`}>Submission Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                {submission.status === 'reviewed' ? (
                  <div className="p-2 bg-green-100 rounded-full">
                    <FiCheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <FiAlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                )}
                <div>
                  <p className={`text-sm font-medium ${styles.textPrimary}`}>Status</p>
                  <p className={`text-sm ${styles.textSecondary}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FiCalendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${styles.textPrimary}`}>Submitted</p>
                  <p className={`text-sm ${styles.textSecondary}`}>
                    {new Date(submission.submittedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <FiClock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${styles.textPrimary}`}>Due Date</p>
                  <p className={`text-sm ${styles.textSecondary}`}>
                    {formatDueDate(assignment.dueDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${submission.isLate ? 'bg-red-100' : 'bg-green-100'}`}>
                  <div className={`h-5 w-5 ${submission.isLate ? 'text-red-600' : 'text-green-600'}`}>
                    {submission.isLate ? '⏰' : '✅'}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium ${styles.textPrimary}`}>Timing</p>
                  <p className={`text-sm ${submission.isLate ? 'text-red-600' : 'text-green-600'} font-medium`}>
                    {submission.isLate ? 'Late Submission' : 'On Time'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {submission.files && submission.files.length > 0 && (
            <div className={`p-6 ${styles.backgroundSecondary} rounded-xl border ${styles.border}`}>
              <h3 className={`text-lg font-semibold ${styles.textPrimary} mb-4`}>Submitted Files</h3>
              <div className="space-y-3">
                {submission.files.map((file, index) => (
                  <div key={index} className={`p-4 bg-white rounded-lg border ${styles.border} flex items-center`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiFileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`p-6 ${styles.backgroundSecondary} rounded-xl border ${styles.border}`}>
            <h3 className={`text-lg font-semibold ${styles.textPrimary} mb-4`}>Assignment Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-medium ${styles.textPrimary} mb-1`}>Subject</p>
                  <p className={`text-sm ${styles.textSecondary}`}>{assignment.subject}</p>
                </div>
                <div>
                  <p className={`text-sm font-medium ${styles.textPrimary} mb-1`}>Maximum Marks</p>
                  <p className={`text-sm ${styles.textSecondary}`}>{assignment.maxMarks}</p>
                </div>
              </div>
              <div>
                <p className={`text-sm font-medium ${styles.textPrimary} mb-1`}>Description</p>
                <p className={`text-sm ${styles.textSecondary}`}>{assignment.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className={`w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors ${styles.cardHover}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};