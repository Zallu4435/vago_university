import React, { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaEye, 
  FaLock, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaFilter,
  FaCheckCircle,
  FaCircle,
  FaUsers,
  FaHeart,
  FaShareAlt,
  FaDownload,
  FaExpand,
  FaVolumeUp,
  FaComments,
  FaMicrophone,
  FaVideo,
  FaDesktop,
  FaCog,
  FaSignal,
  FaWifi,
  FaRecordVinyl
} from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

interface Session {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  course: string;
  date: string;
  time: string;
  duration: number;
  status: 'live' | 'upcoming' | 'completed';
  hasRecording: boolean;
  attendees: number;
  maxAttendees: number;
  description: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isLive: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | null;
}

interface UserAccess {
  isEnrolled: boolean;
  watchedSessions: string[];
  likedSessions: string[];
  userName: string;
  userRole: string;
}

interface Filters {
  status: 'all' | 'live' | 'upcoming' | 'completed';
  instructor: string;
  dateRange: string;
}

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

  // Mock session data with enhanced information
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

  const getStatusBadge = (status: Session['status'], isLive: boolean) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";
    
    switch (status) {
      case 'upcoming':
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
      default:
        return (
          <span className={`${baseClasses} ${styles.button.secondary} ${styles.textSecondary}`}>
            Unknown
          </span>
        );
    }
  };

  const getDifficultyBadge = (difficulty: Session['difficulty']) => {
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

  const getConnectionQualityIcon = (quality: Session['connectionQuality']) => {
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

  const getActionButton = (session: Session) => {
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
        return null;
    }
  };

  const toggleLike = (sessionId: string) => {
    setUserAccess(prev => ({
      ...prev,
      likedSessions: prev.likedSessions.includes(sessionId)
        ? prev.likedSessions.filter(id => id !== sessionId)
        : [...prev.likedSessions, sessionId]
    }));
  };

  const toggleWatchedStatus = (sessionId: string) => {
    setUserAccess(prev => ({
      ...prev,
      watchedSessions: prev.watchedSessions.includes(sessionId)
        ? prev.watchedSessions.filter(id => id !== sessionId)
        : [...prev.watchedSessions, sessionId]
    }));
  };

  const uniqueInstructors = [...new Set(sessions.map(s => s.instructor))];

  return (
    <div className={`min-h-screen ${styles.background}`}>
      {/* Header */}
      <div className={`${styles.card.background} ${styles.border} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold ${styles.textPrimary} ${styles.accent} bg-clip-text text-transparent`}>
                Live Sessions
              </h1>
              <p className={`text-lg ${styles.textSecondary} mt-1`}>Advanced Web Development - Spring 2025</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`${styles.textSecondary} text-sm`}>Welcome back,</div>
                <div className={`font-semibold ${styles.textPrimary}`}>{userAccess.userName}</div>
              </div>
              <div className={`w-12 h-12 ${styles.accent} rounded-full flex items-center justify-center ${styles.textPrimary} font-bold text-lg`}>
                {userAccess.userName.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 ${styles.status.success} rounded-full animate-pulse`}></div>
              <span className={`${styles.textSecondary} text-sm`}>
                {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${userAccess.isEnrolled ? styles.status.success : styles.status.error} ${styles.badgeBackground}`}>
              {userAccess.isEnrolled ? '✓ Enrolled' : '✗ Not Enrolled'}
            </div>
            <div className={`${styles.textSecondary} text-sm`}>
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${styles.card.background} p-6 rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${styles.textPrimary}`}>
                  {sessions.filter(s => s.status === 'live').length}
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
                  {sessions.filter(s => s.status === 'upcoming').length}
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
                  {sessions.filter(s => s.status === 'completed').length}
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
                  {userAccess.watchedSessions.length}
                </div>
                <div className={`${styles.textSecondary} text-sm mt-1`}>Watched</div>
              </div>
              <div className={`w-12 h-12 ${styles.status.success} rounded-2xl flex items-center justify-center`}>
                <FaEye className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`${styles.card.background} rounded-2xl ${styles.cardShadow} ${styles.cardBorder} p-6 mb-8`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 ${styles.accent} rounded-xl flex items-center justify-center`}>
              <FaFilter className={`w-5 h-5 ${styles.textPrimary}`} />
            </div>
            <h2 className={`text-xl font-semibold ${styles.textPrimary}`}>Filter Sessions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as 'all' | 'live' | 'upcoming' | 'completed' }))}
                className={`w-full px-4 py-3 ${styles.input.border} rounded-xl ${styles.input.background} ${styles.input.focus}`}
                aria-label="Filter by status"
              >
                <option value="all">All Sessions</option>
                <option value="live">🔴 Live</option>
                <option value="upcoming">⏰ Upcoming</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Instructor</label>
              <select
                value={filters.instructor}
                onChange={(e) => setFilters(prev => ({ ...prev, instructor: e.target.value }))}
                className={`w-full px-4 py-3 ${styles.input.border} rounded-xl ${styles.input.background} ${styles.input.focus}`}
                aria-label="Filter by instructor"
              >
                <option value="all">All Instructors</option>
                {uniqueInstructors.map(instructor => (
                  <option key={instructor} value={instructor}>{instructor}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: 'all', instructor: 'all', dateRange: 'all' })}
                className={`w-full px-4 py-3 text-sm font-medium ${styles.button.secondary} ${styles.border} rounded-xl ${styles.cardHover}`}
                aria-label="Clear all filters"
              >
                Clear All Filters
              </button>
            </div>
            
            <div className="flex items-end">
              <label className={`flex items-center gap-2 text-sm font-medium ${styles.textPrimary}`}>
                <input
                  type="checkbox"
                  checked={userAccess.isEnrolled}
                  onChange={(e) => setUserAccess(prev => ({ ...prev, isEnrolled: e.target.checked }))}
                  className={`rounded ${styles.accent} ${styles.input.focus}`}
                  aria-label="Toggle enrollment"
                />
                Demo: Toggle Enrollment
              </label>
            </div>
          </div>
        </div>

        {/* Sessions List */}
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
              <div key={session.id} className={`${styles.card.background} rounded-2xl ${styles.cardShadow} ${styles.cardBorder} ${styles.cardHover} overflow-hidden ${session.status === 'live' ? `${styles.status.error} bg-gradient-to-r ${styles.backgroundSecondary}` : ''}`}>
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{session.instructorAvatar}</div>
                          <div>
                            <h3 className={`text-2xl font-bold ${styles.textPrimary} mb-2`}>
                              Session {index + 1}: {session.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm mb-2">
                              <span className="flex items-center gap-2 font-medium">
                                <FaUser className={`w-4 h-4 ${styles.icon.secondary}`} />
                                <span className={`${styles.textPrimary}`}>{session.instructor}</span>
                              </span>
                              <span className={`${styles.textSecondary}`}>•</span>
                              <span className={`${styles.textSecondary}`}>{session.course}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {session.connectionQuality && getConnectionQualityIcon(session.connectionQuality)}
                          {getStatusBadge(session.status, session.isLive)}
                        </div>
                      </div>
                      
                      <p className={`${styles.textSecondary} mb-4 text-lg`}>{session.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className={`w-4 h-4 ${styles.icon.secondary}`} />
                          <span className={`${styles.textSecondary}`}>
                            {new Date(session.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </span>
                        <span className="flex items-center gap-2">
                          <FaClock className={`w-4 h-4 ${styles.icon.secondary}`} />
                          <span className={`${styles.textSecondary}`}>{session.time} ({session.duration} min)</span>
                        </span>
                        <span className="flex items-center gap-2">
                          <FaUsers className={`w-4 h-4 ${styles.icon.secondary}`} />
                          <span className={`${styles.textSecondary}`}>{session.attendees}/{session.maxAttendees} attendees</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                        {getDifficultyBadge(session.difficulty)}
                        {session.tags.map(tag => (
                          <span key={tag} className={`px-3 py-1 ${styles.backgroundSecondary} ${styles.textSecondary} rounded-full text-xs font-medium`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {session.status === 'completed' && session.hasRecording && userAccess.isEnrolled && (
                          <button
                            onClick={() => toggleWatchedStatus(session.id)}
                            className={`flex items-center gap-2 text-sm font-medium ${styles.textSecondary} hover:${styles.status.success} transition-colors`}
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
                          onClick={() => toggleLike(session.id)}
                          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                            userAccess.likedSessions.includes(session.id)
                              ? `${styles.status.error} hover:${styles.status.error}`
                              : `${styles.textSecondary} hover:${styles.status.error}`
                          }`}
                          aria-label={userAccess.likedSessions.includes(session.id) ? 'Unlike session' : 'Like session'}
                        >
                          <FaHeart className={`w-4 h-4 ${userAccess.likedSessions.includes(session.id) ? 'fill-current' : ''}`} />
                          <span>{userAccess.likedSessions.includes(session.id) ? 'Liked' : 'Like'}</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end gap-4">
                      {session.status === 'live' && (
                        <div className={`flex items-center gap-2 text-sm ${styles.textSecondary} ${styles.backgroundSecondary} px-4 py-2 rounded-xl`}>
                          <div className={`w-2 h-2 ${styles.status.success} rounded-full animate-pulse`}></div>
                          Live for {Math.floor(Math.random() * 45 + 15)} minutes
                        </div>
                      )}
                      
                      {session.attendees > 0 && (
                        <div className={`w-full ${styles.progress.background} rounded-full h-2 mb-2`}>
                          <div 
                            className={`h-2 rounded-full ${styles.progress.fill} transition-all duration-300`}
                            style={{ width: `${(session.attendees / session.maxAttendees) * 100}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {getActionButton(session)}
                    </div>
                  </div>
                  
                  {session.status === 'live' && (
                    <div className={`mt-6 p-4 ${styles.backgroundSecondary} ${styles.border} rounded-xl`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversitySessionsDashboard;