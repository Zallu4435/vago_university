import React, { useState } from 'react';
import {
  IoReturnUpBackOutline as Reply,
  IoTrashOutline as Trash2,
  IoCloseOutline as X,
  IoMailOutline as Mail,
} from 'react-icons/io5';
import WarningModal from '../../../components/common/WarningModal';
import { MessageDetailsModalProps } from '../../../../domain/types/management/communicationmanagement';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';
import { ghostParticles } from '../../../../shared/constants/communicationManagementConstants';

const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  message,
  onReply,
  onDelete,
  isOpen,
  onClose,
  messageType,
}) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  usePreventBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleDeleteClick = () => {
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteWarning(false);
  };

  return (
    <>
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

        <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
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
                      ? message?.sender?.name
                      : Array.isArray(message?.recipients)
                        ? message?.recipients.map(r => r?.name).join(', ')
                        : message?.recipients || 'Multiple Recipients'}
                  </p>
                  <p className="text-purple-200">
                    {messageType === 'inbox'
                      ? message?.sender?.email
                      : Array.isArray(message?.recipients)
                        ? message?.recipients.map(r => r?.email).join(', ')
                        : message?.recipients || `${message.recipientsCount} recipients`}
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
    </>
  );
};

export default MessageDetailsModal;