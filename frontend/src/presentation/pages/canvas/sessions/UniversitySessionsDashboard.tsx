import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';
import { Session, UserAccess, Filters } from './types/SessionTypes';
import { SessionHeader } from './components/SessionHeader';
import { SessionStats } from './components/SessionStats';
import { SessionFilters } from './components/SessionFilters';
import { SessionCard } from './components/SessionCard';
import { calculateSessionStats } from './utils/sessionUtils';
import { useUniversitySessionManagement } from '../../../../application/hooks/useUniversitySessionManagement';

const UniversitySessionsDashboard = () => {
  const { styles } = usePreferences();
  const {
    sessions,
    isLoading,
    error,
    selectedSession,
    setSelectedSession,
    handleJoinSession,
    isJoining
  } = useUniversitySessionManagement();
  const [filteredSessions, setFilteredSessions] = useState<any[]>(sessions as any[]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    instructor: 'all',
    dateRange: 'all'
  });
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

  useEffect(() => {
    let filtered = sessions;
    if (filters.status !== 'all') {
      filtered = filtered.filter((session: any) => session.status === filters.status);
    }
    if (filters.instructor !== 'all') {
      filtered = filtered.filter((session: any) => session.instructor === filters.instructor);
    }
    setFilteredSessions(filtered);
  }, [filters, sessions]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ status: 'all', instructor: 'all', dateRange: 'all' });
  };

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
      <SessionHeader
        userName={userAccess.userName}
        currentTime={currentTime}
        isEnrolled={userAccess.isEnrolled}
        sessionCount={filteredSessions.length}
        styles={styles}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <SessionStats stats={sessionStats} styles={styles} />

        <SessionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          uniqueInstructors={uniqueInstructors}
          userAccess={userAccess}
          onToggleEnrollment={handleToggleEnrollment}
          styles={styles}
        />

        <div className="space-y-6">
          {filteredSessions.length === 0 ? (
            <div className={`${styles.card.background} rounded-2xl ${styles.cardShadow} ${styles.cardBorder} text-center py-16`}>
              <div className={`w-16 h-16 ${styles.backgroundSecondary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <FaFilter className={`w-8 h-8 ${styles.icon.secondary}`} />
              </div>
              <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-2`}>No Sessions Found</h3>
              <p className={`${styles.textSecondary}`}>Try adjusting your filters to see more sessions.</p>
            </div>
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filteredSessions.map((session: any, index: number) => (
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