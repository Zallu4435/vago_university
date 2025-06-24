import React, { useState } from 'react';
import { FiX, FiEdit2, FiTrash2, FiUsers, FiLock, FiBell, FiBellOff } from 'react-icons/fi';
import { Chat, Styles } from '../types/ChatTypes';
import { useChatQueries } from '../hooks/useChatQueries';
import { useChatMutations } from '../hooks/useChatMutations';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

interface ChatInfoProps {
  chat: Chat;
  styles: Styles;
  onClose: () => void;
  onDeleteChat: (chatId: string) => void;
  onAddMembers: (chatId: string) => void;
}

export const ChatInfo: React.FC<ChatInfoProps> = ({
  chat,
  styles,
  onClose,
  onDeleteChat,
  onAddMembers
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(chat.name);
  const [isMuted, setIsMuted] = useState(false);
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id);

  const { updateGroupInfo, removeGroupMember, updateGroupSettings } = useChatMutations(chat.id, currentUserId);

  const handleSaveEdit = () => {
    if (editedName.trim() && editedName !== chat.name) {
      updateGroupInfo.mutate({ name: editedName });
    }
    setIsEditing(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement mute functionality
  };

  return (
    <div className="w-80 h-full border-l border-gray-200 dark:border-[#2a3942] bg-white dark:bg-[#202c33] flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-[#2a3942] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat Info</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
        >
          <FiX className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Chat Name</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
            >
              <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a3942] bg-white dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-base text-gray-900 dark:text-white">{chat.name}</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chat Type</h3>
          <p className="text-base text-gray-900 dark:text-white">
            {chat.type === 'direct' ? 'Direct Message' : 'Group Chat'}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Participants</h3>
            {chat.type === 'group' && (
              <button
                onClick={() => onAddMembers(chat.id)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
              >
                <FiUsers className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>
          <div className="space-y-2">
            {chat.participants.map(participant => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942]"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    {participant.avatar ? (
                      <img src={participant.avatar} alt="Avatar" className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {participant.firstName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {participant.firstName} {participant.lastName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {participant.email} ({participant.type})
                    </span>
                  </div>
                </div>
                {chat.type === 'group' && (
                  <button
                    onClick={() => removeGroupMember.mutate(participant.id)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {chat.type === 'group' && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Group Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942]">
                <input
                  type="checkbox"
                  checked={chat.settings?.onlyAdminsCanPost}
                  onChange={(e) => updateGroupSettings.mutate({ ...chat.settings, onlyAdminsCanPost: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Only admins can post
                </span>
              </label>
              <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942]">
                <input
                  type="checkbox"
                  checked={chat.settings?.onlyAdminsCanAddMembers}
                  onChange={(e) => updateGroupSettings.mutate({ ...chat.settings, onlyAdminsCanAddMembers: e.target.checked || false })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Only admins can add members
                </span>
              </label>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notifications</h3>
          <button
            onClick={handleToggleMute}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
          >
            <span className="flex items-center space-x-2">
              {isMuted ? <FiBellOff className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
              <span className="font-medium text-gray-900 dark:text-white">
                {isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};