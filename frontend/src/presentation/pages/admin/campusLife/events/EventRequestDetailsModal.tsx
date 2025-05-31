import React, { useEffect } from 'react';
import { 
  IoCloseOutline as X, 
  IoCalendarOutline as Calendar, 
  IoLocationOutline as MapPin, 
  IoPeopleOutline as Users, 
  IoPersonOutline as User, 
  IoInformationCircleOutline as Info,
  IoTimeOutline as Clock,
  IoCheckmarkCircleOutline as Check,
  IoCloseCircleOutline as Reject,
  IoSparklesOutline as Sparkles,
  IoDocumentTextOutline as DocumentText,
  IoHeartOutline as Heart,  
  IoMailOutline as Mail
} from 'react-icons/io5';
import { EventRequest } from '../../../../../domain/types/event';

type StatusType = 'pending' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
}

interface InfoCardProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
}

interface EventRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: EventRequest | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-600/30', text: 'text-yellow-100', border: 'border-yellow-500/50' },
    approved: { bg: 'bg-green-600/30', text: 'text-green-100', border: 'border-green-500/50' },
    rejected: { bg: 'bg-red-600/30', text: 'text-red-100', border: 'border-red-500/50' },
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

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-300" />
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);

const EventRequestDetailsModal: React.FC<EventRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
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

  if (!isOpen || !request) return null;

  const { data } = request;
  const { event, user } = data;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border border-purple-500/30">
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{event.title}</h2>
                <p className="text-sm text-purple-300 mt-1">Request ID: {data.id}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <StatusBadge status={data.status} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <X size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          {/* Key Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <InfoCard icon={User} label="Requested By" value={user.name} />
            <InfoCard icon={MapPin} label="Event Location" value={event.location} />
            <InfoCard icon={Calendar} label="Event Date" value={formatDate(event.date)} />
            <InfoCard icon={Mail} label="Contact Email" value={user.email} />
            <InfoCard icon={Clock} label="Last Updated" value={formatDateTime(data.updatedAt)} />
            <InfoCard icon={Users} label="Event ID" value={event.id} />
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Info size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Event Description</h3>
              </div>
              <div className="p-6">
                <p className="text-purple-200 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Why Join Section */}
          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Heart size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Why Join</h3>
              </div>
              <div className="p-6">
                <p className="text-purple-200 leading-relaxed">{data.whyJoin}</p>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          {data.additionalInfo && (
            <div className="mb-8">
              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <DocumentText size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Additional Information</h3>
                </div>
                <div className="p-6">
                  <p className="text-purple-200 leading-relaxed">{data.additionalInfo}</p>
                </div>
              </div>
            </div>
          )}

          {/* Requester Information Section */}
          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <User size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Requester Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-purple-300">Full Name</span>
                    <p className="text-white font-semibold mt-1">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-300">Email Address</span>
                    <p className="text-white font-semibold mt-1 break-all">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-purple-500/30 bg-gray-900/80 p-6">
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Close
              </button>
              {data.status === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove?.(data.id)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center border border-blue-500/50"
                  >
                    <Check size={18} className="mr-2" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => onReject?.(data.id)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center border border-red-500/50"
                  >
                    <Reject size={18} className="mr-2" />
                    Reject Request
                  </button>
                </>
              )}
              {data.status === 'approved' && (
                <div className="flex items-center space-x-3 px-6 py-3 bg-green-600/30 border border-green-500/50 rounded-lg">
                  <Check size={20} className="text-green-100" />
                  <span className="text-green-100 font-semibold">Request Approved</span>
                </div>
              )}
              {data.status === 'rejected' && (
                <div className="flex items-center space-x-3 px-6 py-3 bg-red-600/30 border border-red-500/50 rounded-lg">
                  <Reject size={20} className="text-red-100" />
                  <span className="text-red-100 font-semibold">Request Rejected</span>
                </div>
              )}
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

export default EventRequestDetailsModal;