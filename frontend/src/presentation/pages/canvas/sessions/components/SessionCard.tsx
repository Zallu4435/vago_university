import React from 'react';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaCircle,
  FaMicrophone,
  FaVideo,
  FaDesktop,
  FaComments
} from 'react-icons/fa';
import { 
  getStatusBadge, 
  getDifficultyBadge, 
  getActionButton 
} from '../utils/sessionUtils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../../../appStore/store';
import { BackendSession, SessionCardProps } from '../../../../../domain/types/canvas/session';

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  index,
  userAccess,
  styles,
  onToggleWatched,
  
}) => {
  const backendSession = session as unknown as BackendSession;
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const status = (session.status || '').toLowerCase();

  // Handle both old and new data structures
  const start = session.startTime ? new Date(session.startTime) : null;
  const dateStr = start ? start.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
  const avatar = (backendSession.instructorAvatar as string) || '👤';
  const tags = (session.tags as string[]) || [];

  // Create a compatible styles object for sessionUtils
  const sessionStyles = {
    status: styles.status,
    badgeBackground: styles.badgeBackground || styles.backgroundSecondary,
    button: styles.button,
    textSecondary: styles.textSecondary,
    success: styles.success || styles.status.success,
    error: styles.error || styles.status.error,
    info: styles.info || styles.status.info,
    border: styles.border,
    cardHover: styles.cardHover || styles.card.hover,
    cardShadow: styles.cardShadow || '',
    card: styles.card,
    icon: styles.icon,
    backgroundSecondary: styles.backgroundSecondary,
    accent: styles.accent
  };

  return (
    <div className={`${styles.card.background} rounded-xl sm:rounded-2xl ${styles.cardShadow || ''} ${styles.cardBorder || ''} ${styles.cardHover || styles.card.hover} overflow-hidden ${session.isLive ? `${styles.status.error} bg-gradient-to-r ${styles.backgroundSecondary}` : ''}`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-2xl sm:text-3xl">{avatar || '👤'}</div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold ${styles.textPrimary} mb-2`}>
                    Session {index + 1}: {session.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
                    <span className="flex items-center gap-2 font-medium">
                      <FaUser className={`w-4 h-4 ${styles.icon.secondary}`} />
                      <span className={`${styles.textPrimary}`}>{session.instructor}</span>
                    </span>
                    <span className={`${styles.textSecondary}`}>•</span>
                    <span className={`${styles.textSecondary}`}>{session.course}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                {getStatusBadge(status, sessionStyles, session.isLive) as React.ReactElement}
              </div>
            </div>
            <p className={`${styles.textSecondary} mb-4 text-sm sm:text-base`}>{session.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <span className="flex items-center gap-2">
                <FaCalendarAlt className={`w-4 h-4 ${styles.icon.secondary}`} />
                <span className={`${styles.textSecondary}`}>{dateStr}</span>
              </span>
              <span className="flex items-center gap-2">
                <FaClock className={`w-4 h-4 ${styles.icon.secondary}`} />
                <span className={`${styles.textSecondary}`}>{timeStr} ({session.duration} hrs)</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {getDifficultyBadge(session.difficulty, sessionStyles) as React.ReactElement}
              {(tags || []).map((tag: string) => (
                <span key={tag} className={`px-3 py-1 ${styles.backgroundSecondary} ${styles.textSecondary} rounded-full text-sm font-medium`}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {session.status === 'completed' && session.hasRecording && (session.isEnrolled || userAccess.isEnrolled) && (
                <button
                  onClick={() => onToggleWatched(session.id || '')}
                  className={`flex items-center gap-2 text-sm font-medium ${styles.textSecondary} hover:${styles.status.success} transition-colors`}
                  aria-label={userAccess.watchedSessions.includes(session.id || '') ? 'Mark as unwatched' : 'Mark as watched'}
                >
                  {userAccess.watchedSessions.includes(session.id || '') ? (
                    <>
                      <FaCheckCircle className={`w-4 h-4 ${styles.status.success}`} />
                      <span className={`${styles.status.success}`}>Watched</span>
                    </>
                  ) : (
                    <>
                      <FaCircle className={`w-4 h-4 ${styles.icon.secondary}`} />
                      <span>Mark as Watched</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:justify-between sm:items-end gap-3 mb-3 sm:mb-0 w-full sm:w-auto">
            {session.isLive && (
              <div className={`flex items-center gap-2 text-sm ${styles.textSecondary} ${styles.backgroundSecondary} px-3 py-2 rounded-lg`}>
                <div className={`w-2 h-2 ${styles.status.success} rounded-full animate-pulse`}></div>
                Live for {Math.floor(Math.random() * 45 + 15)} minutes
              </div>
            )}
            {getActionButton(session, userAccess, sessionStyles) as React.ReactElement}
          </div>
        </div>
        {session.isLive && (
          <div className={`mt-4 p-3 ${styles.backgroundSecondary} ${styles.border} rounded-lg`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaMicrophone className={`w-4 h-4 ${styles.icon.secondary}`} />
                  <FaVideo className={`w-4 h-4 ${styles.icon.secondary}`} />
                  <FaDesktop className={`w-4 h-4 ${styles.icon.secondary}`} />
                </div>
                <span className={`text-sm ${styles.textSecondary}`}>Audio, Video, Screen Share Available</span>
              </div>
              <div className="flex items-center gap-2">
                <FaComments className={`w-4 h-4 ${styles.icon.secondary}`} />
                <span className={`text-sm ${styles.textSecondary}`}>Chat Active</span>
              </div>
            </div>
          </div>
        )}
        {backendSession.joinUrl && !['ended', 'completed'].includes(status) && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                navigate(`/faculty/video-conference/${backendSession.id || backendSession._id}`, {
                  state: {
                    session: backendSession,
                    faculty: user,
                    isHost: false,
                  },
                });
              }}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-200 text-base"
            >
              Join Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};