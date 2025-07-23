import React from 'react';
import {
  IoCloseOutline as X,
  IoCalendarOutline as Calendar,
  IoPeopleOutline as Users,
  IoPersonOutline as User,
  IoTrophyOutline as Trophy,
  IoCheckmarkCircleOutline as Check,
  IoCloseCircleOutline as Reject,
  IoHeartOutline as Heart,
  IoDocumentTextOutline as DocumentText,
  IoMailOutline as Mail,
  IoIdCardOutline as IdCard,
} from 'react-icons/io5';
import { 
  TeamRequestDetailsModalProps, 
  TeamRequestDetailsStatusBadgeProps, 
  TeamRequestDetailsInfoCardProps, 
} from '../../../../../domain/types/management/sportmanagement';
import { usePreventBodyScroll } from '../../../../../shared/hooks/usePreventBodyScroll';
import { formatDate, formatDateTime } from '../../../../../shared/utils/dateUtils';

const StatusBadge: React.FC<TeamRequestDetailsStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-600/30', text: 'text-yellow-100', border: 'border-yellow-500/50' },
    approved: { bg: 'bg-green-600/30', text: 'text-green-100', border: 'border-green-500/50' },
    rejected: { bg: 'bg-red-600/30', text: 'text-red-100', border: 'border-red-500/50' },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config?.bg} ${config?.text} ${config?.border}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const InfoCard: React.FC<TeamRequestDetailsInfoCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-300" />
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value}</p>
  </div>
);

const TeamRequestDetailsModal: React.FC<TeamRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  usePreventBodyScroll(isOpen);

  if (!isOpen || !request) return null;

  const { sport, user } = request.sportRequest;

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
                style={{ backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' }}
              >
                <Trophy size={24} className="text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{sport.title}</h2>
                <p className="text-sm text-purple-300">Request ID: {request.sportRequest.id}</p>
                <div className="flex items-center mt-2">
                  <StatusBadge status={request.sportRequest.status as StatusType} />
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
            <StatusBadge status={request.sportRequest.status as StatusType} />
            <div className="flex items-center space-x-6 text-sm text-purple-300">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-400" />
                <span>{formatDate(request.sportRequest.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-purple-400" />
                <span>{sport.playerCount} Players</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <InfoCard icon={User} label="Requested By" value={user.name} />
            <InfoCard icon={Mail} label="Contact Email" value={user.email} />
            <InfoCard icon={Trophy} label="Sport Type" value={sport.type} />
            <InfoCard icon={User} label="Coach" value={sport.headCoach} />
            <InfoCard icon={IdCard} label="Team ID" value={sport.id} />
            <InfoCard icon={Calendar} label="Last Updated" value={formatDateTime(request.sportRequest.updatedAt)} />
            <InfoCard icon={Users} label="Player Count" value={sport.playerCount} />
            <InfoCard icon={Trophy} label="Division" value={sport.division} />
          </div>

          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Heart size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Why Join</h3>
              </div>
              <div className="p-6">
                <p className="text-purple-200 leading-relaxed">{request.sportRequest.whyJoin}</p>
              </div>
            </div>
          </div>

          {request.sportRequest.additionalInfo && (
            <div className="mb-8">
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <DocumentText size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Additional Information</h3>
                </div>
                <div className="p-6">
                  <p className="text-purple-200 leading-relaxed">{request.sportRequest.additionalInfo}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <User size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Requester Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/60 rounded-lg p-4 border border-purple-600/30">
                  <div className="flex items-center mb-2">
                    <User size={18} className="text-purple-300" />
                    <span className="ml-2 text-sm font-medium text-purple-300">Full Name</span>
                  </div>
                  <p className="text-white font-semibold">{user.name}</p>
                </div>
                <div className="bg-gray-900/60 rounded-lg p-4 border border-purple-600/30">
                  <div className="flex items-center mb-2">
                    <Mail size={18} className="text-purple-300" />
                    <span className="ml-2 text-sm font-medium text-purple-300">Email Address</span>
                  </div>
                  <p className="text-white font-semibold break-all">{user.email}</p>
                </div>
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
              {request.sportRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove?.(request.sportRequest.id)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-green-500/50 flex items-center space-x-2"
                  >
                    <Check size={18} />
                    <span>Approve Request</span>
                  </button>
                  <button
                    onClick={() => onReject?.(request.sportRequest.id)}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-red-500/50 flex items-center space-x-2"
                  >
                    <Reject size={18} />
                    <span>Reject Request</span>
                  </button>
                </>
              )}
              {request.sportRequest.status === 'approved' && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-600/30 border border-green-500/50 rounded-lg">
                  <Check size={18} className="text-green-100" />
                  <span className="text-green-100 font-semibold">Request Approved</span>
                </div>
              )}
              {request.sportRequest.status === 'rejected' && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-600/30 border border-red-500/50 rounded-lg">
                  <Reject size={18} className="text-red-100" />
                  <span className="text-red-100 font-semibold">Request Rejected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

export default TeamRequestDetailsModal;