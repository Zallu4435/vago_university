import React, { useEffect, useState } from 'react';
import {
  IoReturnUpBackOutline as Reply,
  IoArchiveOutline as Archive,
  IoTrashOutline as Trash2,
  IoCloseOutline as X,
  IoMailOutline as Mail,
} from 'react-icons/io5';
import WarningModal from '../../../components/WarningModal';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  recipients: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'read' | 'unread';
  }>;
  isBroadcast: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'read' | 'unread' | 'delivered' | 'opened';
  recipientsCount: number;
  date?: string;
  time?: string;
}

interface MessageDetailsModalProps {
  message: Message;
  onReply: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onClose: () => void;
  messageType: 'inbox' | 'sent';
}

const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  message,
  onReply,
  onArchive,
  onDelete,
  isOpen,
  onClose,
  messageType,
}) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  // Prevent background scrolling when modal is open
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

  if (!isOpen) return null;

  const handleDeleteClick = () => {
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteWarning(false);
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
    <>
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
        <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
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
                  style={{ backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' }}
                >
                  <Mail size={24} className="text-purple-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-100">{message.subject}</h2>
                  <p className="text-sm text-purple-300">Message ID: {message.id.slice(-8).toUpperCase()}</p>
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
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center mb-2">
                    <Mail size={18} className="text-purple-300" />
                    <span className="ml-2 text-sm font-medium text-purple-300">
                      {messageType === 'inbox' ? 'From' : 'To'}
                    </span>
                  </div>
                  <p className="text-white font-semibold">
                    {messageType === 'inbox'
                      ? message.sender.name
                      : message.recipients[0]?.name || 'Multiple Recipients'}
                  </p>
                  <p className="text-purple-200">
                    {messageType === 'inbox'
                      ? message.sender.email
                      : message.recipients[0]?.email || `${message.recipientsCount} recipients`}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Mail size={18} className="text-purple-300" />
                    <span className="ml-2 text-sm font-medium text-purple-300">Date</span>
                  </div>
                  <p className="text-white font-semibold">{message.updatedAt}</p>
                </div>
              </div>
              {message.recipientsCount > 1 && (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <Mail size={18} className="text-purple-300" />
                    <span className="ml-2 text-sm font-medium text-purple-300">Total Recipients</span>
                  </div>
                  <p className="text-white font-semibold">{message.recipientsCount}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <div className="p-4 bg-gray-900/60 flex items-center">
                <Mail size={20} className="text-purple-300" />
                <h3 className="ml-3 text-lg font-semibold text-purple-100">Message Content</h3>
              </div>
              <div className="p-6">
                <p className="text-purple-200 leading-relaxed">{message.content}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                {messageType === 'inbox' && (
                  <>
                    <button
                      onClick={onReply}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-purple-500/50 flex items-center space-x-2"
                    >
                      <Reply size={18} />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={onArchive}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50 flex items-center space-x-2"
                    >
                      <Archive size={18} />
                      <span>Archive</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleDeleteClick}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-red-500/50 flex items-center space-x-2"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message={`Are you sure you want to delete the message "${message.subject}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

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
    </>
  );
};

export default MessageDetailsModal;