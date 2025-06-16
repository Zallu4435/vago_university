import React from 'react';
import { FiArrowLeft, FiCalendar, FiTrendingUp, FiStar, FiUpload, FiFileText, FiDownload, FiAward } from 'react-icons/fi';
import { Assignment } from '../types/AssignmentTypes';
import { getDaysLeft, formatDueDate, getStatusColor } from '../utils/assignmentUtils';

interface AssignmentDetailsProps {
  assignment: Assignment;
  styles: any;
  onBack: () => void;
  onUpload: (assignment: Assignment) => void;
}

export const AssignmentDetails: React.FC<AssignmentDetailsProps> = ({
  assignment,
  styles,
  onBack,
  onUpload
}) => {
  return (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className={`flex items-center gap-3 px-4 py-2 ${styles.button.secondary} rounded-xl transition-all duration-300`}
            aria-label="Back to dashboard"
          >
            <FiArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
        
        <div className={`${styles.card.background} p-8 rounded-3xl shadow-lg ${styles.border}`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className={`text-3xl font-bold ${styles.textPrimary} mb-2`}>{assignment.title}</h2>
              <p className={`font-medium text-lg ${styles.accent}`}>{assignment.course}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(assignment.status, assignment.isLate, styles)}`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                {assignment.isLate && ' (Late)'}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getUrgencyColor(assignment.urgency, getDaysLeft(assignment.dueDate), styles)}`}>
                {assignment.urgency === 'urgent' ? 'Urgent' : 'Normal'}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-4`}>Description</h3>
              <p className={`${styles.textSecondary} leading-relaxed`}>{assignment.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${styles.textPrimary}`}>Assignment Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiCalendar className={`h-5 w-5 ${styles.icon.primary}`} />
                    <span className={`${styles.textSecondary}`}>Due: {formatDueDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiTrendingUp className={`h-5 w-5 ${styles.icon.primary}`} />
                    <span className={`${styles.textSecondary}`}>Estimated Time: {assignment.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiStar className="h-5 w-5 text-yellow-500" />
                    <span className={`${styles.textSecondary}`}>Priority: {assignment.priority}/5</span>
                  </div>
                </div>
              </div>

              {assignment.submittedAt && (
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${styles.textPrimary}`}>Submission Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUpload className={`h-5 w-5 ${styles.status.success}`} />
                      <span className={`${styles.textSecondary}`}>
                        Submitted: {assignment.submittedAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {assignment.submittedFile && (
                      <div className="flex items-center gap-3">
                        <FiFileText className={`h-5 w-5 ${styles.status.info}`} />
                        <span className={`${styles.textSecondary}`}>{assignment.submittedFile}</span>
                        <button className={`p-2 ${styles.button.secondary} rounded-lg transition-all duration-300`}>
                          <FiDownload className={`h-4 w-4 ${styles.icon.secondary}`} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {assignment.status === 'graded' && assignment.grade && (
              <div>
                <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-4`}>Grade & Feedback</h3>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl font-bold ${styles.status.success}`}>
                        {assignment.grade.score}/{assignment.grade.total}
                      </div>
                      <div className={`px-4 py-2 ${styles.status.success} rounded-full font-semibold`}>
                        {Math.round((assignment.grade.score / assignment.grade.total) * 100)}%
                      </div>
                    </div>
                    <FiAward className={`h-12 w-12 ${styles.status.success}`} />
                  </div>
                  <div className={`${styles.card.background} p-4 rounded-xl ${styles.border}`}>
                    <h4 className={`font-semibold ${styles.textPrimary} mb-2`}>Instructor Feedback:</h4>
                    <p className={`${styles.textSecondary}`}>{assignment.grade.feedback}</p>
                  </div>
                </div>
              </div>
            )}

            {assignment.status === 'pending' && (
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                  onClick={() => onUpload(assignment)}
                  className={`px-8 py-3 ${styles.button.primary} rounded-xl flex items-center gap-2 text-lg font-medium`}
                  aria-label="Submit assignment"
                >
                  <FiUpload className="h-5 w-5" />
                  Submit Assignment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 