import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiX, HiUsers, HiDocumentText,
  HiTrendingUp, HiPlay, HiPlus,
  HiDownload, HiClock, HiCheckCircle, HiExclamationCircle,
  HiChevronRight
} from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useFacultyDashboard } from '../../../../application/hooks/useFacultyDashboard';
import { StatsCardProps, ChartCardProps, ActionCardProps, InfoCardProps, StatusCardProps, ToastProps } from '../../../../domain/types/dashboard/faculty';

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, icon: Icon, color = 'blue' }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm flex items-center mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <HiTrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
};

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, onClick, color = 'blue' }) => {
  const gradientClasses: Record<string, string> = {
    blue: 'bg-gradient-to-r from-purple-500 to-pink-500',
    green: 'bg-gradient-to-r from-green-400 to-emerald-500',
    orange: 'bg-gradient-to-r from-orange-400 to-yellow-500',
    red: 'bg-gradient-to-r from-red-500 to-pink-500',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-3xl p-6 w-full shadow-2xl border border-pink-100 text-white flex flex-col justify-between items-start transition-all duration-200 transform hover:scale-105 hover:brightness-110 focus:outline-none ${gradientClasses[color]}`}
      style={{ minHeight: '170px' }}
    >
      <div className="flex items-center justify-between w-full mb-3">
        <div className="bg-white/30 rounded-xl p-2 flex items-center justify-center">
          <Icon className="w-8 h-8" />
        </div>
        <HiChevronRight className="w-5 h-5 opacity-70" />
      </div>
      <h3 className="text-lg font-semibold mb-1 text-white drop-shadow-lg">{title}</h3>
      <p className="text-sm opacity-90 text-white/90">{description}</p>
    </button>
  );
};

const InfoCard: React.FC<InfoCardProps> = ({ title, children, expandable = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {expandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <HiChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
      <div className={`transition-all duration-200 ${expandable && !isExpanded ? 'max-h-20 overflow-hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const StatusCard: React.FC<StatusCardProps> = ({ title, status, message, timestamp }) => {
  const statusColors: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    success: HiCheckCircle,
    warning: HiExclamationCircle,
    error: HiExclamationCircle,
    info: HiClock
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${statusColors[status]}`}>
          <StatusIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
          <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

// Toast Notification Component
const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  const typeColors: Record<string, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border shadow-lg z-50 ${typeColors[type]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const FacultyDashboard: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const navigate = useNavigate();

  const {
    stats,
    weeklyAttendance,
    assignmentPerformance,
    sessionDistribution,
    recentActivities,
    isLoading,
    hasError
  } = useFacultyDashboard();

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleAction = async (action: string) => {
    try {
      switch (action) {
        case 'Session Start':
          navigate('/faculty/sessions');
          break;

        case 'Assignment Creation':
          navigate('/faculty/assignments');
          break;

        case 'Attendance Management':
          navigate('/faculty/attendance');
          break;

        case 'Report Export':
          showToast('Report export functionality coming soon!');
          break;

        default:
          showToast(`${action} initiated successfully!`);
      }
    } catch (error) {
      showToast(`Error: ${error}`, 'error');
    }
  };

  if (hasError) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HiExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">There was an error loading the dashboard data.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2dhover:bg-blue-700"
          >
            Retry roun
          </button>
        </div>ed-md
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)]?.map((_, i) => (
                <LoadingSkeleton key={i} className="h-32 rounded-3xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)]?.map((_, i) => (
                <LoadingSkeleton key={i} className="h-64 rounded-3xl" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100">
                <StatsCard
                  title="Total Sessions"
                  value={stats?.totalSessions || 0}
                  icon={HiClock}
                  color="blue"
                />
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100">
                <StatsCard
                  title="Total Assignments"
                  value={stats?.totalAssignments || 0}
                  icon={HiDocumentText}
                  color="green"
                />
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100">
                <StatsCard
                  title="Total Attendance"
                  value={stats?.totalAttendance || 0}
                  icon={HiUsers}
                  color="orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100">
                <ChartCard title={<span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-lg font-semibold">Weekly Attendance Trend</span>}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={Array.isArray(weeklyAttendance) ? weeklyAttendance : []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100">
                <ChartCard title={<span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-lg font-semibold">Assignment Performance</span>}>
                  <ResponsiveContainer width="100%" height={200}>
                    {Array.isArray(assignmentPerformance) && assignmentPerformance.length > 0 ? (
                      <BarChart data={assignmentPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="assignment" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#10B981" />
                      </BarChart>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <HiDocumentText className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">No assignment data available</p>
                          <p className="text-xs">Create and publish assignments to see performance data</p>
                        </div>
                      </div>
                    )}
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100">
                <ChartCard title={<span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-lg font-semibold">Session Distribution</span>}>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={Array.isArray(sessionDistribution) ? sessionDistribution : []}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(Array.isArray(sessionDistribution) ? sessionDistribution : [])?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActionCard
                title="Start Session"
                description="Begin a new teaching session"
                icon={HiPlay}
                onClick={() => handleAction('Session Start')}
                color="blue"
              />
              <ActionCard
                title="Create Assignment"
                description="Add new assignment for students"
                icon={HiPlus}
                onClick={() => handleAction('Assignment Creation')}
                color="green"
              />
              <ActionCard
                title="Attendance"
                description="View and manage student attendance"
                icon={HiUsers}
                onClick={() => handleAction('Attendance Management')}
                color="orange"
              />
              <ActionCard
                title="Export Reports"
                description="Download attendance and performance reports"
                icon={HiDownload}
                onClick={() => handleAction('Report Export')}
                color="red"
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100">
                <InfoCard title={<span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-lg font-semibold">Recent Activity</span>} expandable={true}>
                  <div className="space-y-3">
                    {(Array.isArray(recentActivities) ? recentActivities : [])?.map((activity) => (
                      <StatusCard
                        key={activity.id}
                        title={activity.type.charAt(0).toUpperCase() + activity.type?.slice(1)}
                        status={activity.type === 'system' ? 'warning' : 'success'}
                        message={activity.message}
                        timestamp={activity.time}
                      />
                    ))}
                  </div>
                </InfoCard>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;