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
import {
  Club,
  ClubDetailsModalProps,
} from '../../../../../domain/types/management/clubmanagement';
import { usePreventBodyScroll } from '../../../../../shared/hooks/usePreventBodyScroll';
import { formatDate } from '../../../../../shared/utils/dateUtils';
import { StatusBadge, InfoCard, ghostParticles } from '../../../../../shared/constants/clubManagementConstants';

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({ isOpen, onClose, club, onEdit }) => {
  usePreventBodyScroll(isOpen);

  if (!isOpen || !club) return null;

  const isClub = '_id' in club && 'createdBy' in club;
  const clubName = isClub ? club.name : club.clubName;
  const createdBy = isClub ? club.createdBy : club.requestedBy;
  const OrganizerIcon = createdBy?.includes('Admin') ? Building : User;

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

      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

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

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
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

      <style>{`
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