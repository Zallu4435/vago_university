import { useState } from 'react';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunication';
import { Message } from '../../../../domain/types/communication';
import { FaSearch, FaChevronRight, FaTrash, FaEnvelopeOpen } from 'react-icons/fa';
import PropTypes from 'prop-types';
import WarningModal from '../../../components/WarningModal';

export default function InboxSection() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const { inboxMessages: messages, isLoadingInbox: isLoading, handleViewMessage, handleDeleteMessage } =
    useCommunicationManagement();

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (message.recipients.find((r) => r.status === 'unread')) {
      handleViewMessage(message);
    }
  };

  const handleDelete = (message: Message) => {
    setMessageToDelete(message);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      handleDeleteMessage(messageToDelete.id, 'inbox');
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      setShowDeleteWarning(false);
      setMessageToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r from-amber-600 to-orange-500 group mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30"></div>
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaEnvelopeOpen size={20} className="text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Inbox
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 divide-y divide-amber-100/50">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`p-4 cursor-pointer group/item hover:bg-amber-50/50 transition-all duration-300 ${
                  selectedMessage?.id === message.id ? 'bg-orange-50/70' : ''
                }`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {message.recipients.some((r) => r.status === 'unread') && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      )}
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{message.subject}</h3>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">{message.content}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
                <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500">
                  <span className="truncate">From: {message.sender.email}</span>
                  <span className="mt-1 sm:mt-0">{new Date(message.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">No messages found</div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 p-4 sm:p-6">
            {selectedMessage ? (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                      <span>From: {selectedMessage.sender.name}</span>
                      <span>To: {selectedMessage.recipients.map((r) => r.name).join(', ')}</span>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="prose max-w-none text-sm sm:text-base">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 sm:h-64 text-gray-500 text-sm sm:text-base">
                Select a message to view its details
              </div>
            )}
          </div>
        </div>
      </div>

      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setMessageToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message={messageToDelete ? `Are you sure you want to delete "${messageToDelete.subject}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

InboxSection.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      subject: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      sender: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
      }).isRequired,
      recipients: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          email: PropTypes.string.isRequired,
          role: PropTypes.string.isRequired,
          status: PropTypes.oneOf(['read', 'unread']).isRequired,
        })
      ).isRequired,
      isBroadcast: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ),
};
