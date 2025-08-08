import React from 'react';
import { 
  IoCloseOutline as X, 
  IoCalendarOutline as Calendar, 
  IoTimeOutline as Clock, 
  IoLocationOutline as MapPin, 
  IoPeopleOutline as Users, 
  IoPersonOutline as User, 
  IoInformationCircleOutline as Info,
  IoDocumentTextOutline as DocumentText,
  IoSparklesOutline as Sparkles,
  IoHeartOutline as Heart,  
  IoMailOutline as Mail,
  IoCheckmarkOutline as Check,
  IoCloseCircleOutline as Reject
} from 'react-icons/io5';
import { 
  EventRequestDetailsModalProps,
  EventRequestDetailsStatusBadgeProps,
  EventRequestDetailsInfoCardProps,
} from '../../../../../domain/types/management/eventmanagement';
import { usePreventBodyScroll } from '../../../../../shared/hooks/usePreventBodyScroll';
import { formatDate, formatDateTime } from '../../../../../shared/utils/dateUtils';

const StatusBadge: React.FC<EventRequestDetailsStatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-yellow-600/30', text: 'text-yellow-100', border: 'border-yellow-500/50' },
    approved: { bg: 'bg-green-600/30', text: 'text-green-100', border: 'border-green-500/50' },
    rejected: { bg: 'bg-red-600/30', text: 'text-red-100', border: 'border-red-500/50' },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
};

const InfoCard: React.FC<EventRequestDetailsInfoCardProps> = ({ icon: Icon, label, value }) => (
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
  usePreventBodyScroll(isOpen);

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="relative bg-gray-800 rounded-lg shadow-xl border border-purple-500/30 w-full max-w-2xl mx-auto my-8 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border border-purple-500/30">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-100">{request.event?.title || request.eventName}</h2>
              <p className="text-xs text-purple-300 mt-1">Request ID: {request.id}</p>
              <div className="flex items-center mt-1 space-x-2">
                <StatusBadge status={request.status} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
          >
            <X size={22} className="text-purple-300" />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoCard icon={User} label="Requested By" value={request.user?.name || request.requestedBy} />
            <InfoCard icon={Mail} label="Email" value={request.user?.email || 'N/A'} />
            <InfoCard icon={MapPin} label="Venue" value={request.event?.location || request.proposedVenue || 'N/A'} />
            <InfoCard icon={Calendar} label="Event Date" value={request.event?.date ? formatDate(request.event.date) : (request.proposedDate ? formatDate(request.proposedDate) : 'N/A')} />
            <InfoCard icon={Clock} label="Requested At" value={formatDateTime(request.createdAt || request.requestedAt || '')} />
            <InfoCard icon={Users} label="Expected Participants" value={request.expectedParticipants?.toString() || 'N/A'} />
            <InfoCard icon={DocumentText} label="Type" value={request.type || 'N/A'} />
            <InfoCard icon={Info} label="Status" value={request.status} />
          </div>

          <div className="mb-6">
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Info size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Event Description</h3>
              </div>
              <div className="p-6">
                <p className="text-purple-200 leading-relaxed">{request.event?.description || request.description}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Heart size={20} className="text-pink-300" />
                <h3 className="ml-3 text-lg font-semibold text-pink-100">Why Join</h3>
              </div>
              <div className="p-6">
                <p className="text-pink-200 leading-relaxed">{request.whyJoin}</p>
              </div>
            </div>
          </div>

          {request.additionalInfo && (
            <div className="mb-6">
              <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-900/60 flex items-center">
                  <Info size={20} className="text-purple-300" />
                  <h3 className="ml-3 text-lg font-semibold text-purple-100">Additional Info</h3>
                </div>
                <div className="p-6">
                  <p className="text-purple-200 leading-relaxed">{request.additionalInfo}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-2 px-5 rounded-lg font-semibold transition-colors border border-gray-500/50"
            >
              Close
            </button>
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove?.(request.id)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-2 px-5 rounded-lg font-semibold transition-colors flex items-center justify-center border border-blue-500/50"
                >
                  <Check size={18} className="mr-2" />
                  Approve Request
                </button>
                <button
                  onClick={() => onReject?.(request.id)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2 px-5 rounded-lg font-semibold transition-colors flex items-center justify-center border border-red-500/50"
                >
                  <Reject size={18} className="mr-2" />
                  Reject Request
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRequestDetailsModal;