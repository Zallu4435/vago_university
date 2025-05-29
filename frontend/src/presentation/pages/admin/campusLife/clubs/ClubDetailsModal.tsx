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
      bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
      text: 'text-green-300',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/20',
      icon: '✅',
    },
    inactive: {
      bg: 'bg-gradient-to-r from-red-500/20 to-pink-500/20',
      text: 'text-red-300',
      border: 'border-red-400/30',
      glow: 'shadow-red-500/20',
      icon: '❌',
    },
    pending: {
      bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
      text: 'text-yellow-300',
      border: 'border-yellow-400/30',
      glow: 'shadow-yellow-500/20',
      icon: '⏳',
    },
    approved: {
      bg: 'bg-gradient-to-r from-green-500/20 to-teal-500/20',
      text: 'text-green-300',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/20',
      icon: '✨',
    },
    rejected: {
      bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
      text: 'text-red-300',
      border: 'border-red-400/30',
      glow: 'shadow-red-500/20',
      icon: '🚫',
    },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm shadow-lg ${config.bg} ${config.text} ${config.border} ${config.glow}`}
    >
      <span className="mr-2 text-base">{config.icon}</span>
      <span className="capitalize">{status}</span>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, accent = 'purple' }) => {
  const accentColors = {
    purple: 'border-purple-400/30 bg-purple-500/10 text-purple-300',
    blue: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
    green: 'border-green-400/30 bg-green-500/10 text-green-300',
    pink: 'border-pink-400/30 bg-pink-500/10 text-pink-300',
    cyan: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${accentColors[accent]}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-2">
          <div
            className={`p-2 rounded-lg bg-gradient-to-br from-${accent}-400/20 to-${accent}-600/20 border border-${accent}-400/30`}
          >
            <Icon size={18} className={`text-${accent}-300`} />
          </div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-white font-medium leading-relaxed">{value}</p>
      </div>
    </div>
  );
};

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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Main Modal Container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          {/* Header Section */}
          <div className="relative z-10 px-8 py-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{club.icon || '🎓'}</div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {clubName}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Club ID: {(isClub ? club._id : club.id) || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
              >
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative z-10 p-8">
            {/* Status and Key Info Row */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
              <StatusBadge status={club.status} />
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span>{formatDate(club.createdAt)}</span>
                </div>
                {club.nextMeeting && (
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-blue-400" />
                    <span>{formatDate(club.nextMeeting)}</span>
                  </div>
                )}
                {isClub && (
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-green-400" />
                    <span>{club.members} Members</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <InfoCard
                icon={OrganizerIcon}
                label={isClub ? 'Created By' : 'Requested By'}
                value={createdBy || 'Unknown'}
                accent="purple"
              />
              <InfoCard icon={Info} label="Club Type" value={club.type || 'Unknown'} accent="blue" />
              {isClub && (
                <InfoCard icon={Users} label="Members" value={`${club.members} Members`} accent="green" />
              )}
              {isClub && (
                <InfoCard icon={Info} label="Role" value={club.role || 'N/A'} accent="pink" />
              )}
              {club.nextMeeting && (
                <InfoCard
                  icon={Calendar}
                  label="Next Meeting"
                  value={formatDate(club.nextMeeting)}
                  accent="cyan"
                />
              )}
              {!isClub && club.whyJoin && (
                <InfoCard icon={Sparkles} label="Why Join" value={club.whyJoin} accent="purple" />
              )}
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <Info size={20} className="text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Club Description</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">{club.about || 'No description available'}</p>

                {!isClub && club.additionalInfo && (
                  <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <h4 className="text-sm font-medium text-blue-300 mb-2 flex items-center">
                      <Sparkles size={16} className="mr-2" />
                      Additional Information
                    </h4>
                    <p className="text-sm text-gray-300">{club.additionalInfo}</p>
                  </div>
                )}

                {isClub && club.upcomingEvents && club.upcomingEvents.length > 0 && (
                  <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                    <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                      <Calendar size={16} className="mr-2" />
                      Upcoming Events
                    </h4>
                    <div className="space-y-2">
                      {club.upcomingEvents.map((event, index) => (
                        <p key={index} className="text-sm text-gray-300">
                          {formatDate(event.date)} - {event.description}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm"
              >
                Close
              </button>
              {isClub && onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(club as Club);
                  }}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                >
                  Edit Club
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsModal;