import React from 'react';
import { IoCloseOutline as X, IoCalendarOutline as Calendar, IoPersonOutline as User, IoInformationCircleOutline as Info } from 'react-icons/io5';
import { NotificationDetailsModalProps, StatusBadgeProps, InfoCardProps } from '../../../../domain/types/management/notificationmanagement';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';
import { formatDate } from '../../../../shared/utils/dateUtils';

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    sent: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    failed: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
    pending: {
      bg: 'bg-yellow-600/30',
      text: 'text-yellow-100',
      border: 'border-yellow-500/50',
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full mr-1.5"
        style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
      ></span>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-300" />
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);

const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({ isOpen, onClose, notification }) => {
  
  usePreventBodyScroll(isOpen);

  if (!isOpen || !notification) return null;

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
                style={{ backgroundColor: '#9333ea20', borderColor: '#9333ea' }}
              >
                🔔
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">{notification.title}</h2>
                <p className="text-sm text-purple-300">Notification ID: {notification.id || 'N/A'}</p>
                <div className="flex items-center mt-2">
                  <StatusBadge status={notification.status} />
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
            <StatusBadge status={notification.status} />
            <div className="flex items-center space-x-6 text-sm text-purple-300">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-400" />
                <span>{formatDate(notification.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <InfoCard
              icon={User}
              label="Created By"
              value={notification.createdBy || 'Unknown'}
            />
            <InfoCard
              icon={User}
              label="Recipient"
              value={
                notification.recipientType === 'individual'
                  ? notification.recipientName || 'N/A'
                  : notification.recipientType?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'N/A'
              }
            />
            <InfoCard icon={Info} label="Status" value={notification?.status?.charAt(0)?.toUpperCase() + notification?.status?.slice(1)} />
          </div>

          <div className="mb-8">
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Info size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Message</h3>
              </div>
              <div className="p-6">
                <p className="text-purple-200 leading-relaxed">{notification.message || 'No message available'}</p>
              </div>
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

export default NotificationDetailsModal;