import React, { useState } from 'react';
import { FiCalendar, FiClock, FiUpload, FiDownload, FiEye, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Assignment } from '../types/AssignmentTypes';
import { getDaysLeft, formatDueDate, getStatusColor } from '../utils/assignmentUtils';
import { GradeModal } from './GradeModal';
import httpClient from '../../../../../frameworks/api/httpClient';

interface AssignmentCardProps {
  assignment: Assignment;
  styles: any;
  onUpload: (assignment: Assignment) => void;
  onViewGrade: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  styles,
  onUpload,
}) => {
  const [showGradeModal, setShowGradeModal] = useState(false);
  const daysLeft = getDaysLeft(assignment.dueDate);
  const isOverdue = daysLeft < 0 && !assignment.submission;
  
  const getActualStatus = () => {
    if (assignment.submission) {
      if (assignment.submission.status === 'reviewed') {
        return 'graded';
      } else if (assignment.submission.status === 'pending') {
        return 'submitted';
      } else if (assignment.submission.status === 'late') {
        return 'submitted';
      } else if (assignment.submission.status === 'needs_correction') {
        return 'needs_correction';
      }
    }
    return assignment.status;
  };

  const actualStatus = getActualStatus();

  const handleFileDownload = async (fileUrl: string, fileName: string) => {
    try {
      
      let actualFileName = fileName;
      if (fileUrl.includes('.png') || fileUrl.includes('.jpg') || fileUrl.includes('.jpeg')) {
        const urlParts = fileUrl.split('.');
        const actualExtension = urlParts[urlParts.length - 1].split('?')[0]; 
        if (fileName.toLowerCase().endsWith('.pdf')) {
          actualFileName = fileName.replace('.pdf', `.${actualExtension}`);
        }
      }
      
      if (fileUrl.includes('cloudinary.com')) {
        
        const proxyUrl = `/assignments/download-file?fileUrl=${encodeURIComponent(fileUrl)}&fileName=${encodeURIComponent(actualFileName)}`;
        
        try {
          const response = await httpClient.get(proxyUrl);
                    
          if (response.data.success && response.data.fileUrl) {
            // Open the Cloudinary URL directly in a new tab
            window.open(response.data.fileUrl, '_blank');
          } else {
            window.open(fileUrl, '_blank');
          }
        } catch (error) {
          console.error('❌ Error downloading file:', error);
          window.open(fileUrl, '_blank');
        }
      } else {
        
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = actualFileName;
        link.style.display = 'none';
        
        console.log('📎 Direct link properties:', {
          href: link.href,
          download: link.download
        });
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Direct download triggered successfully');
      }
    } catch (error) {
      console.error('❌ Error in frontend download:', error);
      console.log('🔄 Falling back to window.open...');
      // Fallback: try to open in new tab if download fails
      window.open(fileUrl, '_blank');
    }
    
    console.log('=== FRONTEND DOWNLOAD ENDED ===');
  };

  return (
    <>
    <div
      className={`${styles.card.background} p-6 rounded-2xl shadow-lg ${styles.border} ${
        isOverdue ? `border-l-4 ${styles.status.error}` : ''
      } hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-xl font-bold ${styles.textPrimary}`}>
                {assignment.title}
              </h3>
                {assignment.submission && (
                  <div className="flex items-center gap-1">
                    {assignment.submission.status === 'reviewed' ? (
                      <FiCheckCircle className={`h-5 w-5 ${styles.status.success}`} />
                    ) : (
                      <FiAlertCircle className={`h-5 w-5 ${styles.status.warning}`} />
                    )}
                  </div>
                )}
            </div>
            <p className={`font-medium mb-2 ${styles.accent}`}>{assignment.subject}</p>
            <p className={`${styles.textSecondary} text-sm line-clamp-2`}>{assignment.description}</p>
          </div>
        </div>

        {assignment.files && assignment.files.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className={`text-sm font-medium ${styles.textSecondary}`}>Reference Files:</p>
            <div className="flex flex-wrap gap-2">
              {assignment.files.map((file) => (
                  <button
                  key={file._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileDownload(file.fileUrl, file.fileName);
                    }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${styles.button.secondary} hover:bg-opacity-80 transition-all duration-200`}
                  >
                    <FiDownload className="h-4 w-4" />
                    <span className="text-sm">{file.fileName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {assignment.submission && assignment.submission.files && assignment.submission.files.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className={`text-sm font-medium ${styles.status.success}`}>Submitted Files:</p>
              <div className="flex flex-wrap gap-2">
                {assignment.submission.files.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${styles.status.success} bg-opacity-20`}
                >
                  <FiFile className="h-4 w-4" />
                  <span className="text-sm">{file.fileName}</span>
                  </div>
              ))}
            </div>
          </div>
        )}

          <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FiCalendar className={`h-4 w-4 ${styles.icon.secondary}`} />
            <span className={`${styles.textSecondary}`}>Due: {formatDueDate(assignment.dueDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className={`h-4 w-4 ${styles.icon.secondary}`} />
            <span className={`${styles.textSecondary}`}>
              {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(actualStatus, styles)}`}>
                {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
              </span>
              {assignment.submission && (
                <span className={`text-xs px-2 py-1 rounded ${assignment.submission.isLate ? styles.status.error : styles.status.success}`}>
                  {assignment.submission.isLate ? 'Late' : 'On Time'}
            </span>
              )}
          </div>

          <div className="flex items-center gap-2">
              {!assignment.submission && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpload(assignment);
                }}
                className={`px-6 py-3 ${styles.button.primary} rounded-xl flex items-center gap-2`}
              >
                <FiUpload className="h-4 w-4" />
                Submit
              </button>
            )}
              {assignment.submission && assignment.submission.status === 'pending' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`p-3 ${styles.button.secondary} rounded-xl transition-all duration-200`}
                  disabled
                >
                  <FiClock className={`h-4 w-4 ${styles.icon.secondary}`} />
                </button>
              )}
              {assignment.submission && assignment.submission.status === 'needs_correction' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpload(assignment);
                  }}
                  className={`px-6 py-3 ${styles.button.primary} rounded-xl flex items-center gap-2`}
                >
                  <FiUpload className="h-4 w-4" />
                  Resubmit
              </button>
            )}
              {assignment.submission && assignment.submission.status === 'reviewed' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                    setShowGradeModal(true);
                }}
                className={`px-6 py-2 ${styles.button.primary} rounded-xl flex items-center gap-2`}
              >
                <FiEye className="h-4 w-4" />
                View Grade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

      {showGradeModal && (
        <GradeModal
          assignment={assignment}
          styles={styles}
          onClose={() => setShowGradeModal(false)}
        />
      )}
    </>
  );
}; 