import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiMenu, HiX, HiBell, HiUser, HiUsers, HiCalendar, HiDocumentText, 
  HiTrendingUp, HiChartBar, HiChartPie, HiPlay, HiPlus, 
  HiPaperAirplane, HiDownload, HiClock, HiCheckCircle, HiExclamationCircle,
  HiChevronRight, HiCog, HiLogout
} from 'react-icons/hi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useFacultyDashboard } from '../../../application/hooks/useFacultyDashboard';


interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  expandable?: boolean;
}

interface StatusCardProps {
  title: string;
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

// Reusable Card Components
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
          {trend && (
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
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
    green: 'bg-green-600 hover:bg-green-700 text-white',
    orange: 'bg-orange-600 hover:bg-orange-700 text-white',
    red: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} rounded-lg p-6 text-left w-full transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-8 h-8" />
        <HiChevronRight className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
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

// Main Dashboard Component
const FacultyDashboard: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const navigate = useNavigate();
  
  const {
    stats,
    weeklyAttendance,
    coursePerformance,
    sessionDistribution,
    recentActivities,
    systemStatus,
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
          // Navigate to sessions page
          navigate('/faculty/sessions');
          break;
          
        case 'Assignment Creation':
          // Navigate to assignments page
          navigate('/faculty/assignments');
          break;
          
        case 'Attendance Management':
          // Navigate to attendance page
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

  // Show error state
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
    <div className="bg-gray-50 min-h-screen">
        {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
              <div className="space-y-6">
                {/* Loading Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)]?.map((_, i) => (
                    <LoadingSkeleton key={i} className="h-32" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)]?.map((_, i) => (
                    <LoadingSkeleton key={i} className="h-64" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Row - Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Active Sessions"
                value={stats?.activeSessions || 0}
                    trend={8}
                icon={HiClock}
                    color="blue"
                  />
                  <StatsCard
                    title="Today's Attendance"
                value={`${stats?.todayAttendance || 0}%`}
                    trend={3}
                icon={HiUsers}
                    color="green"
                  />
                  <StatsCard
                    title="Pending Approvals"
                value={stats?.pendingApprovals || 0}
                    trend={-2}
                icon={HiExclamationCircle}
                    color="orange"
                  />
                  <StatsCard
                    title="Total Students"
                value={stats?.totalStudents || 0}
                    trend={5}
                icon={HiUsers}
                    color="blue"
                  />
                </div>

                {/* Second Row - Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <ChartCard title="Weekly Attendance Trend">
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

                  <ChartCard title="Course Performance">
                    <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={Array.isArray(coursePerformance) ? coursePerformance : []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="course" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  <ChartCard title="Session Distribution">
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

                {/* Third Row - Quick Actions */}
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

                {/* Fourth Row - Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InfoCard title="Recent Activity" expandable={true}>
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

                  <InfoCard title="System Status">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Server Status</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      systemStatus?.serverStatus === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {systemStatus?.serverStatus || 'Unknown'}
                    </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Database</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      systemStatus?.database === 'connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {systemStatus?.database || 'Unknown'}
                    </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Last Backup</span>
                    <span className="text-sm text-gray-500">{systemStatus?.lastBackup || 'Unknown'}</span>
                      </div>
                    </div>
                  </InfoCard>
                </div>
              </div>
            )}
      </div>

      {/* Toast Notification */}
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