import React, { useState, useMemo } from 'react';
import { 
  FaClock, 
  FaUsers, 
  FaEye, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaStopwatch, 
  FaFilter, 
  FaSearch, 
  FaChevronDown, 
  FaTimes, 
  FaDownload, 
  FaChartBar, 
  FaCheckCircle,
  FaPercentage,
  FaUserGraduate,
  FaClock as FaTimeIcon,
  FaArrowLeft,
  FaUser
} from 'react-icons/fa';
import { useSessionManagement } from '../../../../application/hooks/useSessionManagement';
import type { Session } from '../../../../application/hooks/useSessionManagement';

// Add types for attendance data
interface AttendanceInterval {
  joinedAt: string;
  leftAt?: string;
}

interface AttendanceUser {
  id: number;
  username: string;
  email: string;
  intervals: AttendanceInterval[];
  status?: string;
}

interface StudentAttendanceData {
  studentId: string;
  studentName: string;
  studentEmail: string;
  totalSessions: number;
  totalTimeSpent: number;
  averageAttendance: number;
  approvedSessions: number;
  declinedSessions: number;
  pendingSessions: number;
  sessionDetails: Array<{
    sessionId: string;
    sessionTitle: string;
    sessionDate: string;
    timeSpent: number;
    attendancePercentage: number;
    status: string;
    intervals: AttendanceInterval[];
  }>;
}

const AttendanceSummaryPage = () => {
  // Use the session management hook
  const {
    sessions,
    isLoading: isLoadingSessions,
    useSessionAttendance
  } = useSessionManagement();

  // State for filters
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // all, high, medium, low
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'students' | 'details'>('students');
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendanceData | null>(null);
  const [selectedSessionForIntervals, setSelectedSessionForIntervals] = useState<any>(null);

  // Set default sessionId when sessions load
  React.useEffect(() => {
    if (!selectedSessionId && sessions && sessions.length > 0) {
      setSelectedSessionId(sessions[1]._id);
    }
  }, [sessions, selectedSessionId]);

  // Fetch attendance for selected session
  const { data: currentAttendanceData = [], isLoading: isLoadingAttendance } = useSessionAttendance(selectedSessionId);

  // Get current session data
  const currentSession = sessions.find((s: any) => s._id === selectedSessionId);

  // Fetch attendance for all sessions
  const sessionAttendanceQueries = sessions.map(session => ({
    sessionId: session._id,
    query: useSessionAttendance(session._id)
  }));

  const isLoadingAttendanceAllSessions = sessionAttendanceQueries.some(q => q.query.isLoading);

  // Calculate total time spent for a user
  const calculateTotalTime = (
    intervals: AttendanceInterval[],
    sessionEndTime?: string
  ): number => {
    return intervals.reduce((total: number, interval: AttendanceInterval) => {
      if (!interval.joinedAt) return total;
  
      const joinTime = new Date(interval.joinedAt);
      const leaveTime = interval.leftAt
        ? new Date(interval.leftAt)
        : sessionEndTime
          ? new Date(sessionEndTime)
          : new Date(); // fallback to now
  
      // Ensure both are valid and join < leave
      if (
        !isNaN(joinTime.getTime()) &&
        !isNaN(leaveTime.getTime()) &&
        leaveTime > joinTime
      ) {
        total += leaveTime.getTime() - joinTime.getTime();
      }
  
      return total;
    }, 0);
  };

  // Format duration in hours and minutes
  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // Format time for display
  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = (
    totalTimeMs: number,
    session?: Session
  ): number => {
    if (!session || !session.duration) return 0;
    const sessionDurationMs = session.duration
      ? session.duration * 60 * 1000
      : 2 * 60 * 60 * 1000; // fallback to 2 hours
    return Math.round((totalTimeMs / sessionDurationMs) * 100);
  };

  // Process attendance data - only approved users
  const processedAttendance = useMemo(() => {
    if (!currentSession) return [];
    
    // Filter only approved users
    let data = (currentAttendanceData || [])
      .filter((user: AttendanceUser) => 
        user.status === 'approved' || user.status === 'approve'
      )
      .map((user: AttendanceUser) => {
        const totalTime = calculateTotalTime(user.intervals, currentSession?.endTime);
        const attendancePercentage = calculateAttendancePercentage(totalTime, currentSession);
        return {
          ...user,
          totalTime,
          formattedTime: formatDuration(totalTime),
          attendancePercentage,
          sessionData: currentSession
        };
      });

    // Apply filters
    if (searchTerm) {
      data = data.filter((user: AttendanceUser) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (attendanceFilter !== 'all') {
      data = data.filter((user: AttendanceUser & { attendancePercentage: number }) => {
        if (attendanceFilter === 'high') return user.attendancePercentage >= 75;
        if (attendanceFilter === 'medium') return user.attendancePercentage >= 50 && user.attendancePercentage < 75;
        if (attendanceFilter === 'low') return user.attendancePercentage < 50;
        return true;
      });
    }

    return data;
  }, [currentAttendanceData, currentSession, searchTerm, attendanceFilter]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!processedAttendance.length) return null;

    const totalUsers = processedAttendance.length;
    const avgAttendance = processedAttendance.reduce((sum: number, user: any) => sum + user.attendancePercentage, 0) / totalUsers;
    const highAttendance = processedAttendance.filter((user: any) => user.attendancePercentage >= 75).length;
    const totalTimeSpent = processedAttendance.reduce((sum: number, user: any) => sum + user.totalTime, 0);

    return {
      totalUsers,
      avgAttendance: Math.round(avgAttendance),
      highAttendance,
      totalTimeSpent: formatDuration(totalTimeSpent),
      attendanceDistribution: {
        high: processedAttendance.filter((user: any) => user.attendancePercentage >= 75).length,
        medium: processedAttendance.filter((user: any) => user.attendancePercentage >= 50 && user.attendancePercentage < 75).length,
        low: processedAttendance.filter((user: any) => user.attendancePercentage < 50).length
      }
    };
  }, [processedAttendance]);

  // Filter sessions by date range
  const filteredSessions = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return sessions;
    return sessions.filter((session: any) => {
      const sessionDate = new Date(session.startTime);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      if (startDate && sessionDate < startDate) return false;
      if (endDate && sessionDate > endDate) return false;
      return true;
    });
  }, [dateRange, sessions]);

  const clearFilters = () => {
    setSearchTerm('');
    setAttendanceFilter('all');
    setDateRange({ start: '', end: '' });
  };

  const handleViewIntervals = (user: any) => {
    setSelectedUser(user);
  };

  const closeIntervalModal = () => {
    setSelectedUser(null);
    setSelectedSessionForIntervals(null);
  };

  const handleViewSessionIntervals = (session: any) => {
    setSelectedSessionForIntervals(session);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    if (status === 'approved' || status === 'approve') return 'text-green-600 bg-green-100';
    if (status === 'declined' || status === 'decline') return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const exportAttendanceData = () => {
    if (!summaryStats || !currentSession) return;

    const csvData = [
      ['Student Name', 'Email', 'Time Spent', 'Attendance %', 'Session Count'],
      ...processedAttendance.map((user: any) => [
        user.username,
        user.email,
        user.formattedTime,
        `${user.attendancePercentage}%`,
        user.intervals.length.toString()
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-summary-${currentSession.title}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Process all attendance data to group by student
  const studentsAttendanceData = useMemo(() => {
    const studentMap = new Map<string, StudentAttendanceData>();

    sessionAttendanceQueries.forEach(({ sessionId, query }: any) => {
      const session = sessions.find((s: any) => s._id === sessionId);
      if (!session || !query.data) return;

      const attendanceData = query.data as AttendanceUser[];
      
      attendanceData.forEach((user: AttendanceUser) => {
        const studentId = user.id.toString();
        const totalTime = calculateTotalTime(user.intervals, session?.endTime);
        const attendancePercentage = calculateAttendancePercentage(totalTime, session);

        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            studentId,
            studentName: user.username,
            studentEmail: user.email,
            totalSessions: 0,
            totalTimeSpent: 0,
            averageAttendance: 0,
            approvedSessions: 0,
            declinedSessions: 0,
            pendingSessions: 0,
            sessionDetails: []
          });
        }

        const studentData = studentMap.get(studentId)!;
        studentData.totalSessions++;
        studentData.totalTimeSpent += totalTime;
        
        if (user.status === 'approved' || user.status === 'approve') {
          studentData.approvedSessions++;
        } else if (user.status === 'declined' || user.status === 'decline') {
          studentData.declinedSessions++;
        } else {
          studentData.pendingSessions++;
        }

        studentData.sessionDetails.push({
          sessionId,
          sessionTitle: session.title || session.name || 'Untitled Session',
          sessionDate: new Date(session.startTime).toLocaleDateString(),
          timeSpent: totalTime,
          attendancePercentage,
          status: user.status || 'pending',
          intervals: user.intervals
        });
      });
    });

    // Calculate averages
    studentMap.forEach(student => {
      student.averageAttendance = Math.round(
        student.sessionDetails.reduce((sum, session) => sum + session.attendancePercentage, 0) / student.sessionDetails.length
      );
    });

    return Array.from(studentMap.values());
  }, [sessionAttendanceQueries, sessions]);

  // Filter students
  const filteredStudents = useMemo(() => {
    let data = studentsAttendanceData;

    if (searchTerm) {
      data = data.filter(student =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (attendanceFilter !== 'all') {
      data = data.filter(student => {
        if (attendanceFilter === 'high') return student.averageAttendance >= 75;
        if (attendanceFilter === 'medium') return student.averageAttendance >= 50 && student.averageAttendance < 75;
        if (attendanceFilter === 'low') return student.averageAttendance < 50;
        return true;
      });
    }

    return data;
  }, [studentsAttendanceData, searchTerm, attendanceFilter]);

  const handleStudentClick = (student: StudentAttendanceData) => {
    setSelectedStudent(student);
    setViewMode('details');
  };

  const handleBackToStudents = () => {
    setSelectedStudent(null);
    setViewMode('students');
  };

  if (isLoadingSessions || isLoadingAttendanceAllSessions) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (viewMode === 'details' && selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToStudents}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedStudent.studentName}'s Attendance Details
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4" />
                      <span>{selectedStudent.studentEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="w-4 h-4" />
                      <span>{selectedStudent.totalSessions} sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPercentage className="w-4 h-4" />
                      <span>{selectedStudent.averageAttendance}% average</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedStudent.totalSessions}</p>
                </div>
                <FaCalendarAlt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                  <p className="text-2xl font-bold text-green-600">{selectedStudent.averageAttendance}%</p>
                </div>
                <FaPercentage className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved Sessions</p>
                  <p className="text-2xl font-bold text-yellow-600">{selectedStudent.approvedSessions}</p>
                </div>
                <FaCheckCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Time</p>
                  <p className="text-2xl font-bold text-purple-600">{formatDuration(selectedStudent.totalTimeSpent)}</p>
                </div>
                <FaTimeIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Session Details Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaFileAlt className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Session Attendance Details</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance %
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedStudent.sessionDetails.map((session, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {session.sessionTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{session.sessionDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaStopwatch className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDuration(session.timeSpent)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(session.attendancePercentage)}`}>
                          {session.attendancePercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
                          {session.status === 'approved' || session.status === 'approve' ? 'Approved' : 
                           session.status === 'declined' || session.status === 'decline' ? 'Declined' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewSessionIntervals(session)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                        >
                          <FaEye className="w-3 h-3" />
                          View Intervals
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Session Intervals Modal */}
        {selectedSessionForIntervals && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Session Intervals for {selectedStudent?.studentName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedSessionForIntervals.sessionTitle} - {selectedSessionForIntervals.sessionDate}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Total time: {formatDuration(selectedSessionForIntervals.timeSpent)} ({selectedSessionForIntervals.attendancePercentage}% attendance)
                    </p>
                  </div>
                  <button
                    onClick={closeIntervalModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {selectedSessionForIntervals.intervals.map((interval: AttendanceInterval, index: number) => {
                    let intervalDuration = 0;
                    if (interval.joinedAt) {
                      const joinTime = new Date(interval.joinedAt);
                      let leaveTime: Date;
                      if (interval.leftAt) {
                        leaveTime = new Date(interval.leftAt);
                      } else {
                        leaveTime = new Date();
                      }
                      if (!isNaN(joinTime.getTime()) && !isNaN(leaveTime.getTime()) && leaveTime > joinTime) {
                        intervalDuration = leaveTime.getTime() - joinTime.getTime();
                      }
                    }
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Interval {index + 1}
                              </div>
                              <div className="text-xs text-gray-500">
                                {interval.joinedAt ? formatTime(interval.joinedAt) : 'Invalid'} - {interval.leftAt ? formatTime(interval.leftAt) : 'Now'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDuration(intervalDuration)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Duration
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Student Attendance Summary
              </h1>
              <p className="text-gray-600">Click on a student to view their detailed attendance across all sessions</p>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {summaryStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{summaryStats.totalUsers}</p>
                </div>
                <FaUserGraduate className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                  <p className="text-2xl font-bold text-green-600">{summaryStats.avgAttendance}%</p>
                </div>
                <FaPercentage className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Attendance</p>
                  <p className="text-2xl font-bold text-yellow-600">{summaryStats.highAttendance}</p>
                </div>
                <FaCheckCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Time</p>
                  <p className="text-2xl font-bold text-purple-600">{summaryStats.totalTimeSpent}</p>
                </div>
                <FaTimeIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaFilter className="w-4 h-4" />
                Filters
                <FaChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendance Level
                  </label>
                  <select
                    value={attendanceFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAttendanceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Levels</option>
                    <option value="high">High (≥75%)</option>
                    <option value="medium">Medium (50-74%)</option>
                    <option value="low">Low (&lt;50%)</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaUsers className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Students</h2>
              <span className="text-sm text-gray-500 ml-2">Click on a student to view their attendance details</span>
            </div>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Sessions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Attendance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approved Sessions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleStudentClick(student)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {student.studentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.studentName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.totalSessions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(student.averageAttendance)}`}>
                          {student.averageAttendance}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.approvedSessions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaStopwatch className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDuration(student.totalTimeSpent)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStudentClick(student);
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                        >
                          <FaEye className="w-3 h-3" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaUsers className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-500 mb-4">
                No students match your current filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryPage; 