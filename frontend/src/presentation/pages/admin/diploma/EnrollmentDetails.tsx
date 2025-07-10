import React from 'react';
import { FiXCircle, FiUser, FiBook, FiClock, FiPercent } from 'react-icons/fi';
import { EnrollmentDetailsProps, InfoCardProps } from '../../../../domain/types/management/diplomamanagement';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';

const EnrollmentDetails: React.FC<EnrollmentDetailsProps> = ({ isOpen, onClose, enrollment, isLoading }) => {
  usePreventBodyScroll(isOpen);

  if (!isOpen || isLoading) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const ghostParticles = Array(20).fill(0).map((_, i) => ({
    size: Math.random() * 8 + 4,
    top: Math.random() * 100,
    left: Math.random() * 100,
    animDuration: Math.random() * 10 + 10,
    animDelay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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

      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-3xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-600/30"
                style={{ backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' }}
              >
                <FiUser size={24} className="text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{enrollment.studentName}</h2>
                <p className="text-sm text-purple-300">Enrollment ID: {enrollment._id.slice(-8).toUpperCase()}</p>
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

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <InfoCard icon={<FiBook size={18} />} label="Course" value={enrollment.courseTitle} />
            <InfoCard icon={<FiUser size={18} />} label="Email" value={enrollment.studentEmail} />
            <InfoCard icon={<FiClock size={18} />} label="Enrollment Date" value={formatDate(enrollment.enrollmentDate)} />
            <InfoCard
              icon={<FiPercent size={18} />}
              label="Progress"
              value={`${enrollment.progress}%`}
            />
            <InfoCard
              icon={<FiBook size={18} />}
              label="Status"
              value={
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    enrollment.status === 'Pending'
                      ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                      : enrollment.status === 'Approved'
                      ? 'bg-green-900/30 text-green-400 border-green-500/30'
                      : 'bg-red-900/30 text-red-400 border-red-500/30'
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full mr-1.5"
                    style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
                  ></span>
                  {enrollment.status}
                </span>
              }
            />
          </div>

          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <FiPercent size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Progress Overview</h3>
              </div>
              <div className="p-6">
                <div className="w-full bg-gray-900/60 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
                <p className="text-purple-300 mt-2">{enrollment.progress}% Completed</p>
              </div>
            </div>
          </div>

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

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <div className="text-purple-300">{icon}</div>
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value}</p>
  </div>
);

export default EnrollmentDetails;