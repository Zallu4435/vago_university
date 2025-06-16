import React from 'react';
import { FiCalendar, FiClock, FiUpload, FiDownload, FiEye, FiFile } from 'react-icons/fi';
import { Assignment } from '../types/AssignmentTypes';
import { getDaysLeft, formatDueDate, getStatusColor } from '../utils/assignmentUtils';

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
  onViewGrade
}) => {
  const daysLeft = getDaysLeft(assignment.dueDate);
  const isOverdue = daysLeft < 0 && assignment.status === 'draft';

  return (
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
                <a
                  key={file._id}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${styles.button.secondary} hover:bg-opacity-80 transition-all duration-200`}
                >
                  <FiFile className="h-4 w-4" />
                  <span className="text-sm">{file.fileName}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-sm">
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
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(assignment.status, styles)}`}>
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {assignment.status === 'draft' && (
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
            {assignment.status === 'submitted' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`p-3 ${styles.button.secondary} rounded-xl transition-all duration-200`}
              >
                <FiDownload className={`h-4 w-4 ${styles.icon.secondary}`} />
              </button>
            )}
            {assignment.status === 'graded' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewGrade(assignment);
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
  );
}; 