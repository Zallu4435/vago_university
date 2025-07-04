import React from 'react';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaHeart, 
  FaCheckCircle, 
  FaCircle,
  FaMicrophone,
  FaVideo,
  FaDesktop,
  FaComments
} from 'react-icons/fa';
import { SessionCardProps } from '../types/SessionTypes';
import { 
  getStatusBadge, 
  getDifficultyBadge, 
  getConnectionQualityIcon, 
  getActionButton 
} from '../utils/sessionUtils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../../redux/store';

// Patch: ensure session.startTime exists for backend data
interface BackendSession {
  startTime: string;
  joinUrl?: string;
  [key: string]: any;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  index,
  userAccess,
  styles,
  onToggleWatched,
  onToggleLike
}) => {
  const backendSession = session as unknown as BackendSession;
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  // Parse startTime for date and time
  const start = backendSession.startTime ? new Date(backendSession.startTime) : null;
  const dateStr = start ? start.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
  const avatar = backendSession.instructorAvatar || '👤';
  const tags = backendSession.tags || [];
  const attendees = typeof backendSession.attendees === 'number' ? backendSession.attendees : 0;
  const maxAttendees = typeof backendSession.maxAttendees === 'number' ? backendSession.maxAttendees : 0;

  return (
    <div className={`${styles.card.background} rounded-xl sm:rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover} overflow-hidden ${session.status === 'live' ? `${styles.status.error} bg-gradient-to-r ${styles.backgroundSecondary}` : ''}`}>
      <div className="p-3 sm:p-8">
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-6">
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-2xl sm:text-4xl">{avatar}</div>
                <div>
                  <h3 className={`text-base sm:text-2xl font-bold ${styles.textPrimary} mb-1 sm:mb-2`}>
                    Session {index + 1}: {session.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-1 sm:mb-2">
                    <span className="flex items-center gap-1.5 sm:gap-2 font-medium">
                      <FaUser className={`w-4 h-4 ${styles.icon.secondary}`} />
                      <span className={`${styles.textPrimary}`}>{session.instructor}</span>
                    </span>
                    <span className={`${styles.textSecondary}`}>•</span>
                    <span className={`${styles.textSecondary}`}>{session.course}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                {getStatusBadge(session.status, session.isLive, styles)}
              </div>
            </div>
            <p className={`${styles.textSecondary} mb-3 sm:mb-4 text-sm sm:text-lg`}>{session.description}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <FaCalendarAlt className={`w-4 h-4 ${styles.icon.secondary}`} />
                <span className={`${styles.textSecondary}`}>{dateStr}</span>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <FaClock className={`w-4 h-4 ${styles.icon.secondary}`} />
                <span className={`${styles.textSecondary}`}>{timeStr} ({session.duration} hrs)</span>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <FaUsers className={`w-4 h-4 ${styles.icon.secondary}`} />
                <span className={`${styles.textSecondary}`}>{attendees}/{maxAttendees} attendees</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              {getDifficultyBadge(session.difficulty, styles)}
              {tags.map((tag: string) => (
                <span key={tag} className={`px-2 sm:px-3 py-0.5 sm:py-1 ${styles.backgroundSecondary} ${styles.textSecondary} rounded-full text-xs font-medium`}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {session.status === 'completed' && session.hasRecording && userAccess.isEnrolled && (
                <button
                  onClick={() => onToggleWatched(session.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium ${styles.textSecondary} hover:${styles.status.success} transition-colors`}
                  aria-label={userAccess.watchedSessions.includes(session.id) ? 'Mark as unwatched' : 'Mark as watched'}
                >
                  {userAccess.watchedSessions.includes(session.id) ? (
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
              <button
                onClick={() => onToggleLike(session.id)}
                className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors ${userAccess.likedSessions.includes(session.id) ? `${styles.status.error} hover:${styles.status.error}` : `${styles.textSecondary} hover:${styles.status.error}`}`}
                aria-label={userAccess.likedSessions.includes(session.id) ? 'Unlike session' : 'Like session'}
              >
                <FaHeart className={`w-4 h-4 ${userAccess.likedSessions.includes(session.id) ? 'fill-current' : ''}`} />
                <span>{userAccess.likedSessions.includes(session.id) ? 'Liked' : 'Like'}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:justify-between sm:items-end gap-2 sm:gap-4 mb-3 sm:mb-0 w-full sm:w-auto">
            {session.status === 'live' && (
              <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${styles.textSecondary} ${styles.backgroundSecondary} px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl`}>
                <div className={`w-2 h-2 ${styles.status.success} rounded-full animate-pulse`}></div>
                Live for {Math.floor(Math.random() * 45 + 15)} minutes
              </div>
            )}
            {attendees > 0 && maxAttendees > 0 && (
              <div className={`w-full sm:w-40 ${styles.progress.background} rounded-full h-2 mb-1 sm:mb-2`}>
                <div 
                  className={`h-2 rounded-full ${styles.progress.fill} transition-all duration-300`}
                  style={{ width: `${(attendees / maxAttendees) * 100}%` }}
                ></div>
              </div>
            )}
            {getActionButton(session, userAccess, styles)}
          </div>
        </div>
        {session.status === 'live' && (
          <div className={`mt-4 sm:mt-6 p-2 sm:p-4 ${styles.backgroundSecondary} ${styles.border} rounded-lg sm:rounded-xl`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FaMicrophone className={`w-4 h-4 ${styles.icon.secondary}`} />
                  <FaVideo className={`w-4 h-4 ${styles.icon.secondary}`} />
                  <FaDesktop className={`w-4 h-4 ${styles.icon.secondary}`} />
                </div>
                <span className={`text-xs sm:text-sm ${styles.textSecondary}`}>Audio, Video, Screen Share Available</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <FaComments className={`w-4 h-4 ${styles.icon.secondary}`} />
                <span className={`text-xs sm:text-sm ${styles.textSecondary}`}>Chat Active</span>
              </div>
            </div>
          </div>
        )}
        {backendSession.joinUrl && (
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