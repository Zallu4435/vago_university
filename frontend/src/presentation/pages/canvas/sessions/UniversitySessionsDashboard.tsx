import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';
import { Session, UserAccess, Filters } from './types/SessionTypes';
import { SessionHeader } from './components/SessionHeader';
import { SessionStats } from './components/SessionStats';
import { SessionFilters } from './components/SessionFilters';
import { SessionCard } from './components/SessionCard';
import { calculateSessionStats } from './utils/sessionUtils';

// Mock session data
const mockSessions: Session[] = [
  {
    id: 'session-1',
    title: 'React Hooks & Advanced Patterns',
    instructor: 'Dr. Sarah Johnson',
    instructorAvatar: '👩‍🏫',
    course: 'Advanced Web Development',
    date: '2025-06-07',
    time: '10:00',
    duration: 90,
    status: 'completed',
    hasRecording: true,
    attendees: 156,
    maxAttendees: 200,
    description: 'Deep dive into React Hooks, custom hooks, and advanced component patterns',
    tags: ['React', 'Hooks', 'Frontend'],
    difficulty: 'Advanced',
    isLive: false,
    connectionQuality: 'excellent'
  },
  {
    id: 'session-2',
    title: 'State Management with Redux Toolkit',
    instructor: 'Prof. Michael Chen',
    instructorAvatar: '👨‍💼',
    course: 'Advanced Web Development',
    date: '2025-06-07',
    time: '14:30',
    duration: 120,
    status: 'live',
    hasRecording: false,
    attendees: 89,
    maxAttendees: 150,
    description: 'Modern Redux patterns and best practices with Redux Toolkit',
    tags: ['Redux', 'State Management', 'JavaScript'],
    difficulty: 'Intermediate',
    isLive: true,
    connectionQuality: 'good'
  },
  {
    id: 'session-3',
    title: 'API Integration & Error Handling',
    instructor: 'Dr. Sarah Johnson',
    instructorAvatar: '👩‍🏫',
    course: 'Advanced Web Development',
    date: '2025-06-08',
    time: '09:00',
    duration: 90,
    status: 'completed',
    hasRecording: true,
    attendees: 134,
    maxAttendees: 200,
    description: 'Best practices for API integration, error handling, and loading states',
    tags: ['API', 'Error Handling', 'Async'],
    difficulty: 'Intermediate',
    isLive: false,
    connectionQuality: 'excellent'
  },
  {
    id: 'session-4',
    title: 'Testing React Applications',
    instructor: 'Prof. Michael Chen',
    instructorAvatar: '👨‍💼',
    course: 'Advanced Web Development',
    date: '2025-06-09',
    time: '11:00',
    duration: 105,
    status: 'upcoming',
    hasRecording: false,
    attendees: 0,
    maxAttendees: 180,
    description: 'Unit testing, integration testing, and E2E testing strategies',
    tags: ['Testing', 'Jest', 'Cypress'],
    difficulty: 'Advanced',
    isLive: false,
    connectionQuality: null
  },
  {
    id: 'session-5',
    title: 'Deployment & CI/CD Pipeline',
    instructor: 'Dr. Emily Rodriguez',
    instructorAvatar: '👩‍💻',
    course: 'Advanced Web Development',
    date: '2025-06-10',
    time: '15:00',
    duration: 120,
    status: 'upcoming',
    hasRecording: false,
    attendees: 0,
    maxAttendees: 160,
    description: 'Modern deployment strategies and continuous integration',
    tags: ['DevOps', 'CI/CD', 'Deployment'],
    difficulty: 'Advanced',
    isLive: false,
    connectionQuality: null
  }
];

const UniversitySessionsDashboard = () => {
  const { styles } = usePreferences();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    instructor: 'all',
    dateRange: 'all'
  });
  const [userAccess, setUserAccess] = useState<UserAccess>({
    isEnrolled: true,
    watchedSessions: ['session-1', 'session-3'],
    likedSessions: ['session-1'],
    userName: 'Alex Johnson',
    userRole: 'Student'
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize sessions
  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const updatedSessions = mockSessions.map(session => {
      const sessionDate = session.date;
      const [hours, minutes] = session.time.split(':').map(Number);
      const sessionTime = hours * 60 + minutes;
      const sessionEndTime = sessionTime + session.duration;

      let status: Session['status'] = session.status;
      
      if (sessionDate === currentDate) {
        if (currentTime >= sessionTime && currentTime <= sessionEndTime) {
          status = 'live';
        } else if (currentTime > sessionEndTime) {
          status = 'completed';
        } else {
          status = 'upcoming';
        }
      } else if (sessionDate < currentDate) {
        status = 'completed';
      } else {
        status = 'upcoming';
      }

      return { ...session, status };
    });

    setSessions(updatedSessions);
    setFilteredSessions(updatedSessions);
  }, [currentTime]);

  // Apply filters
  useEffect(() => {
    let filtered = sessions;

    if (filters.status !== 'all') {
      filtered = filtered.filter(session => session.status === filters.status);
    }

    if (filters.instructor !== 'all') {
      filtered = filtered.filter(session => session.instructor === filters.instructor);
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

  const uniqueInstructors = [...new Set(sessions.map(s => s.instructor))];
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
            filteredSessions.map((session, index) => (
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