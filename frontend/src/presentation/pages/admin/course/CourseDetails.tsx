import React, { useEffect } from 'react';
import { FiXCircle, FiBook, FiBriefcase, FiUser, FiHash, FiClock, FiUsers, FiCalendar } from 'react-icons/fi';

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
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  if (!isOpen || !course) return null;

  const enrollmentPercentage = (course.currentEnrollment / course.maxEnrollment) * 100;
  const availableSpots = course.maxEnrollment - course.currentEnrollment;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main Modal Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-600/30"
                style={{ backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' }}
              >
                <FiBook size={24} className="text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{course.title}</h2>
                <p className="text-sm text-purple-300">Course ID: {course._id?.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiXCircle size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          {/* Course Header Section */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <span className="px-4 py-2 bg-gray-800/80 border border-purple-600/30 rounded-lg text-sm text-purple-300">
                ID: {course._id?.slice(-8).toUpperCase()}
              </span>
              <span className="px-4 py-2 bg-gray-800/80 border border-purple-600/30 rounded-lg text-sm text-purple-300">
                {availableSpots} spots available
              </span>
            </div>
          </div>

          {/* Key Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <InfoCard icon={<FiHash size={18} />} label="Credits" value={course.credits?.toString()} />
            <InfoCard icon={<FiUsers size={18} />} label="Enrolled" value={`${course.currentEnrollment}/${course.maxEnrollment}`} />
            <InfoCard icon={<FiUsers size={18} />} label="Capacity" value={`${Math.round(enrollmentPercentage)}%`} />
            <InfoCard icon={<FiUsers size={18} />} label="Level" value="Advanced" />
          </div>

          {/* Enrollment Progress Bar */}
          <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-4 bg-gray-900/60 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-purple-100">Enrollment Progress</h3>
              <span className="text-sm text-purple-300 font-semibold">{Math.round(enrollmentPercentage)}%</span>
            </div>
            <div className="p-6">
              <div className="w-full bg-gray-900/60 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${enrollmentPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Course Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <InfoCard icon={<FiBriefcase size={18} />} label="Specialization" value={course.specialization} />
            <InfoCard icon={<FiUser size={18} />} label="Faculty" value={course.faculty} />
            <InfoCard icon={<FiClock size={18} />} label="Schedule" value={course.schedule} />
            <InfoCard icon={<FiBook size={18} />} label="Term" value={course.term || 'Current Term'} />
          </div>

          {/* Description */}
          {course.description && (
            <div className="mb-8">
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <FiBook size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Course Description</h3>
                </div>
                <div className="p-6">
                  <p className="text-purple-200 leading-relaxed">{course.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {course.prerequisites?.length > 0 && (
            <div className="mb-8">
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <FiBook size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Prerequisites</h3>
                </div>
                <div className="p-6 flex flex-wrap gap-3">
                  {course.prerequisites.map((prereq, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-sm text-purple-300"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          {(course.createdAt || course.updatedAt) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {course.createdAt && (
                <InfoCard icon={<FiCalendar size={18} />} label="Created" value={formatDate(course.createdAt)} />
              )}
              {course.updatedAt && (
                <InfoCard icon={<FiCalendar size={18} />} label="Last Updated" value={formatDate(course.updatedAt)} />
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <div className="text-purple-300">{icon}</div>
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value}</p>
  </div>
);

export default CourseDetails;