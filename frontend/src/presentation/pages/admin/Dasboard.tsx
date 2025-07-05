import React, { useState, useEffect } from 'react';
import { useAdminDashboard } from '../../../application/hooks/useAdminDashboard';
import { 
  HiUsers, 
  HiCurrencyDollar, 
  HiBookOpen, 
  HiClock, 
  HiUserAdd, 
  HiPlus, 
  HiBell, 
  HiDocumentText, 
  HiCreditCard, 
  HiCog,
  HiTrendingUp,
  HiTrendingDown,
  HiCalendar,
  HiHeart,
  HiChat,
  HiVideoCamera,
  HiDatabase,
  HiCheckCircle,
  HiExclamationCircle,
  HiLightningBolt,
  HiSparkles,
  HiStar,
  HiXCircle
} from 'react-icons/hi';
import { 
  GiOnTarget,
  GiTrophy,
  GiLightningTear
} from 'react-icons/gi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Use the actual hook data
  const {
    metrics,
    userGrowth,
    revenue,
    performance,
    activities,
    alerts,
    isLoading: hookLoading,
    error,
    refreshDashboard,
    dismissAlert,
    markActivityAsRead
  } = useAdminDashboard();

  useEffect(() => {
    // Simulate loading with staggered animations
    setTimeout(() => setLoading(false), 1200);
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Use actual data or fallback to empty arrays/objects
  const userGrowthData = userGrowth || [];
  const revenueData = revenue || [];
  const performanceData = performance || [];
  const activitiesData = activities || [];
  const alertsData = alerts || [];

  // Ensure chart data is always an array and has the required structure
  const safeUserGrowthData = Array.isArray(userGrowthData) ? userGrowthData : [];
  const safeRevenueData = Array.isArray(revenueData) ? revenueData : [];
  const safePerformanceData = Array.isArray(performanceData) ? performanceData : [];
  const safeActivitiesData = Array.isArray(activitiesData) ? activitiesData : [];
  const safeAlertsData = Array.isArray(alertsData) ? alertsData : [];

  // console.log('User Growth Data:', safeUserGrowthData);
  // console.log('Revenue Data:', safeRevenueData);
  // console.log('Performance Data:', safePerformanceData);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'success': return <HiCheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />;
      case 'warning': return <HiExclamationCircle className="h-5 w-5 text-amber-400 mt-0.5" />;
      case 'error': return <HiExclamationCircle className="h-5 w-5 text-red-400 mt-0.5" />;
      default: return <HiBell className="h-5 w-5 text-blue-400 mt-0.5" />;
    }
  };

  // Get alert background color based on type
  const getAlertBgColor = (type: string) => {
    switch(type) {
      case 'success': return 'bg-emerald-900/30';
      case 'warning': return 'bg-amber-900/30';
      case 'error': return 'bg-red-900/30';
      default: return 'bg-blue-900/30';
    }
  };

  // Get alert border color based on type
  const getAlertBorderColor = (type: string) => {
    switch(type) {
      case 'success': return 'border-emerald-400';
      case 'warning': return 'border-amber-400';
      case 'error': return 'border-red-400';
      default: return 'border-blue-400';
    }
  };

  // Get alert text color based on type
  const getAlertTextColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-emerald-200';
      case 'warning': return 'text-amber-200';
      case 'error': return 'text-red-200';
      default: return 'text-blue-200';
    }
  };

  // Get alert subtext color based on type
  const getAlertSubtextColor = (type: string) => {
    switch(type) {
      case 'success': return 'text-emerald-300';
      case 'warning': return 'text-amber-300';
      case 'error': return 'text-red-300';
      default: return 'text-blue-300';
    }
  };

  // Handle alert dismissal
  const handleDismissAlert = async (alertId: string) => {
    try {
      await dismissAlert(alertId);
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  // Handle activity read
  const handleMarkActivityAsRead = async (activityId: string) => {
    try {
      await markActivityAsRead(activityId);
    } catch (error) {
      console.error('Failed to mark activity as read:', error);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await refreshDashboard();
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    }
  };


  const EnhancedMetricCard = ({ title, value, subtitle, trend, icon: Icon, bgGradient, trendUp, delay = 0 }: any) => (
    <div 
      className="group relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Ghost orb background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className={`${bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl`}>
        {/* Animated background orbs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700 blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-600 blur-lg"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl shadow-inner">
                <Icon className="h-7 w-7 text-white drop-shadow-sm" />
              </div>
              <div className="ml-4">
                <p className="text-white text-opacity-90 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-white drop-shadow-sm">{loading ? '---' : value}</p>
              </div>
            </div>
            <div className="text-right">
              <HiSparkles className="h-5 w-5 text-white opacity-70 animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-white text-opacity-80 text-sm">{subtitle}</p>
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1 backdrop-blur-sm">
              {trendUp ? (
                <HiTrendingUp className="h-4 w-4 text-white mr-1" />
              ) : (
                <HiTrendingDown className="h-4 w-4 text-white mr-1" />
              )}
              <span className="text-white text-sm font-semibold">{trend}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnimatedQuickActionCard = ({ icon: Icon, title, onClick, color = "purple", delay = 0 }: any) => (
    <div 
      className="group relative"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {/* Ghost orb background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md backdrop-blur-sm border border-${color}-500/30`}>
            <Icon className={`h-5 w-5 text-${color}-400`} />
          </div>
          <h3 className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors duration-200">{title}</h3>
          <div className="mt-1 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"></div>
        </div>
      </div>
    </div>
  );

  const GlassPanel = ({ title, children, icon: Icon }: any) => (
    <div className="group relative">
      {/* Ghost orb background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-500/20">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-8 h-8 border-purple-500/20 rotate-45 rounded-lg"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-purple-500/20 rotate-12 rounded-full"></div>
          <div className="absolute top-1/2 right-4 w-4 h-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rotate-45 rounded-sm"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg shadow-lg backdrop-blur-sm">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white ml-3">{title}</h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  const EnhancedActivityItem = ({ action, user, time, avatar, type = "default" }: any) => {
    const getTypeColor = (type: string) => {
      switch(type) {
        case 'success': return 'from-emerald-400 to-emerald-600';
        case 'warning': return 'from-amber-400 to-orange-500';
        case 'info': return 'from-blue-400 to-blue-600';
        default: return 'from-purple-400 to-purple-600';
      }
    };

    return (
      <div className="flex items-center space-x-4 py-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/30 rounded-lg transition-colors duration-200 px-2 backdrop-blur-sm">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(type)} rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm`}>
            <span className="text-sm font-bold text-white">{avatar}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200">{action}</p>
          <p className="text-xs text-gray-400 flex items-center">
            <span className="mr-1">by</span>
            <span className="font-medium">{user}</span>
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-500/30 backdrop-blur-sm">
            {time}
          </span>
        </div>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="text-center group">
      <div className="flex items-center justify-center mb-3">
        <div className={`p-3 rounded-full bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-300">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );

  if (loading || hookLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
        {/* Ghost orbs for loading */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
          <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/10 blur-md"
              style={{
                width: `${Math.random() * 12 + 4}px`,
                height: `${Math.random() * 12 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${
                  Math.random() * 5
                }s`,
              }}
            />
          ))}
        </div>
        
        <div className="space-y-6 relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error loading dashboard</div>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
      {/* Ghost orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-md"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${
                Math.random() * 5
              }s`,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-300 mt-2">Welcome back! Here's what's happening at your institution.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-purple-500/20 hover:bg-gray-700/50 transition-colors">
                  <HiSparkles className="h-5 w-5 text-purple-400" />
                </div>
              </button>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-500/20">
                  <p className="text-sm font-medium text-gray-300">Current Time</p>
                  <p className="text-lg font-bold text-white">{currentTime.toLocaleTimeString()}</p>
                  <p className="text-sm text-gray-400">{currentTime.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EnhancedMetricCard
            title="Total Users"
            value={metrics ? formatNumber(metrics.totalUsers) : '0'}
            subtitle="Students, Faculty & Staff"
            trend="+5%"
            icon={HiUsers}
            bgGradient="bg-gradient-to-br from-purple-600 to-purple-800"
            trendUp={true}
            delay={0}
          />
          <EnhancedMetricCard
            title="Total Revenue"
            value={metrics ? formatCurrency(metrics.totalRevenue) : '$0'}
            subtitle="This month"
            trend="+12%"
            icon={HiCurrencyDollar}
            bgGradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
            trendUp={true}
            delay={100}
          />
          <EnhancedMetricCard
            title="Active Courses"
            value={metrics ? formatNumber(metrics.activeCourses) : '0'}
            subtitle="Currently running"
            trend="+3"
            icon={HiBookOpen}
            bgGradient="bg-gradient-to-br from-blue-600 to-blue-800"
            trendUp={true}
            delay={200}
          />
          <EnhancedMetricCard
            title="Pending Approvals"
            value={metrics ? formatNumber(metrics.pendingApprovals) : '0'}
            subtitle="Requires attention"
            trend="-2"
            icon={HiClock}
            bgGradient="bg-gradient-to-br from-amber-600 to-orange-700"
            trendUp={false}
            delay={300}
          />
        </div>

        {/* Enhanced Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GlassPanel title="User Growth & Targets" icon={HiTrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={safeUserGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    color: '#F9FAFB'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fill="url(#colorUsers)"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </GlassPanel>
          
          <GlassPanel title="Revenue Breakdown" icon={HiCurrencyDollar}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={safeRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    color: '#F9FAFB'
                  }}
                />
                <Bar dataKey="tuition" stackId="a" fill="#8B5CF6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="fees" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="other" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassPanel>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <GiLightningTear className="h-5 w-5 mr-2 text-amber-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <AnimatedQuickActionCard icon={HiUserAdd} title="Users" color="purple" delay={0} />
            <AnimatedQuickActionCard icon={HiBookOpen} title="Courses" color="blue" delay={100} />
            <AnimatedQuickActionCard icon={HiBell} title="Notifications" color="indigo" delay={200} />
            <AnimatedQuickActionCard icon={HiCreditCard} title="Payments" color="emerald" delay={300} />
            <AnimatedQuickActionCard icon={HiDocumentText} title="Materials" color="cyan" delay={400} />
            <AnimatedQuickActionCard icon={HiVideoCamera} title="Videos" color="pink" delay={500} />
          </div>
        </div>

        {/* Performance Overview - Full Width */}
        <div className="mb-8">
          <GlassPanel title="Module Performance Metrics" icon={GiOnTarget}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-2">
              {safePerformanceData?.map((item, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-200 flex flex-col justify-center items-center h-32 bg-gray-700/30 backdrop-blur-sm rounded-lg p-3 hover:bg-gray-700/50 border border-gray-600/20 hover:border-purple-500/30">
                  <div className="relative w-14 h-14 mx-auto mb-2">
                    <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="2"
                        strokeDasharray={`${item.value}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{item.value}%</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-300 leading-tight">{item.name}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Enhanced Activities & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassPanel title="Recent Activities" icon={HiLightningBolt}>
            <div className="space-y-2">
              {safeActivitiesData.length > 0 ? (
                safeActivitiesData.map((activity, index) => (
                  <div key={activity.id} className="cursor-pointer" onClick={() => handleMarkActivityAsRead(activity.id)}>
                    <EnhancedActivityItem
                      action={activity.action}
                      user={activity.user}
                      time={activity.time}
                      avatar={activity.avatar}
                      type={activity.type}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <HiLightningBolt className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">No recent activities</p>
                </div>
              )}
            </div>
          </GlassPanel>
          
          <GlassPanel title="System Alerts" icon={HiBell}>
            <div className="space-y-4">
              {safeAlertsData.length > 0 ? (
                safeAlertsData.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`flex items-start space-x-3 p-3 ${getAlertBgColor(alert.type)} backdrop-blur-sm rounded-lg border-l-4 ${getAlertBorderColor(alert.type)} hover:opacity-80 transition-opacity duration-200 cursor-pointer`}
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${getAlertTextColor(alert.type)}`}>{alert.title}</p>
                      <p className={`text-xs ${getAlertSubtextColor(alert.type)}`}>{alert.message}</p>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismissAlert(alert.id);
                      }}
                    >
                      <HiXCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <HiBell className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">No system alerts</p>
                </div>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;