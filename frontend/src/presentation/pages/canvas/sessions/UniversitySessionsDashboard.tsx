import { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import { Session, UserAccess } from '../../../../domain/types/canvas/session';
import { SessionStats } from './components/SessionStats';
import { SessionFilters } from './components/SessionFilters';
import { SessionCard } from './components/SessionCard';
import { calculateSessionStats } from './utils/sessionUtils';
import { useUniversitySessionManagement } from '../../../../application/hooks/useUniversitySessionManagement';

const UniversitySessionsDashboard = () => {
  const { styles } = usePreferences();
  const {
    sessions,
    watchedCount,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    isLoading,
    error
  } = useUniversitySessionManagement({ status: 'all', instructor: 'all' }, '');
  const [, setCurrentTime] = useState(new Date());
  const [userAccess, setUserAccess] = useState<UserAccess>({
    isEnrolled: true,
    watchedSessions: [] as string[],
    likedSessions: [] as string[],
    userName: 'Alex Johnson',
    userRole: 'Student'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleEnrollment = (isEnrolled: boolean) => {
    setUserAccess(prev => ({ ...prev, isEnrolled }));
  };

  const handleToggleWatched = (sessionId: string) => {
    setUserAccess(prev => ({
      ...prev,
      watchedSessions: prev.watchedSessions.includes(sessionId)
        ? prev.watchedSessions.filter(id => id !== sessionId)
        : [...prev.watchedSessions, sessionId]
    }));
  };

  const uniqueInstructors = [...new Set((sessions as Session[]).map(s => s.instructor).filter(Boolean))] as string[];
  const sessionStats = { ...calculateSessionStats(sessions, userAccess.watchedSessions), watchedCount };

  return (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && (
          <div className={`${styles.card.background} rounded-2xl shadow-lg border ${styles.border} text-center py-8 mb-6`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={`${styles.textSecondary}`}>Loading sessions...</p>
          </div>
        )}

        {error && (
          <div className={`${styles.card.background} rounded-2xl shadow-lg border ${styles.border} text-center py-8 mb-6`}>
            <div className={`w-16 h-16 ${styles.status.error} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <FaFilter className={`w-8 h-8 text-white`} />
            </div>
            <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-2`}>Error Loading Sessions</h3>
            <p className={`${styles.textSecondary}`}>Failed to load sessions. Please try again.</p>
          </div>
        )}

        {!isLoading && !error && (
          <SessionStats stats={sessionStats} styles={styles} />
        )}

        <SessionFilters
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({ status: 'all', instructor: 'all' })}
          uniqueInstructors={uniqueInstructors}
          userAccess={userAccess}
          onToggleEnrollment={handleToggleEnrollment}
          styles={styles}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className={`${styles.card.background} rounded-2xl shadow-lg border ${styles.border} text-center py-16`}>
              <div className={`w-16 h-16 ${styles.backgroundSecondary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <FaFilter className={`w-8 h-8 ${styles.icon.secondary}`} />
              </div>
              <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-2`}>No Sessions Found</h3>
              <p className={`${styles.textSecondary}`}>Try adjusting your filters to see more sessions.</p>
            </div>
          ) : (
            sessions.map((session: Session, index: number) => (
              <SessionCard
                key={session.id}
                session={session as any}
                index={index}
                userAccess={userAccess}
                styles={styles}
                onToggleWatched={handleToggleWatched}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversitySessionsDashboard;