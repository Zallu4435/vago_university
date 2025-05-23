import React from 'react';
import { FiXCircle, FiBook, FiBriefcase, FiUser, FiHash, FiClock, FiUsers } from 'react-icons/fi';

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
    term: string;
  };
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ isOpen, onClose, course }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      {/* Floating ghost particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/10 blur-md"
          style={{
            width: `${Math.random() * 12 + 4}px`,
            height: `${Math.random() * 12 + 4}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Main purple glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-4xl mx-4 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-500/20 overflow-hidden">
        <div className="p-6 border-b border-purple-500/20 sticky top-0 bg-gray-800/70 backdrop-blur-md z-20 flex justify-between items-center">
          <h3 className="text-xl font-bold text-purple-300">Course Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-purple-900/30 transition-all duration-300 text-purple-300 hover:text-white"
          >
            <FiXCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg shadow-purple-500/20 relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full backdrop-blur-sm"></div>
              <FiBook size={36} className="text-white relative z-10" />
            </div>
            <h4 className="text-xl font-semibold text-white">{course.title}</h4>
            <p className="text-sm text-gray-400 mt-2">Course ID: {course._id}</p>
          </div>

          {/* Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow icon={<FiBriefcase size={16} />} label="Specialization" value={course.specialization} />
            <InfoRow icon={<FiUser size={16} />} label="Faculty" value={course.faculty} />
            <InfoRow icon={<FiHash size={16} />} label="Credits" value={course.credits.toString()} />
            <InfoRow icon={<FiClock size={16} />} label="Schedule" value={course.schedule} />
            <InfoRow icon={<FiUsers size={16} />} label="Enrollment" value={`${course.currentEnrollment}/${course.maxEnrollment}`} />
            <InfoRow icon={<FiBook size={16} />} label="Term" value={course.term} />
          </div>

          {course.description && (
            <div className="mt-6">
              <h5 className="text-sm font-medium text-purple-300 mb-2">Description</h5>
              <p className="text-sm text-gray-300">{course.description}</p>
            </div>
          )}

          {course.prerequisites?.length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-medium text-purple-300 mb-2">Prerequisites</h5>
              <div className="flex flex-wrap gap-2">
                {course.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm border border-purple-500/20"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}
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

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start py-1.5">
      {icon && <div className="mr-2 mt-0.5">{icon}</div>}
      <span className="text-sm text-gray-400 w-1/3">{label}</span>
      <span className="text-sm text-gray-300 flex-1">{value || 'N/A'}</span>
    </div>
  );
};

export default CourseDetails;