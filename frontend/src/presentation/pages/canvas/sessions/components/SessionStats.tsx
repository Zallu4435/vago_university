import React from 'react';
import { FaRecordVinyl, FaClock, FaCheckCircle, FaEye } from 'react-icons/fa';
import { SessionStatsProps } from '../../../../../domain/types/canvas/session';

export const SessionStats: React.FC<SessionStatsProps> = ({ stats, styles }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className={`${styles.card.background} p-4 sm:p-6 rounded-xl sm:rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xl sm:text-3xl font-bold ${styles.textPrimary}`}>
              {stats.liveCount}
            </div>
            <div className={`${styles.textSecondary} text-xs sm:text-sm mt-1`}>Live Now</div>
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${styles.status.error} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
            <FaRecordVinyl className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
      
      <div className={`${styles.card.background} p-4 sm:p-6 rounded-xl sm:rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xl sm:text-3xl font-bold ${styles.textPrimary}`}>
              {stats.upcomingCount}
            </div>
            <div className={`${styles.textSecondary} text-xs sm:text-sm mt-1`}>Upcoming</div>
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${styles.status.warning} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
            <FaClock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
      
      <div className={`${styles.card.background} p-4 sm:p-6 rounded-xl sm:rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xl sm:text-3xl font-bold ${styles.textPrimary}`}>
              {stats.completedCount}
            </div>
            <div className={`${styles.textSecondary} text-xs sm:text-sm mt-1`}>Completed</div>
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${styles.status.info} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
            <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
      
      <div className={`${styles.card.background} p-4 sm:p-6 rounded-xl sm:rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-xl sm:text-3xl font-bold ${styles.textPrimary}`}>
              {stats.watchedCount}
            </div>
            <div className={`${styles.textSecondary} text-xs sm:text-sm mt-1`}>Watched</div>
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${styles.status.success} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
            <FaEye className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}; 