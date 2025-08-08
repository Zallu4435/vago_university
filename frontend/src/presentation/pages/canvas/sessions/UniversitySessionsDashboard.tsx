import { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import { UserAccess } from '../../../../domain/types/canvas/session';
import { SessionStats } from './components/SessionStats';
import { SessionFilters } from './components/SessionFilters';
import { SessionCard } from './components/SessionCard';
import { calculateSessionStats } from './utils/sessionUtils';
import { useUniversitySessionManagement } from '../../../../application/hooks/useUniversitySessionManagement';

const UniversitySessionsDashboard = () => {
  const { styles } = usePreferences();
  const {
    sessions,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm
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

  const handleToggleLike = (sessionId: string) => {
    setUserAccess(prev => ({
      ...prev,
      likedSessions: prev.likedSessions.includes(sessionId)
        ? prev.likedSessions.filter(id => id !== sessionId)
        : [...prev.likedSessions, sessionId]
    }));
  };

  const uniqueInstructors = [...new Set((sessions as any[]).map((s: { instructor: string }) => s.instructor))];
  const sessionStats = calculateSessionStats(sessions, userAccess.watchedSessions);

  return (
    <div className={`min-h-screen ${styles.background}`}>


      <div className="max-w-7xl mx-auto px-6 py-8">
        <SessionStats stats={sessionStats} styles={styles} />

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
            sessions.map((session: any, index: number) => (
              <SessionCard
                key={session.id}
                session={session}
                index={index}
                userAccess={userAccess}
                styles={styles}
                onToggleWatched={handleToggleWatched}
                onToggleLike={handleToggleLike}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversitySessionsDashboard;