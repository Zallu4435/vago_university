import React from 'react';
import { FaRecordVinyl, FaClock, FaCheckCircle, FaEye } from 'react-icons/fa';
import { SessionStatsProps } from '../types/SessionTypes';

export const SessionStats: React.FC<SessionStatsProps> = ({ stats, styles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className={`${styles.card.background} p-6 rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${styles.textPrimary}`}>
              {stats.liveCount}
            </div>
            <div className={`${styles.textSecondary} text-sm mt-1`}>Live Now</div>
          </div>
          <div className={`w-12 h-12 ${styles.status.error} rounded-2xl flex items-center justify-center`}>
            <FaRecordVinyl className="w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className={`${styles.card.background} p-6 rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${styles.textPrimary}`}>
              {stats.upcomingCount}
            </div>
            <div className={`${styles.textSecondary} text-sm mt-1`}>Upcoming</div>
          </div>
          <div className={`w-12 h-12 ${styles.status.warning} rounded-2xl flex items-center justify-center`}>
            <FaClock className="w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className={`${styles.card.background} p-6 rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${styles.textPrimary}`}>
              {stats.completedCount}
            </div>
            <div className={`${styles.textSecondary} text-sm mt-1`}>Completed</div>
          </div>
          <div className={`w-12 h-12 ${styles.status.info} rounded-2xl flex items-center justify-center`}>
            <FaCheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
      
      <div className={`${styles.card.background} p-6 rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${styles.textPrimary}`}>
              {stats.watchedCount}
            </div>
            <div className={`${styles.textSecondary} text-sm mt-1`}>Watched</div>
          </div>
          <div className={`w-12 h-12 ${styles.status.success} rounded-2xl flex items-center justify-center`}>
            <FaEye className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}; 