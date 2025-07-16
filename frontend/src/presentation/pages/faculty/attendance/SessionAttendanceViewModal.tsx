import React from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle, FaClock } from 'react-icons/fa';

interface AttendanceInterval {
  joinedAt: string;
  leftAt?: string;
}

interface AttendanceUser {
  id: number;
  username: string;
  email: string;
  intervals: AttendanceInterval[];
  attendancePercentage: number;
}

interface Session {
  endTime?: string;
}

interface SessionAttendanceViewModalProps {
  selectedUser: AttendanceUser | null;
  currentSession: Session | undefined;
  attendanceDecisions: Map<string, string>;
  closeIntervalModal: () => void;
  formatDuration: (ms: number) => string;
  calculateTotalTime: (intervals: AttendanceInterval[], sessionEndTime?: string) => number;
  formatTime: (timestamp: string) => string;
  getAttendanceRecommendation: (percentage: number) => string;
}

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case 'approved':
    case 'approve':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow">
          <FaCheck className="w-3 h-3" /> Approved
        </span>
      );
    case 'declined':
    case 'decline':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow">
          <FaTimes className="w-3 h-3" /> Declined
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow">
          <FaExclamationTriangle className="w-3 h-3" /> Pending
        </span>
      );
  }
};

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
  if (percentage >= 70) return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
  return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
};

const SessionAttendanceViewModal: React.FC<SessionAttendanceViewModalProps> = ({
  selectedUser,
  currentSession,
  attendanceDecisions,
  closeIntervalModal,
  formatDuration,
  calculateTotalTime,
  formatTime,
  getAttendanceRecommendation
}) => {
  if (!selectedUser) return null;

  const decision = attendanceDecisions.get(selectedUser.id.toString());
  const recommendation = getAttendanceRecommendation(selectedUser.attendancePercentage);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-pink-100 animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-pink-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-1">
              Session Details for {selectedUser.username}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow ${getAttendanceColor(selectedUser.attendancePercentage)}`}>
                <FaClock className="w-3 h-3 mr-1" />
                {selectedUser.attendancePercentage}% Attendance
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                {formatDuration(calculateTotalTime(selectedUser.intervals, currentSession?.endTime))} Total
              </span>
              {getStatusBadge(decision || recommendation)}
            </div>
          </div>
          <button
            onClick={closeIntervalModal}
            className="text-gray-400 hover:text-pink-500 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            aria-label="Close modal"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Intervals List */}
        <div className="p-6 max-h-96 overflow-y-auto bg-white/80">
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
                <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-pink-100 shadow flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        Session {index + 1}
                      </div>
                      <div className="text-xs text-gray-500">
                        {interval.joinedAt ? formatTime(interval.joinedAt) : 'Invalid'} - {interval.leftAt ? formatTime(interval.leftAt) : (currentSession?.endTime ? formatTime(currentSession.endTime) : 'Now')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      <FaClock className="w-3 h-3 mr-1" />
                      {formatDuration(intervalDuration)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Duration</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionAttendanceViewModal; 