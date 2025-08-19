import React from 'react';
import { 
  FaWifi, 
  FaSignal, 
  FaLock, 
  FaPlay, 
} from 'react-icons/fa';
import { Session, SessionStats, Styles } from '../../../../../domain/types/canvas/session';

export const getStatusBadge = (status: string, styles: Styles, isLive?: boolean): React.JSX.Element => {
  const getDisplayStatus = (backendStatus: string, isLive?: boolean): { text: string; color: string } => {
    if (isLive === true) {
      return { text: 'Live', color: styles.status.error };
    }
    
    switch (backendStatus?.toLowerCase()) {
      case 'ongoing':
        return { text: 'Live', color: styles.status.error };
      case 'scheduled':
        return { text: 'Upcoming', color: styles.status.warning };
      case 'ended':
        return { text: 'Completed', color: styles.status.info };
      case 'cancelled':
        return { text: 'Cancelled', color: styles.status.error };
      case 'live':
        return { text: 'Live', color: styles.status.error };
      case 'upcoming':
        return { text: 'Upcoming', color: styles.status.warning };
      case 'completed':
        return { text: 'Completed', color: styles.status.info };
      default:
        return { text: backendStatus || 'Unknown', color: styles.status.info };
    }
  };

  const { text, color } = getDisplayStatus(status, isLive);
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color} ${styles.badgeBackground}`}>
      {text}
    </span>
  );
};

export const getDifficultyBadge = (difficulty: Session['difficulty'], styles: Styles): React.JSX.Element => {
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

export const getConnectionQualityIcon = (quality: Session['connectionQuality'], styles: Styles): React.JSX.Element | null => {
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

export const getActionButton = (session: Session, userAccess: { isEnrolled: boolean }, styles: Styles): React.JSX.Element => {
  if (!userAccess.isEnrolled) {
    return (
      <button className={`flex items-center gap-2 px-6 py-3 ${styles.button.secondary} rounded-xl cursor-not-allowed ${styles.border}`}>
        <FaLock className="w-4 h-4" />
        Enrollment Required
      </button>
    );
  }

  const getSessionStatus = (backendStatus: string, isLive?: boolean): string => {
    if (isLive === true) {
      return 'live';
    }
    
    switch (backendStatus?.toLowerCase()) {
      case 'ongoing':
        return 'live';
      case 'scheduled':
        return 'upcoming';
      case 'ended':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return backendStatus?.toLowerCase() || 'unknown';
    }
  };

  const status = getSessionStatus(session.status, session.isLive);

  switch (status) {
    case 'live':
      return (
        <button className={`flex items-center gap-2 px-6 py-3 ${styles.status.error} rounded-xl ${styles.cardHover} ${styles.cardShadow}`}>
          <FaPlay className="w-4 h-4" />
          Join Live Session
        </button>
      );
    case 'completed':
      return session.hasRecording ? (
        <button className={`flex items-center gap-2 px-6 py-3 ${styles.status.info} rounded-xl ${styles.cardHover} ${styles.cardShadow}`}>
          <FaPlay className="w-4 h-4" />
          Watch Recording
        </button>
      ) : (
        <span className={`text-sm px-4 py-2 ${styles.backgroundSecondary} rounded-xl ${styles.textSecondary}`}>
          Recording not available
        </span>
      );
    case 'upcoming':
      return <></>; 
    default:
      return <></>;
  }
};

export const calculateSessionStats = (sessions: Session[], watchedSessions: string[]): SessionStats => {
  const getFrontendStatus = (backendStatus: string): string => {
    switch (backendStatus?.toLowerCase()) {
      case 'ongoing':
        return 'live';
      case 'scheduled':
        return 'upcoming';
      case 'ended':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        return backendStatus?.toLowerCase() || 'unknown';
    }
  };

  const liveCount = sessions.filter(s => s.isLive === true).length;
  const upcomingCount = sessions.filter(s => getFrontendStatus(s.status) === 'upcoming' && !s.isLive).length;
  const completedCount = sessions.filter(s => getFrontendStatus(s.status) === 'completed').length;
  const watchedCount = watchedSessions.length;

  return {
    liveCount,
    upcomingCount,
    completedCount,
    watchedCount
  };
};  