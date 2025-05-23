// src/presentation/pages/admin/communication/MessageDetailsModal.tsx
import React, { useState } from 'react';
import { 
  IoReturnUpBackOutline as Reply,
  IoArchiveOutline as Archive,
  IoTrashOutline as Trash2,
  IoCloseOutline as X,
} from 'react-icons/io5';
import WarningModal from '../../../components/WarningModal';

interface Message {
  id: string;
  from?: string;
  email?: string;
  to?: string;
  subject: string;
  date: string;
  time: string;
  status: 'unread' | 'read' | 'delivered' | 'opened';
  content: string;
  thread?: { id: string; from: string; content: string; date: string; time: string }[];
  recipients?: number;
}

interface MessageDetailsModalProps {
  message: Message;
  onReply: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({
  message,
  onReply,
  onArchive,
  onDelete,
  isOpen,
  onClose,
}) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

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
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-purple-500/20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Message Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-300">{message.from ? 'From:' : 'To:'}</span>
                    <p className="text-white">{message.from || message.to}</p>
                    {message.email && <p className="text-gray-400">{message.email}</p>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Date:</span>
                    <p className="text-white">{`${message.date} at ${message.time}`}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-medium text-gray-300">Subject:</span>
                  <p className="text-white">{message.subject}</p>
                </div>
                {message.recipients && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-300">Recipients:</span>
                    <p className="text-white">{message.recipients}</p>
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{message.content}</p>
              </div>

              {message.thread && message.thread.length > 0 && (
                <div className="border-t border-gray-600 pt-4">
                  <h3 className="font-medium text-white mb-3">Conversation Thread</h3>
                  <div className="space-y-3">
                    {message.thread.map((reply) => (
                      <div key={reply.id} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-white">{reply.from}</span>
                          <span className="text-xs text-gray-400">{`${reply.date} at ${reply.time}`}</span>
                        </div>
                        <p className="text-gray-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-3">
                {message.from && (
                  <button
                    onClick={onReply}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Reply size={16} />
                    <span>Reply</span>
                  </button>
                )}
                {message.from && (
                  <button
                    onClick={onArchive}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <Archive size={16} />
                    <span>Archive</span>
                  </button>
                )}
              </div>
              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
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
    </>
  );
};

export default MessageDetailsModal;