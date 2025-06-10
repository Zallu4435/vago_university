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
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold ${styles.textPrimary} ${styles.accent} bg-clip-text text-transparent`}>
              Live Sessions
            </h1>
            <p className={`text-lg ${styles.textSecondary} mt-1`}>Advanced Web Development - Spring 2025</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`${styles.textSecondary} text-sm`}>Welcome back,</div>
              <div className={`font-semibold ${styles.textPrimary}`}>{userName}</div>
            </div>
            <div className={`w-12 h-12 ${styles.accent} rounded-full flex items-center justify-center ${styles.textPrimary} font-bold text-lg`}>
              {userName.charAt(0)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${styles.status.success} rounded-full animate-pulse`}></div>
            <span className={`${styles.textSecondary} text-sm`}>
              {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
            </span>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${isEnrolled ? styles.status.success : styles.status.error} ${styles.badgeBackground}`}>
            {isEnrolled ? '✓ Enrolled' : '✗ Not Enrolled'}
          </div>
          <div className={`${styles.textSecondary} text-sm`}>
            {sessionCount} session{sessionCount !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>
    </div>
  );
}; 