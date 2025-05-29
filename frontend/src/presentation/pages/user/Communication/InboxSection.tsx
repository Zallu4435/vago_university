import { useState } from 'react';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunication';
import { Message } from '../../../../domain/types/communication';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import WarningModal from '../../../components/WarningModal';

export default function InboxSection() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const {
    inboxMessages: messages,
    isLoadingInbox: isLoading,
    handleViewMessage,
    handleDeleteMessage
  } = useCommunicationManagement();

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (message.recipients.find(r => r.status === 'unread')) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Message List */}
      <div className="md:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Inbox</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
                selectedMessage?.id === message.id ? 'bg-orange-50' : ''
              }`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{message.subject}</h3>
                  <p className="text-sm text-gray-500 truncate">{message.content}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {message.recipients.some(r => r.status === 'unread') && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-150"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>{message.sender.email}</span>
                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="p-4 text-center text-gray-500">No messages found</div>
          )}
        </div>
      </div>

      {/* Message Details */}
      <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden">
        {selectedMessage ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>From: {selectedMessage.sender.name}</span>
                  <span>To: {selectedMessage.recipients.map(r => r.name).join(', ')}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select a message to view its details
          </div>
        )}
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