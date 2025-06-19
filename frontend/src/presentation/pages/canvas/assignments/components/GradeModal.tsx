import React from 'react';
import { FiX, FiAward, FiFileText, FiDownload, FiCheckCircle, FiAlertCircle, FiCalendar, FiClock, FiStar, FiXCircle } from 'react-icons/fi';
import { Assignment } from '../types/AssignmentTypes';
import { formatDueDate } from '../utils/assignmentUtils';
import { userAssignmentService } from '../services/userAssignmentService';

interface GradeModalProps {
  assignment: Assignment;
  styles: any;
  onClose: () => void;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  assignment,
  styles,
  onClose
}) => {
  if (!assignment.submission) {
    return null;
  }

  const submission = assignment.submission;

  // Handle file download
  const handleFileDownload = async (fileUrl: string, fileName: string) => {
    console.log('=== GRADEMODAL DOWNLOAD STARTED ===');
    console.log('📁 File name:', fileName);
    console.log('🔗 Original URL:', fileUrl);
    
    try {
      console.log('🔍 Checking if URL is Cloudinary...');
      
      // Detect actual file extension from URL
      let actualFileName = fileName;
      if (fileUrl.includes('.png') || fileUrl.includes('.jpg') || fileUrl.includes('.jpeg')) {
        const urlParts = fileUrl.split('.');
        const actualExtension = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params
        if (fileName.toLowerCase().endsWith('.pdf')) {
          actualFileName = fileName.replace('.pdf', `.${actualExtension}`);
          console.log('🔄 Correcting filename from', fileName, 'to', actualFileName);
        }
      }
      
      // For Cloudinary URLs, use the proxy endpoint for direct download
      if (fileUrl.includes('cloudinary.com')) {
        console.log('✅ Detected Cloudinary URL, using proxy');
        
        const proxyUrl = `/api/assignments/download-file?fileUrl=${encodeURIComponent(fileUrl)}&fileName=${encodeURIComponent(actualFileName)}`;
        
        console.log('🌐 Proxy URL created:', proxyUrl);
        console.log('🔧 Creating download link...');
        
        // Create a temporary anchor element for download
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.download = actualFileName;
        link.style.display = 'none';
        
        console.log('📎 Link properties:', {
          href: link.href,
          download: link.download,
          style: link.style.display
        });
        
        console.log('📎 Adding link to DOM...');
        // Append to body, click, and remove
        document.body.appendChild(link);
        
        console.log('🖱️ Triggering click...');
        link.click();
        
        console.log('🧹 Removing link from DOM...');
        document.body.removeChild(link);
        
        console.log('✅ Download link triggered successfully');
      } else {
        console.log('✅ Regular URL detected, using direct download');
        
        // For regular URLs, create download link
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
      console.error('❌ Error in GradeModal download:', error);
      console.log('🔄 Falling back to window.open...');
      // Fallback: try to open in new tab if download fails
      window.open(fileUrl, '_blank');
    }
    
    console.log('=== GRADEMODAL DOWNLOAD ENDED ===');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${styles.card.background} rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className={`text-2xl font-bold ${styles.textPrimary}`}>Assignment Grade</h2>
            <p className={`${styles.textSecondary} mt-1`}>{assignment.title}</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${styles.button.secondary} hover:bg-opacity-80 transition-all duration-200`}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Grade Section */}
          {submission.status === 'reviewed' && submission.marks !== undefined && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-semibold ${styles.textPrimary}`}>Grade & Feedback</h3>
                <FiAward className={`h-8 w-8 ${styles.status.success}`} />
              </div>
              
              <div className="flex items-center gap-6 mb-6">
                <div className={`text-5xl font-bold ${styles.status.success}`}>
                  {submission.marks}/{assignment.maxMarks}
                </div>
                <div className={`px-6 py-3 ${styles.status.success} rounded-full font-semibold text-lg`}>
                  {Math.round((submission.marks / assignment.maxMarks) * 100)}%
                </div>
              </div>

              {submission.feedback && (
                <div className={`${styles.card.background} p-4 rounded-xl ${styles.border}`}>
                  <h4 className={`font-semibold ${styles.textPrimary} mb-2`}>Instructor Feedback:</h4>
                  <p className={`${styles.textSecondary} leading-relaxed`}>{submission.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Submission Status */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className={`text-lg font-semibold ${styles.textPrimary} mb-4`}>Submission Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {submission.status === 'reviewed' ? (
                  <FiCheckCircle className={`h-5 w-5 ${styles.status.success}`} />
                ) : (
                  <FiAlertCircle className={`h-5 w-5 ${styles.status.warning}`} />
                )}
                <span className={`${styles.textSecondary}`}>
                  Status: {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <FiCalendar className={`h-5 w-5 ${styles.icon.secondary}`} />
                <span className={`${styles.textSecondary}`}>
                  Submitted: {new Date(submission.submittedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FiClock className={`h-5 w-5 ${styles.icon.secondary}`} />
                <span className={`${styles.textSecondary}`}>
                  Due: {formatDueDate(assignment.dueDate)}
                </span>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                submission.isLate ? styles.status.error : styles.status.success
              }`}>
                {submission.isLate ? 'Late Submission' : 'On Time'}
              </div>
            </div>
          </div>

          {/* Submitted Files */}
          {submission.files && submission.files.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className={`text-lg font-semibold ${styles.textPrimary} mb-4`}>Submitted Files</h3>
              <div className="space-y-3">
                {submission.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FiFileText className={`h-5 w-5 ${styles.status.info}`} />
                      <div>
                        <p className={`font-medium ${styles.textPrimary}`}>{file.fileName}</p>
                        <p className={`text-sm ${styles.textSecondary}`}>
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button className={`p-2 ${styles.button.secondary} rounded-lg transition-all duration-200 hover:bg-opacity-80`} onClick={() => handleFileDownload(file.fileUrl, file.fileName)}>
                      <FiDownload className={`h-4 w-4 ${styles.icon.secondary}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignment Details */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className={`text-lg font-semibold ${styles.textPrimary} mb-4`}>Assignment Details</h3>
            <div className="space-y-3">
              <div>
                <p className={`font-medium ${styles.textPrimary}`}>Subject</p>
                <p className={`${styles.textSecondary}`}>{assignment.subject}</p>
              </div>
              <div>
                <p className={`font-medium ${styles.textPrimary}`}>Description</p>
                <p className={`${styles.textSecondary}`}>{assignment.description}</p>
              </div>
              <div>
                <p className={`font-medium ${styles.textPrimary}`}>Maximum Marks</p>
                <p className={`${styles.textSecondary}`}>{assignment.maxMarks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className={`px-6 py-2 ${styles.button.primary} rounded-xl font-medium`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 