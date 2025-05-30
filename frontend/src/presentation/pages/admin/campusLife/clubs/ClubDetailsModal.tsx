import React from 'react';
import {
  IoCloseOutline as X,
  IoPeopleOutline as Users,
  IoPersonOutline as User,
  IoBusinessOutline as Building,
  IoCalendarOutline as Calendar,
  IoInformationCircleOutline as Info,
  IoSparklesOutline as Sparkles,
} from 'react-icons/io5';
import { Club, ClubRequest } from '../../../../../domain/types/club';

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club | ClubRequest | null;
  onEdit?: (club: Club) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    inactive: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
    pending: {
      bg: 'bg-yellow-600/30',
      text: 'text-yellow-100',
      border: 'border-yellow-500/50',
    },
    approved: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    rejected: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
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

const InfoCard = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number | string; className?: string }>; label: string; value: string }) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-300" />
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({ isOpen, onClose, club, onEdit }) => {
  if (!isOpen || !club) return null;

  const isClub = '_id' in club && 'createdBy' in club;
  const clubName = isClub ? club.name : club.clubName;
  const createdBy = isClub ? club.createdBy : club.requestedBy;
  const OrganizerIcon = createdBy?.includes('Admin') ? Building : User;

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
                style={{ backgroundColor: `${club.color}20`, borderColor: club.color }}
              >
                {club.icon || '🎓'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{clubName}</h2>
                <p className="text-sm text-purple-300">Club ID: {(isClub ? club._id : club.id) || 'N/A'}</p>
                <div className="flex items-center mt-2">
                  <StatusBadge status={club.status} />
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
          {/* Status and Key Info Row */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <StatusBadge status={club.status} />
            <div className="flex items-center space-x-6 text-sm text-purple-300">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-400" />
                <span>{formatDate(club.createdAt)}</span>
              </div>
              {club.nextMeeting && (
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span>{formatDate(club.nextMeeting)}</span>
                </div>
              )}
              {isClub && (
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-purple-400" />
                  <span>{club.members} Members</span>
                </div>
              )}
            </div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <InfoCard
              icon={OrganizerIcon}
              label={isClub ? 'Created By' : 'Requested By'}
              value={createdBy || 'Unknown'}
            />
            <InfoCard icon={Info} label="Club Type" value={club.type || 'Unknown'} />
            {isClub && (
              <InfoCard icon={Users} label="Members" value={`${club.members} Members`} />
            )}
            {isClub && (
              <InfoCard icon={Info} label="Role" value={club.role || 'N/A'} />
            )}
            {club.nextMeeting && (
              <InfoCard
                icon={Calendar}
                label="Next Meeting"
                value={formatDate(club.nextMeeting)}
              />
            )}
            {!isClub && club.whyJoin && (
              <InfoCard icon={Sparkles} label="Why Join" value={club.whyJoin} />
            )}
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Info size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Club Description</h3>
              </div>
              <div className="p-6">
                <p className="text-purple-200 leading-relaxed">{club.about || 'No description available'}</p>
                {!isClub && club.additionalInfo && (
                  <div className="mt-4 p-4 bg-gray-900/60 rounded-lg border border-purple-600/30">
                    <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                      <Sparkles size={16} className="mr-2" />
                      Additional Information
                    </h4>
                    <p className="text-purple-200 text-sm">{club.additionalInfo}</p>
                  </div>
                )}
                {isClub && club.upcomingEvents && club.upcomingEvents.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-900/60 rounded-lg border border-purple-600/30">
                    <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Upcoming Events
                    </h4>
                    <div className="space-y-2">
                      {club.upcomingEvents.map((event, index) => (
                        <p key={index} className="text-sm text-purple-200">
                          {formatDate(event.date)} - {event.description}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Close
              </button>
              {isClub && onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(club as Club);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-blue-500/50"
                >
                  Edit Club
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

export default ClubDetailsModal;