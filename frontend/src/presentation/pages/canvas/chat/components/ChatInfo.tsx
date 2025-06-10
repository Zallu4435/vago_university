import React, { useState } from 'react';
import { FiX, FiEdit2, FiTrash2, FiUsers, FiLock, FiBell, FiBellOff } from 'react-icons/fi';
import { Chat, Styles } from '../types/ChatTypes';

interface ChatInfoProps {
  chat: Chat;
  styles: Styles;
  onClose: () => void;
  onEditChat: (chatId: string, updates: Partial<Chat>) => void;
  onDeleteChat: (chatId: string) => void;
  onAddMembers: (chatId: string) => void;
  onRemoveMember: (chatId: string, userId: string) => void;
  onUpdateSettings: (chatId: string, settings: Chat['settings']) => void;
}

export const ChatInfo: React.FC<ChatInfoProps> = ({
  chat,
  styles,
  onClose,
  onEditChat,
  onDeleteChat,
  onAddMembers,
  onRemoveMember,
  onUpdateSettings
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(chat.name);
  const [isMuted, setIsMuted] = useState(false);

  const handleSaveEdit = () => {
    if (editedName.trim() && editedName !== chat.name) {
      onEditChat(chat.id, { name: editedName });
    }
    setIsEditing(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement mute functionality
  };

  const renderSearchResults = () => {
    console.log('Rendering search results:', searchResults);
    // ...existing code...
    return (
      <div>
        {searchResults.map(user => (
          <div
            key={user.id}
            onClick={() => {
              console.log('User clicked:', user);
              handleUserSelect(user);
            }}
          >
            {/* ...user display... */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-80 h-full border-l ${styles.border} ${styles.background} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className={`text-lg font-medium ${styles.text.primary}`}>Chat Info</h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles.button.secondary}`}
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Info */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Chat Name */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${styles.text.secondary}`}>Chat Name</h3>
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles.button.secondary}`}
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg ${styles.input.background} ${styles.input.border} focus:outline-none focus:ring-2 ${styles.input.focus}`}
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className={`px-3 py-2 rounded-lg ${styles.button.primary}`}
              >
                Save
              </button>
            </div>
          ) : (
            <p className={`text-base ${styles.text.primary}`}>{chat.name}</p>
          )}
        </div>

        {/* Chat Type */}
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${styles.text.secondary} mb-2`}>Chat Type</h3>
          <p className={`text-base ${styles.text.primary}`}>
            {chat.type === 'direct' ? 'Direct Message' : 'Group Chat'}
          </p>
        </div>

        {/* Participants */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${styles.text.secondary}`}>Participants</h3>
            {chat.type === 'group' && (
              <button
                onClick={() => onAddMembers(chat.id)}
                className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles.button.secondary}`}
              >
                <FiUsers className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {chat.participants.map(participant => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    {participant.avatar ? (
                      <img src={participant.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-sm font-medium">
                        {participant.firstName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${styles.text.primary}`}>
                      {participant.firstName} {participant.lastName}
                    </span>
                    <span className={`text-xs ${styles.text.secondary}`}>
                      {participant.email} ({participant.type})
                    </span>
                  </div>
                </div>
                {chat.type === 'group' && (
                  <button
                    onClick={() => onRemoveMember(chat.id, participant.id)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        {chat.type === 'group' && (
          <div className="mb-6">
            <h3 className={`text-sm font-medium ${styles.text.secondary} mb-2`}>Group Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={chat.settings?.onlyAdminsCanPost}
                  onChange={(e) => onUpdateSettings(chat.id, { ...chat.settings, onlyAdminsCanPost: e.target.checked })}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className={`text-sm ${styles.text.primary}`}>
                  Only admins can post
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={chat.settings?.onlyAdminsCanAddMembers}
                  onChange={(e) => onUpdateSettings(chat.id, { ...chat.settings, onlyAdminsCanAddMembers: e.target.checked || false })}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className={`text-sm ${styles.text.primary}`}>
                  Only admins can add members
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="mb-6">
          <h3 className={`text-sm font-medium ${styles.text.secondary} mb-2`}>Notifications</h3>
          <button
            onClick={handleToggleMute}
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full ${styles.button.secondary}`}
          >
            {isMuted ? (
              <>
                <FiBellOff className="w-4 h-4" />
                <span className={`text-sm ${styles.text.primary}`}>Unmute Notifications</span>
              </>
            ) : (
              <>
                <FiBell className="w-4 h-4" />
                <span className={`text-sm ${styles.text.primary}`}>Mute Notifications</span>
              </>
            )}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className={`text-sm font-medium text-red-500 mb-2`}>Danger Zone</h3>
          <button
            onClick={() => onDeleteChat(chat.id)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-red-500"
          >
            <FiTrash2 className="w-4 h-4" />
            <span className="text-sm">Delete Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}; 