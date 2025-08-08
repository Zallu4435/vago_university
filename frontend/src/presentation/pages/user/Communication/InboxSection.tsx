import { useState } from 'react';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunication';
import { FaTrash, FaEnvelopeOpen } from 'react-icons/fa';
import PropTypes from 'prop-types';
import WarningModal from '../../../components/common/WarningModal';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../appStore/store';
import { Message } from '../../../../domain/types/user/communication';

export default function InboxSection() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const { inboxMessages: messages, isLoadingInbox: isLoading, handleViewMessage, handleDeleteMessage } =
    useCommunicationManagement();
  const { styles, theme } = usePreferences();
  const user = useSelector((state: RootState) => state.auth.user);

  console.log(messages, "messages ")

  const handleMessageClick = (message: Message) => {
    console.log('=== handleMessageClick DEBUG ===');
    console.log('Message clicked:', message);
    console.log('Message recipients:', message.recipients);
    
    // Get current user ID from Redux
    const currentUserId = user?.id;
    console.log('Current user ID:', currentUserId);
    
    // Find the current user's recipient status for this message
    const currentUserRecipient = message.recipients.find(r => r.id === currentUserId);
    console.log('Current user recipient:', currentUserRecipient);
    
    const isCurrentUserUnread = currentUserRecipient?.status === 'unread';
    console.log('Is current user unread:', isCurrentUserUnread);
    console.log('================================');
    
    setSelectedMessage(message);
    if (isCurrentUserUnread) {
      console.log('Calling handleViewMessage for message:', message.id);
      handleViewMessage(message);
    } else {
      console.log('Message already read by current user, not calling handleViewMessage');
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
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${styles.button.primary.split(' ')[0]}`}></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className={`relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r ${styles.accent} group mb-6`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.primary}`}></div>
        <div className={`absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaEnvelopeOpen size={20} className="text-white relative z-10" />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                Inbox
              </h2>
              <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className={`lg:col-span-1 relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 divide-y divide-amber-100/50">
            {messages.map((message: Message) => {
              // Get current user ID from Redux
              const currentUserId = user?.id;
              const currentUserRecipient = message.recipients.find(r => r.id === currentUserId);
              const isCurrentUserUnread = currentUserRecipient?.status === 'unread';
              
              return (
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
                        {isCurrentUserUnread && (
                          <span className={`w-2 h-2 rounded-full ${styles.status.warning}`}></span>
                        )}
                        <h3 className={`font-medium ${styles.textPrimary} text-sm sm:text-base truncate`}>{message.subject}</h3>
                      </div>
                      <p className={`text-sm ${styles.textSecondary} truncate mt-1`}>{message.content}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message);
                      }}
                      className={`ml-2 ${styles.icon.secondary} hover:${styles.status.error} transition-colors duration-300`}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs">
                    <span className={`truncate ${styles.textSecondary}`}>From: {message.sender.email}</span>
                    <span className={`mt-1 sm:mt-0 ${styles.textSecondary}`}>{new Date(message.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && (
              <div className={`p-4 text-center ${styles.textSecondary} text-sm`}>No messages found</div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className={`lg:col-span-2 relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 p-4 sm:p-6">
            {selectedMessage ? (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6">
                  <div>
                    <h2 className={`text-lg sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>{selectedMessage.subject}</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
                      <span className={`${styles.textSecondary}`}>From: {selectedMessage.sender.name}</span>
                    </div>
                  </div>
                  <div className={`text-xs sm:text-sm ${styles.textSecondary} mt-2 sm:mt-0`}>
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="prose max-w-none text-sm sm:text-base">
                  <p className={`${styles.textPrimary} whitespace-pre-wrap`}>{selectedMessage.content}</p>
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-center h-48 sm:h-64 ${styles.textSecondary} text-sm sm:text-base`}>
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