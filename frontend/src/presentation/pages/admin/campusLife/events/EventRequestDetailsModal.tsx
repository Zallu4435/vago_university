import React from 'react';
import { 
    IoCloseOutline as X, 
    IoCalendarOutline as Calendar, 
    IoLocationOutline as MapPin, 
    IoPeopleOutline as Users, 
    IoPersonOutline as User, 
    IoBusinessOutline as Building,
    IoInformationCircleOutline as Info,
    IoTimeOutline as Clock,
    IoCheckmarkCircleOutline as Check,
    IoCloseCircleOutline as Reject,
    IoSparklesOutline as Sparkles,
    IoStarOutline as Star,
    IoMailOutline as Mail,
    IoIdCardOutline as IdCard,
    IoHeartOutline as Heart,
    IoDocumentTextOutline as DocumentText
  } from 'react-icons/io5';
import { EventRequest } from '../../../../../domain/types/event';
import { IconType } from 'react-icons';

type StatusType = 'pending' | 'approved' | 'rejected';
type AccentType = 'purple' | 'blue' | 'green' | 'pink' | 'cyan' | 'gold';

interface StatusBadgeProps {
  status: StatusType;
}

interface InfoCardProps {
  icon: IconType;
  label: string;
  value: string;
  accent?: AccentType;
  highlight?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: { 
      bg: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20', 
      text: 'text-amber-300', 
      border: 'border-amber-400/30',
      glow: 'shadow-amber-500/25',
      icon: '⏳',
      pulse: 'animate-pulse'
    },
    approved: { 
      bg: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20', 
      text: 'text-emerald-300', 
      border: 'border-emerald-400/30',
      glow: 'shadow-emerald-500/25',
      icon: '✅',
      pulse: ''
    },
    rejected: { 
      bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20', 
      text: 'text-red-300', 
      border: 'border-red-400/30',
      glow: 'shadow-red-500/25',
      icon: '❌',
      pulse: ''
    }
  };

  const config = statusConfig[status];
  
  return (
    <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-bold border backdrop-blur-sm shadow-xl ${config.bg} ${config.text} ${config.border} ${config.glow} ${config.pulse}`}>
      <span className="mr-3 text-lg animate-bounce">{config.icon}</span>
      <span className="capitalize tracking-wide">{status}</span>
    </div>
  );
};

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value, accent = "purple", highlight = false }) => {
  const accentColors = {
    purple: {
      card: "border-purple-400/40 bg-gradient-to-br from-purple-500/15 to-purple-600/10",
      text: "text-purple-300",
      icon: "bg-gradient-to-br from-purple-400/30 to-purple-600/20 border-purple-400/40 text-purple-300",
      hover: "hover:shadow-purple-500/30"
    },
    blue: {
      card: "border-blue-400/40 bg-gradient-to-br from-blue-500/15 to-blue-600/10",
      text: "text-blue-300",
      icon: "bg-gradient-to-br from-blue-400/30 to-blue-600/20 border-blue-400/40 text-blue-300",
      hover: "hover:shadow-blue-500/30"
    },
    green: {
      card: "border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10",
      text: "text-emerald-300",
      icon: "bg-gradient-to-br from-emerald-400/30 to-emerald-600/20 border-emerald-400/40 text-emerald-300",
      hover: "hover:shadow-emerald-500/30"
    },
    pink: {
      card: "border-pink-400/40 bg-gradient-to-br from-pink-500/15 to-pink-600/10",
      text: "text-pink-300",
      icon: "bg-gradient-to-br from-pink-400/30 to-pink-600/20 border-pink-400/40 text-pink-300",
      hover: "hover:shadow-pink-500/30"
    },
    cyan: {
      card: "border-cyan-400/40 bg-gradient-to-br from-cyan-500/15 to-cyan-600/10",
      text: "text-cyan-300",
      icon: "bg-gradient-to-br from-cyan-400/30 to-cyan-600/20 border-cyan-400/40 text-cyan-300",
      hover: "hover:shadow-cyan-500/30"
    },
    gold: {
      card: "border-yellow-400/40 bg-gradient-to-br from-yellow-500/15 to-amber-600/10",
      text: "text-yellow-300",
      icon: "bg-gradient-to-br from-yellow-400/30 to-amber-600/20 border-yellow-400/40 text-yellow-300",
      hover: "hover:shadow-yellow-500/30"
    }
  };

  const colors = accentColors[accent];

  return (
    <div className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm p-6 transition-all duration-500 hover:scale-110 hover:shadow-2xl transform-gpu ${colors.card} ${colors.hover} ${highlight ? 'ring-2 ring-white/20 shadow-xl' : ''}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-2 right-2 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl border backdrop-blur-sm ${colors.icon}`}>
            <Icon size={22} className="drop-shadow-sm" />
          </div>
          {highlight && <Star size={16} className="text-yellow-400 animate-pulse" />}
        </div>
        <div className="space-y-2">
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest opacity-80">{label}</span>
          <p className={`text-white font-semibold text-lg leading-tight ${colors.text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

interface EventRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: EventRequest | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const EventRequestDetailsModal: React.FC<EventRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !request) return null;

  const { data } = request;
  const { event, user } = data;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
      <div className="relative w-full max-w-4xl mx-auto my-8">
        {/* Main Modal Container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 border border-purple-500/40 rounded-3xl shadow-2xl">
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-transparent to-blue-600/15"></div>
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Header Section */}
          <div className="relative z-10 px-6 py-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-purple-400/30 backdrop-blur-sm">
                  <Sparkles size={24} className="text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 font-medium">Request ID: {data.id}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-gray-800/60 border border-gray-600/40 hover:bg-gray-700/60 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              >
                <X size={20} className="text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative z-10 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Status and Key Info Row */}
            <div className="flex flex-wrap items-center justify-between mb-10 gap-6">
              <StatusBadge status={data.status} />
              <div className="flex items-center space-x-8 text-sm font-medium">
                <div className="flex items-center space-x-3 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-400/20">
                  <Calendar size={18} className="text-purple-400" />
                  <span className="text-purple-200">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-3 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-400/20">
                  <Clock size={18} className="text-blue-400" />
                  <span className="text-blue-200">Created: {formatDateTime(data.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <InfoCard 
                icon={User} 
                label="Requested By" 
                value={user.name} 
                accent="purple" 
                highlight={true}
              />
              <InfoCard 
                icon={Mail} 
                label="Contact Email" 
                value={user.email} 
                accent="blue" 
              />
              <InfoCard 
                icon={MapPin} 
                label="Event Location" 
                value={event.location} 
                accent="green" 
              />
              <InfoCard 
                icon={Calendar} 
                label="Event Date" 
                value={formatDate(event.date)} 
                accent="pink" 
              />
              <InfoCard 
                icon={IdCard} 
                label="Event ID" 
                value={event.id} 
                accent="cyan" 
              />
              <InfoCard 
                icon={Clock} 
                label="Last Updated" 
                value={formatDateTime(data.updatedAt)} 
                accent="gold" 
              />
            </div>

            {/* Description Section */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-sm shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <Info size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Event Description</h3>
                </div>
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-600/20">
                  <p className="text-gray-200 leading-relaxed text-lg">{event.description}</p>
                </div>
              </div>
            </div>

            {/* Why Join Section */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-8 border border-emerald-500/30 backdrop-blur-sm shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                    <Heart size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Why Join</h3>
                </div>
                <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-600/20">
                  <p className="text-gray-200 leading-relaxed text-lg">{data.whyJoin}</p>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            {data.additionalInfo && (
              <div className="mb-10">
                <div className="bg-gradient-to-r from-cyan-900/30 to-indigo-900/30 rounded-2xl p-8 border border-cyan-500/30 backdrop-blur-sm shadow-xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-400/30">
                      <DocumentText size={24} className="text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Additional Information</h3>
                  </div>
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-600/20">
                    <p className="text-gray-200 leading-relaxed text-lg">{data.additionalInfo}</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Details Section */}
            <div className="mb-10">
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-8 border border-blue-500/30 backdrop-blur-sm shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <User size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Requester Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-600/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <User size={20} className="text-blue-400" />
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Full Name</span>
                    </div>
                    <p className="text-white font-semibold text-lg">{user.name}</p>
                  </div>
                  <div className="bg-gray-800/40 rounded-xl p-6 border border-gray-600/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <Mail size={20} className="text-cyan-400" />
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Email Address</span>
                    </div>
                    <p className="text-white font-semibold text-lg break-all">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={onClose}
                className="px-8 py-4 text-sm font-bold text-gray-300 bg-gray-800/60 border border-gray-600/40 rounded-2xl hover:bg-gray-700/60 transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                Close
              </button>
              {data.status === 'pending' && (
                <>
                  <button 
                    onClick={() => onApprove?.(data.id)}
                    className="px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 border border-transparent rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-emerald-500/30 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Check size={18} />
                    <span>Approve Request</span>
                  </button>
                  <button 
                    onClick={() => onReject?.(data.id)}
                    className="px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 border border-transparent rounded-2xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-xl hover:shadow-red-500/30 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Reject size={18} />
                    <span>Reject Request</span>
                  </button>
                </>
              )}
              {data.status === 'approved' && (
                <div className="flex items-center space-x-3 px-6 py-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl">
                  <Check size={20} className="text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Request Approved</span>
                </div>
              )}
              {data.status === 'rejected' && (
                <div className="flex items-center space-x-3 px-6 py-3 bg-red-500/20 border border-red-400/30 rounded-2xl">
                  <Reject size={20} className="text-red-400" />
                  <span className="text-red-300 font-semibold">Request Rejected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRequestDetailsModal;    