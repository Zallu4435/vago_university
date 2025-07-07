import React, { useState, useMemo, useRef, useCallback } from 'react';
import { FaClock, FaUsers, FaEye, FaFileAlt, FaCalendarAlt, FaStopwatch, FaFilter, FaSearch, FaChevronDown, FaTimes } from 'react-icons/fa';
import { useSessionManagement } from '../../../../application/hooks/useSessionManagement';
import { useQueryClient } from '@tanstack/react-query';
import type { Session } from '../../../../application/hooks/useSessionManagement';

interface AttendanceInterval {
  joinedAt: string;
  leftAt?: string;
}
interface AttendanceUser {
  id: number;
  username: string;
  email: string;
  intervals: AttendanceInterval[];
}

const SessionAttendancePage = () => {
  const queryClient = useQueryClient();

  const {
    sessions,
    isLoading: isLoadingSessions,
    useSessionAttendance,
    updateAttendanceStatus
  } = useSessionManagement();

  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [attendanceDecisions, setAttendanceDecisions] = useState(new Map());
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!selectedSessionId && sessions && sessions.length > 0) {
      setSelectedSessionId(sessions[1]._id);
    }
  }, [sessions, selectedSessionId]);


  const filters = {
    search: searchTerm || undefined,
    decision: decisionFilter !== 'all' ? decisionFilter : undefined,
    attendanceLevel: attendanceFilter !== 'all' ? attendanceFilter : undefined,
    startDate: dateRange.start || undefined,
    endDate: dateRange.end || undefined,
  };

  const { data: currentAttendanceData = [], isLoading: isLoadingAttendance, refetch: refetchAttendance } = useSessionAttendance(selectedSessionId, filters);

  React.useEffect(() => {
    if (selectedSessionId && refetchAttendance) {
      refetchAttendance();
    }
  }, [selectedSessionId, refetchAttendance]);

  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const currentSession = sessions.find((s: any) => s._id === selectedSessionId);

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
          : new Date();

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


  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };


  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };


  const calculateAttendancePercentage = (
    totalTimeMs: number,
    session?: Session
  ): number => {
    if (!session || !session.duration) return 0;
    const sessionDurationMs = session.duration
      ? session.duration * 60 * 1000
      : 2 * 60 * 60 * 1000;
    return Math.round((totalTimeMs / sessionDurationMs) * 100);
  };


  const processedAttendance = useMemo(() => {
    if (!currentSession) return [];
    return (currentAttendanceData || []).map((user: AttendanceUser) => {
      const totalTime = calculateTotalTime(user.intervals, currentSession?.endTime);
      const attendancePercentage = calculateAttendancePercentage(totalTime, currentSession);
      return {
        ...user,
        totalTime,
        formattedTime: formatDuration(totalTime),
        attendancePercentage,
        sessionData: currentSession,
        status: (user as any).status
      };
    });
  }, [currentAttendanceData, currentSession]);

  const filteredSessions = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return sessions;
    return sessions.filter((session: any) => {
      const sessionDate = new Date(session.startTime);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      if (startDate) {
        startDate.setHours(0, 0, 0, 0);
      }
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      if (startDate && sessionDate < startDate) return false;
      if (endDate && sessionDate > endDate) return false;
      return true;
    });
  }, [dateRange, sessions]);

  // Debounced search function
  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setIsSearching(true);

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(searchValue);
      setIsSearching(false);
      if (refetchAttendance) {
        refetchAttendance();
      }
    }, 500);
  }, [refetchAttendance]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  }, [debouncedSearch]);

  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      setIsSearching(false);
      setSearchTerm(e.currentTarget.value);
      if (refetchAttendance) {
        refetchAttendance();
      }
    }
  }, [refetchAttendance]);

  const clearFilters = () => {
    setSearchTerm('');
    setAttendanceFilter('all');
    setDecisionFilter('all');
    setDateRange({ start: '', end: '' });
    setIsSearching(false);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    if (refetchAttendance) {
      refetchAttendance();
    }
  };

  const handleAttendanceDecision = async (userId: string, decision: string) => {
    setAttendanceDecisions(prev => new Map(prev.set(userId, decision)));
    const user = (currentAttendanceData || []).find((u: any) => u.id.toString() === userId.toString());
    const name = user?.username || '';
    if (selectedSessionId && userId) {
      try {
        await updateAttendanceStatus(selectedSessionId, userId, decision, name);
        await queryClient.invalidateQueries({ queryKey: ['sessionAttendance', selectedSessionId] });
        if (refetchAttendance) {
          await refetchAttendance();
        }
      } catch (err) {
        console.error('Error updating attendance status:', err);
      }
    }
  };

  const handleViewIntervals = (user: any) => {
    setSelectedUser(user);
  };

  const closeIntervalModal = () => {
    setSelectedUser(null);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceRecommendation = (percentage: number) => {
    if (percentage >= 75) return 'approve';
    if (percentage >= 50) return 'review';
    return 'decline';
  };

  const getDecisionButtonStyle = (decision: string, currentDecision: string, userStatus?: string) => {
    if (userStatus === 'approved' || userStatus === 'approve') {
      if (decision === 'approve') return 'bg-green-600 text-white';
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
    if (userStatus === 'declined' || userStatus === 'decline') {
      if (decision === 'decline') return 'bg-red-600 text-white';
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
    if (decision === currentDecision) {
      if (decision === 'approve') return 'bg-green-600 text-white';
      if (decision === 'decline') return 'bg-red-600 text-white';
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  if (isLoadingSessions || isLoadingAttendance) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (!selectedSessionId) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a session</h2>
          <p className="text-gray-500">Please select a session from the dropdown to view attendance details.</p>
        </div>
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
                Session Attendance Management
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaFileAlt className="w-4 h-4" />
                  <span className="font-medium">{currentSession?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>{currentSession?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{currentSession?.startTime} - {currentSession?.endTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{processedAttendance.length}</div>
                <div className="text-sm text-gray-500">Total Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{currentSession?.duration} minutes</div>
                <div className="text-sm text-gray-500">Session Duration</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Session
              </label>
              <select
                value={selectedSessionId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSelectedSessionId(e.target.value);
                  clearFilters();
                  setTimeout(() => {
                    if (searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }, 100);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {filteredSessions.map((session: any) => (
                  <option key={session._id} value={session._id}>
                    {session.title} - {new Date(session.startTime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <div className="relative">
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name or email..."
                  defaultValue={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-end">
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

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Attendance Filter */}
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

                {/* Decision Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision Status
                  </label>
                  <select
                    value={decisionFilter}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDecisionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Decisions</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => refetchAttendance && refetchAttendance()}
                  disabled={isLoadingAttendance}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSearch className="w-4 h-4" />
                  {isLoadingAttendance ? 'Loading...' : 'Apply Filters'}
                </button>
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

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUsers className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Faculty Attendance Review</h2>
                <span className="text-sm text-gray-500 ml-2">Review and approve student attendance based on session time</span>
              </div>
              {processedAttendance.length === 0 && (
                <div className="text-sm text-gray-500">
                  No students found matching current filters
                </div>
              )}
            </div>
          </div>

          {processedAttendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faculty Decision
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {processedAttendance.map((user: AttendanceUser & { totalTime: number; formattedTime: string; attendancePercentage: number; sessionData: any, status?: string }) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaStopwatch className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {user.formattedTime}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(user.attendancePercentage)}`}>
                          {user.attendancePercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.intervals.length} session{user.intervals.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.status === 'approved' || user.status === 'approve' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">Approved</span>
                          ) : user.status === 'declined' || user.status === 'decline' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-red-600 bg-red-100">Declined</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full text-yellow-600 bg-yellow-100">Not updated</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAttendanceDecision(user.id.toString(), 'approve')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${getDecisionButtonStyle('approve', attendanceDecisions.get(user.id.toString()) || '', user.status)}`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAttendanceDecision(user.id.toString(), 'decline')}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${getDecisionButtonStyle('decline', attendanceDecisions.get(user.id.toString()) || '', user.status)}`}
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleViewIntervals(user)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <FaEye className="w-3 h-3" />
                            View Details
                          </button>
                        </div>
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
                No students match your current filter criteria or this session has no attendees.
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

      {/* Interval Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Session Details for {selectedUser.username}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Total time: {formatDuration(calculateTotalTime(selectedUser.intervals, currentSession?.endTime))} ({selectedUser.attendancePercentage}% attendance)
                  </p>
                  {(() => {
                    const recommendation = getAttendanceRecommendation(selectedUser.attendancePercentage);
                    const decision = attendanceDecisions.get(selectedUser.id.toString());

                    return (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Status:</span>
                        {decision ? (
                          <span className={`font-medium ${decision === 'approve' ? 'text-green-600' : 'text-red-600'}`}>
                            {decision === 'approve' ? 'Approved' : 'Declined'}
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-medium">
                            Recommended: {recommendation.charAt(0).toUpperCase() + recommendation.slice(1)}
                          </span>
                        )}
                      </div>
                    );
                  })()}
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
                {selectedUser.intervals.map((interval: AttendanceInterval, index: number) => {
                  let intervalDuration = 0;
                  if (interval.joinedAt) {
                    const joinTime = new Date(interval.joinedAt);
                    let leaveTime: Date;
                    if (interval.leftAt) {
                      leaveTime = new Date(interval.leftAt);
                    } else if (currentSession?.endTime) {
                      leaveTime = new Date(currentSession.endTime);
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
                              Session {index + 1}
                            </div>
                            <div className="text-xs text-gray-500">
                              {interval.joinedAt ? formatTime(interval.joinedAt) : 'Invalid'} - {interval.leftAt ? formatTime(interval.leftAt) : (currentSession?.endTime ? formatTime(currentSession.endTime) : 'Now')}
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
};

export default SessionAttendancePage;