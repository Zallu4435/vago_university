import React from 'react';
import { FiXCircle, FiBook, FiBriefcase, FiUser, FiHash, FiClock, FiUsers, FiCalendar, FiStar, FiBarChart } from 'react-icons/fi';

interface CourseDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    _id: string;
    title: string;
    specialization: string;
    faculty: string;
    credits: number;
    schedule: string;
    maxEnrollment: number;
    currentEnrollment: number;
    description?: string;
    prerequisites?: string[];
    term?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ isOpen, onClose, course }) => {
  if (!isOpen || !course) return null;

  const enrollmentPercentage = (course.currentEnrollment / course.maxEnrollment) * 100;
  const availableSpots = course.maxEnrollment - course.currentEnrollment;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Enhanced floating particles with multiple colors */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-sm ${
            i % 3 === 0 ? 'bg-purple-400/20' : 
            i % 3 === 1 ? 'bg-blue-400/15' : 'bg-cyan-400/10'
          }`}
          style={{
            width: `${Math.random() * 8 + 3}px`,
            height: `${Math.random() * 8 + 3}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatingOrbs ${Math.random() * 20 + 15}s ease-in-out infinite ${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Dynamic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
        {/* Animated header with glassmorphism */}
        <div className="relative p-8 bg-gradient-to-r from-purple-600/20 via-blue-600/15 to-cyan-600/10 backdrop-blur-sm border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
          <div className="relative flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 rotate-3 transform hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm"></div>
                  <FiBook size={28} className="text-white relative z-10" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <FiStar size={12} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Course Overview
                </h3>
                <p className="text-purple-300/80 text-sm">Detailed Information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group relative p-3 rounded-2xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 transition-all duration-300 backdrop-blur-sm"
            >
              <FiXCircle size={20} className="text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/5 transition-all duration-300"></div>
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Course Header Section */}
          <div className="p-8 text-center bg-gradient-to-b from-transparent to-gray-900/20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 leading-tight">
              {course.title}
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full text-sm text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                ID: {course._id.slice(-8).toUpperCase()}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-full text-sm text-green-300 border border-green-500/30 backdrop-blur-sm">
                {availableSpots} spots available
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="px-8 pb-8 space-y-8">
            {/* Key Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                icon={<FiHash size={20} />} 
                label="Credits" 
                value={course.credits.toString()}
                gradient="from-purple-500 to-pink-500"
              />
              <StatCard 
                icon={<FiUsers size={20} />} 
                label="Enrolled" 
                value={`${course.currentEnrollment}/${course.maxEnrollment}`}
                gradient="from-blue-500 to-cyan-500"
              />
              <StatCard 
                icon={<FiBarChart size={20} />} 
                label="Capacity" 
                value={`${Math.round(enrollmentPercentage)}%`}
                gradient="from-green-500 to-emerald-500"
              />
              <StatCard 
                icon={<FiStar size={20} />} 
                label="Level" 
                value="Advanced"
                gradient="from-orange-500 to-red-500"
              />
            </div>

            {/* Enrollment Progress Bar */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-300">Enrollment Progress</span>
                <span className="text-sm text-purple-400 font-semibold">{Math.round(enrollmentPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-purple-500/20"
                  style={{ width: `${enrollmentPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Course Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard 
                icon={<FiBriefcase size={18} />} 
                label="Specialization" 
                value={course.specialization}
                accent="purple"
              />
              <InfoCard 
                icon={<FiUser size={18} />} 
                label="Faculty" 
                value={course.faculty}
                accent="blue"
              />
              <InfoCard 
                icon={<FiClock size={18} />} 
                label="Schedule" 
                value={course.schedule}
                accent="cyan"
              />
              <InfoCard 
                icon={<FiBook size={18} />} 
                label="Term" 
                value={course.term || 'Current Term'}
                accent="green"
              />
            </div>

            {/* Description */}
            {course.description && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                <h5 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                  <FiBook size={18} className="mr-2" />
                  Course Description
                </h5>
                <p className="text-gray-300 leading-relaxed">{course.description}</p>
              </div>
            )}

            {/* Prerequisites */}
            {course.prerequisites?.length > 0 && (
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                <h5 className="text-lg font-semibold text-blue-300 mb-4">Prerequisites</h5>
                <div className="flex flex-wrap gap-3">
                  {course.prerequisites.map((prereq, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-200 rounded-xl text-sm border border-blue-400/30 backdrop-blur-sm hover:scale-105 transition-transform duration-200"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            {(course.createdAt || course.updatedAt) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.createdAt && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-xl border border-white/5">
                    <FiCalendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm text-gray-300">{formatDate(course.createdAt)}</p>
                    </div>
                  </div>
                )}
                {course.updatedAt && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-xl border border-white/5">
                    <FiCalendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm text-gray-300">{formatDate(course.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatingOrbs {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-15px) translateX(10px) scale(1.1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(-5px) scale(0.9);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-10px) translateX(15px) scale(1.05);
            opacity: 0.2;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6));
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8));
        }
      `}</style>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, gradient }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 rounded-2xl blur transition-opacity duration-300" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:scale-105">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'purple' | 'blue' | 'cyan' | 'green';
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value, accent }) => {
  const accentColors = {
    purple: 'border-purple-500/20 bg-purple-900/10',
    blue: 'border-blue-500/20 bg-blue-900/10',
    cyan: 'border-cyan-500/20 bg-cyan-900/10',
    green: 'border-green-500/20 bg-green-900/10'
  };

  return (
    <div className={`p-5 rounded-2xl backdrop-blur-sm border ${accentColors[accent]} hover:scale-[1.02] transition-all duration-300 group`}>
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-xl bg-gradient-to-br from-${accent}-500/20 to-${accent}-600/10 group-hover:scale-110 transition-transform duration-300`}>
          <div className={`text-${accent}-400`}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-${accent}-300 mb-1`}>{label}</p>
          <p className="text-white font-semibold truncate">{value || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;