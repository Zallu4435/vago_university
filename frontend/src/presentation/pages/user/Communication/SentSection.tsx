import { useState } from 'react';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunication';
import { Message } from '../../../../domain/types/communication';
import ComposeMessageModal from './ComposeMessageModal';
import WarningModal from '../../../components/WarningModal';

export default function SentSection() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const {
    sentMessages,
    isLoadingSent,
    handleDeleteMessage,
    handleSendMessage
  } = useCommunicationManagement();

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleDelete = (message: Message) => {
    setMessageToDelete(message);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = () => {
    if (messageToDelete) {
      handleDeleteMessage(messageToDelete.id, 'sent');
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      setShowDeleteWarning(false);
      setMessageToDelete(null);
    }
  };

  if (isLoadingSent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Sent Messages</h2>
        <button
          onClick={() => setIsComposing(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Compose Message
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Sent Messages</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {sentMessages.map((message) => (
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-150"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                  <span>To: {message.recipients.map((r) => r.name).join(', ')}</span>
                  <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {sentMessages.length === 0 && (
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
      </div>

      <ComposeMessageModal 
        isOpen={isComposing} 
        onClose={() => setIsComposing(false)}
        onSend={handleSendMessage}
      />

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