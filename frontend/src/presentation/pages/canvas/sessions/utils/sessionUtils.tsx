import React from 'react';
import { 
  FaClock, 
  FaRecordVinyl, 
  FaCheckCircle, 
  FaWifi, 
  FaSignal, 
  FaLock, 
  FaPlay, 
  FaShareAlt, 
  FaDownload, 
  FaCalendarAlt 
} from 'react-icons/fa';
import { Session, SessionStats } from '../../../../../domain/types/canvas/session';

export const getStatusBadge = (status: string, isLive: boolean, styles: any): JSX.Element => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
  const normalized = (status || '').toLowerCase();
  switch (normalized) {
    case 'upcoming':
    case 'scheduled':
      return (
        <span className={`${baseClasses} ${styles.status.warning} ${styles.badgeBackground}`}>
          <FaClock className="w-3 h-3" />
          Upcoming
        </span>
      );
    case 'live':
      return (
        <span className={`${baseClasses} ${styles.status.error} animate-pulse ${styles.cardShadow}`}>
          <FaRecordVinyl className="w-3 h-3 animate-spin" />
          LIVE
        </span>
      );
    case 'completed':
      return (
        <span className={`${baseClasses} ${styles.status.info} ${styles.badgeBackground}`}>
          <FaCheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    case 'ended':
      return (
        <span className={`${baseClasses} ${styles.status.error} ${styles.badgeBackground}`}>
          <FaCheckCircle className="w-3 h-3" />
          Ended
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} ${styles.button.secondary} ${styles.textSecondary}`}>
          Unknown
        </span>
      );
  }
};

export const getDifficultyBadge = (difficulty: Session['difficulty'], styles: any): JSX.Element => {
  const colors = {
    'Beginner': styles.status.success,
    'Intermediate': styles.status.warning,
    'Advanced': styles.status.error
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty]} ${styles.badgeBackground}`}>
      {difficulty}
    </span>
  );
};

export const getConnectionQualityIcon = (quality: Session['connectionQuality'], styles: any): JSX.Element | null => {
  switch (quality) {
    case 'excellent':
      return <FaWifi className={`w-4 h-4 ${styles.status.success}`} />;
    case 'good':
      return <FaSignal className={`w-4 h-4 ${styles.status.warning}`} />;
    case 'poor':
      return <FaWifi className={`w-4 h-4 ${styles.status.error}`} />;
    default:
      return null;
  }
};

export const getActionButton = (session: Session, userAccess: { isEnrolled: boolean }, styles: any): JSX.Element => {
  if (!userAccess.isEnrolled) {
    return (
      <button className={`flex items-center gap-2 px-6 py-3 ${styles.button.secondary} rounded-xl cursor-not-allowed ${styles.border}`}>
        <FaLock className="w-4 h-4" />
        Enrollment Required
      </button>
    );
  }

  switch (session.status) {
    case 'live':
      return (
        <div className="flex gap-2">
          <button className={`flex items-center gap-2 px-6 py-3 ${styles.status.error} rounded-xl ${styles.cardHover} ${styles.cardShadow}`}>
            <FaPlay className="w-4 h-4" />
            Join Live Session
          </button>
          <button className={`p-3 ${styles.card.background} ${styles.border} rounded-xl ${styles.cardHover}`}>
            <FaShareAlt className={`w-4 h-4 ${styles.icon.secondary}`} />
          </button>
        </div>
      );
    case 'completed':
      return session.hasRecording ? (
        <div className="flex gap-2">
          <button className={`flex items-center gap-2 px-6 py-3 ${styles.status.info} rounded-xl ${styles.cardHover} ${styles.cardShadow}`}>
            <FaPlay className="w-4 h-4" />
            Watch Recording
          </button>
          <button className={`p-3 ${styles.card.background} ${styles.border} rounded-xl ${styles.cardHover}`}>
            <FaDownload className={`w-4 h-4 ${styles.icon.secondary}`} />
          </button>
        </div>
      ) : (
        <span className={`text-sm px-4 py-2 ${styles.backgroundSecondary} rounded-xl ${styles.textSecondary}`}>
          Recording not available
        </span>
      );
    case 'upcoming':
      return (
        <div className="flex gap-2">
          <button className={`flex items-center gap-2 px-6 py-3 ${styles.accent} rounded-xl ${styles.cardHover} ${styles.cardShadow}`}>
            <FaCalendarAlt className="w-4 h-4" />
            Set Reminder
          </button>
          <button className={`p-3 ${styles.card.background} ${styles.border} rounded-xl ${styles.cardHover}`}>
            <FaShareAlt className={`w-4 h-4 ${styles.icon.secondary}`} />
          </button>
        </div>
      );
    default:
      return <></>;
  }
};

export const calculateSessionStats = (sessions: Session[], watchedSessions: string[]): SessionStats => {
  return {
    liveCount: sessions.filter(s => s.status === 'live').length,
    upcomingCount: sessions.filter(s => s.status === 'upcoming').length,
    completedCount: sessions.filter(s => s.status === 'completed').length,
    watchedCount: watchedSessions.length
  };
};  