import React, { useEffect } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiBook, FiAward, FiClock, FiFileText, FiDownload, FiEye, FiInfo } from 'react-icons/fi';

interface FacultyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  faculty: any; // Replace 'any' with your Faculty type
}

const FacultyDetailsModal: React.FC<FacultyDetailsModalProps> = ({ isOpen, onClose, faculty }) => {
  // Prevent backend scrolling when modal is open
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

  if (!isOpen || !faculty) return null;

  const handleDownloadDocument = (url: string, name: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
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

      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border border-purple-500/30">
                <FiUser size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{faculty.fullName}</h2>
                <p className="text-purple-200 flex items-center mt-1">
                  <FiMail size={16} className="mr-2" />
                  {faculty.email}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <StatusBadge status={faculty.status} />
                  <span className="text-sm text-purple-300">ID: {faculty._id}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiX size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <QuickInfoCard
              icon={<FiBook className="text-purple-300" />}
              title="Department"
              value={faculty.department ? faculty.department.replace('-', ' ').toUpperCase() : 'N/A'}
            />
            <QuickInfoCard
              icon={<FiAward className="text-purple-300" />}
              title="Qualification"
              value={faculty.qualification ? faculty.qualification.toUpperCase() : 'N/A'}
            />
            <QuickInfoCard
              icon={<FiClock className="text-purple-300" />}
              title="Experience"
              value={faculty.experience || 'N/A'}
            />
          </div>

          {/* Personal Information */}
          <SectionCard
            title="Personal Information"
            icon={<FiUser className="text-purple-300" />}
            isOpen={true}
            toggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoGroup title="Contact Information">
                <InfoRow label="Email" value={faculty.email} />
                <InfoRow label="Phone" value={faculty.phone || 'N/A'} />
              </InfoGroup>
            </div>
          </SectionCard>

          {/* Professional Information */}
          <SectionCard
            title="Professional Information"
            icon={<FiBook className="text-purple-300" />}
            isOpen={true}
            toggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoGroup title="Academic Details">
                <InfoRow label="Department" value={faculty.department ? faculty.department.replace('-', ' ').toUpperCase() : 'N/A'} />
                <InfoRow label="Qualification" value={faculty.qualification ? faculty.qualification.toUpperCase() : 'N/A'} />
                <InfoRow label="Experience" value={faculty.experience || 'N/A'} />
              </InfoGroup>
            </div>
          </SectionCard>

          {/* Documents */}
          <SectionCard
            title="Uploaded Documents"
            icon={<FiFileText className="text-purple-300" />}
            isOpen={true}
            toggle={() => {}}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {faculty.cvUrl && (
                <div className="flex items-center justify-between p-3 bg-gray-800/80 rounded-lg border border-purple-500/30">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-600/30 rounded-lg mr-3">
                      <FiFileText size={18} className="text-purple-300" />
                    </div>
                    <span className="text-purple-100 font-medium">Curriculum Vitae</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(faculty.cvUrl, '_blank', 'noopener,noreferrer')}
                      className="p-1 text-purple-300 hover:bg-purple-500/20 rounded transition-colors"
                      title="View Document"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(faculty.cvUrl, 'Curriculum_Vitae.pdf')}
                      className="p-1 text-purple-300 hover:bg-purple-500/20 rounded transition-colors"
                      title="Download Document"
                    >
                      <FiDownload size={16} />
                    </button>
                  </div>
                </div>
              )}
              {faculty.certificatesUrl && faculty.certificatesUrl.length > 0 ? (
                faculty.certificatesUrl.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/80 rounded-lg border border-purple-500/30"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-600/30 rounded-lg mr-3">
                        <FiFileText size={18} className="text-purple-300" />
                      </div>
                      <span className="text-purple-100 font-medium">Certificate {index + 1}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
                        className="p-1 text-purple-300 hover:bg-purple-500/20 rounded transition-colors"
                        title="View Document"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(url, `Certificate_${index + 1}.pdf`)}
                        className="p-1 text-purple-300 hover:bg-purple-500/20 rounded transition-colors"
                        title="Download Document"
                      >
                        <FiDownload size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-purple-300">No certificates uploaded</p>
              )}
            </div>
          </SectionCard>

          {/* About Section */}
          {faculty.aboutMe && (
            <SectionCard
              title="About"
              icon={<FiInfo className="text-purple-300" />}
              isOpen={true}
              toggle={() => {}}
            >
              <p className="text-purple-200 whitespace-pre-wrap">{faculty.aboutMe}</p>
            </SectionCard>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-purple-500/30 bg-gray-900/80 p-6">
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

// Component definitions
const QuickInfoCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) => (
  <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      {icon}
      <span className="ml-2 text-sm font-medium text-purple-300">{title}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);

const SectionCard = ({
  title,
  icon,
  isOpen,
  toggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
    <div
      className="p-4 bg-gray-900/60 cursor-pointer hover:bg-purple-900/20 transition-colors flex items-center justify-between"
      onClick={toggle}
    >
      <div className="flex items-center">
        {icon}
        <h3 className="ml-3 text-lg font-semibold text-purple-100">{title}</h3>
      </div>
    </div>
    {isOpen && <div className="p-6">{children}</div>}
  </div>
);

const InfoGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="font-semibold text-purple-100 mb-3 pb-2 border-b border-purple-500/30">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string | number | boolean | null | undefined }) => (
  <div className="flex justify-between py-1">
    <span className="text-purple-300 text-sm">{label}:</span>
    <span className="text-white text-sm font-medium text-right">
      {value === null || value === undefined || value === '' ? 'N/A' : String(value)}
    </span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-600/30', text: 'text-yellow-100', border: 'border-yellow-500/50' },
    approved: { bg: 'bg-green-600/30', text: 'text-green-100', border: 'border-green-500/50' },
    rejected: { bg: 'bg-red-600/30', text: 'text-red-100', border: 'border-red-500/50' },
    offered: { bg: 'bg-blue-600/30', text: 'text-blue-100', border: 'border-blue-500/50' },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default FacultyDetailsModal;