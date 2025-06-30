import React from 'react';
import { SessionHeaderProps } from '../types/SessionTypes';

export const SessionHeader: React.FC<SessionHeaderProps> = ({
  userName,
  currentTime,
  isEnrolled,
  sessionCount,
  styles
}) => {
  return (
    <div className={`${styles.card.background} ${styles.border} border-b`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full">
            <h1 className={`text-2xl sm:text-4xl font-bold ${styles.textPrimary} ${styles.accent} bg-clip-text text-transparent`}>
              Live Sessions
            </h1>
            <p className={`text-base sm:text-lg ${styles.textSecondary} mt-1`}>Advanced Web Development - Spring 2025</p>
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col items-center sm:items-end">
              <div className={`${styles.textSecondary} text-xs sm:text-sm`}>Welcome back,</div>
              <div className={`font-semibold ${styles.textPrimary} text-sm sm:text-base`}>{userName}</div>
            </div>
            <div className={`w-9 h-9 sm:w-12 sm:h-12 ${styles.accent} rounded-full flex items-center justify-center ${styles.textPrimary} font-bold text-base sm:text-lg`}>
              {userName.charAt(0)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-6 mt-4 sm:mt-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 ${styles.status.success} rounded-full animate-pulse`}></div>
            <span className={`${styles.textSecondary} text-xs sm:text-sm`}>
              {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
            </span>
          </div>
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${isEnrolled ? styles.status.success : styles.status.error} ${styles.badgeBackground}`}>
            {isEnrolled ? '✓ Enrolled' : '✗ Not Enrolled'}
          </div>
          <div className={`${styles.textSecondary} text-xs sm:text-sm`}>
            {sessionCount} session{sessionCount !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>
    </div>
  );
}; 