import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiEdit2, FiUsers, FiLock, FiMessageSquare, FiImage, FiLink, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Chat, User } from '../types/ChatTypes';
import { chatService } from '../services/chatService';

interface GroupSettingsModalProps {
  onClose: () => void;
  chat: Chat;
  currentUser: User;
  onUpdateGroup: (updates: {
    name?: string;
    description?: string;
    settings?: {
      onlyAdminsCanPost?: boolean;
      onlyAdminsCanAddMembers?: boolean;
      onlyAdminsCanChangeInfo?: boolean;
      onlyAdminsCanPinMessages?: boolean;
      onlyAdminsCanSendMedia?: boolean;
      onlyAdminsCanSendLinks?: boolean;
    };
  }) => void;
  onAddMembers: () => void;
  onRemoveMember: (userId: string) => void;
  onMakeAdmin: (userId: string) => void;
  onRemoveAdmin: (userId: string) => void;
  onLeaveGroup: () => void;
  onDeleteGroup: () => void;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  onClose,
  chat,
  currentUser,
  onUpdateGroup,
  onAddMembers,
  onRemoveMember,
  onMakeAdmin,
  onRemoveAdmin,
  onLeaveGroup,
  onDeleteGroup
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newName, setNewName] = useState(chat.name || '');
  const [newDescription, setNewDescription] = useState(chat.description || '');
  const [settings, setSettings] = useState({
    onlyAdminsCanPost: chat.settings?.onlyAdminsCanPost || false,
    onlyAdminsCanAddMembers: chat.settings?.onlyAdminsCanAddMembers || false,
    onlyAdminsCanChangeInfo: chat.settings?.onlyAdminsCanChangeInfo || false,
    onlyAdminsCanPinMessages: chat.settings?.onlyAdminsCanPinMessages || false,
    onlyAdminsCanSendMedia: chat.settings?.onlyAdminsCanSendMedia || false,
    onlyAdminsCanSendLinks: chat.settings?.onlyAdminsCanSendLinks || false
  });
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Update local state when chat prop changes
  useEffect(() => {
    setNewName(chat.name || '');
    setNewDescription(chat.description || '');
    setSettings({
      onlyAdminsCanPost: chat.settings?.onlyAdminsCanPost || false,
      onlyAdminsCanAddMembers: chat.settings?.onlyAdminsCanAddMembers || false,
      onlyAdminsCanChangeInfo: chat.settings?.onlyAdminsCanChangeInfo || false,
      onlyAdminsCanPinMessages: chat.settings?.onlyAdminsCanPinMessages || false,
      onlyAdminsCanSendMedia: chat.settings?.onlyAdminsCanSendMedia || false,
      onlyAdminsCanSendLinks: chat.settings?.onlyAdminsCanSendLinks || false
    });
  }, [chat]);

  const handleSaveName = () => {
    if (newName.trim() && newName !== chat.name) {
      onUpdateGroup({ name: newName.trim() });
    }
    setIsEditingName(false);
  };

  const handleSaveDescription = () => {
    if (newDescription !== chat.description) {
      onUpdateGroup({ description: newDescription.trim() });
    }
    setIsEditingDescription(false);
  };

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onUpdateGroup({ settings: newSettings });
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await chatService.searchUsers(query);
        // Filter out users who are already in the group
        const filteredResults = response.items?.filter(
          user => !chat.participants.some(p => p.id === user.id)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
    setSearchResults(prev => prev.filter(u => u.id !== user.id));
    setSearchQuery('');
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleAddSelectedMembers = async () => {
    try {
      for (const user of selectedUsers) {
        await chatService.addGroupMember(chat.id, user.id, currentUser.id);
      }
      setSelectedUsers([]);
      setShowMemberSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      // Refresh chat details
      const updatedChat = await chatService.getChatById(chat.id);
      onUpdateGroup({});
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  const isAdmin = chat.admins.includes(currentUser.id);
  const isCreator = chat.admins[0] === currentUser.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Group Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Group Info Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full" />
                  ) : (
                    <FiUsers size={24} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={handleSaveName}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                      className="text-lg font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{chat.name}</h3>
                      {isAdmin && (
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {chat.participants.length} members
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2">
              {isEditingDescription ? (
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  onBlur={handleSaveDescription}
                  className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Add a group description"
                />
              ) : (
                <div className="flex items-start space-x-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {chat.description || 'No description'}
                  </p>
                  {isAdmin && (
                    <button
                      onClick={() => setIsEditingDescription(true)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Members Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Members</h4>
              {isAdmin && (
                <button
                  onClick={() => setShowMemberSearch(!showMemberSearch)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showMemberSearch ? 'Cancel' : 'Add members'}
                </button>
              )}
            </div>

            {showMemberSearch && (
              <div className="mb-4 space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full p-2 pl-8 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <FiSearch className="absolute left-2 top-3 text-gray-400" />
                </div>

                {searchResults.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                          ) : (
                            <FiUser size={16} className="text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedUsers.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1"
                        >
                          <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
                          <button
                            onClick={() => handleUserRemove(user.id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleAddSelectedMembers}
                      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Add Selected Members
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {chat.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} className="w-full h-full rounded-full" />
                      ) : (
                        <FiUser size={16} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {participant.name}
                        {chat.admins.includes(participant.id) && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Admin)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{participant.email}</p>
                    </div>
                  </div>
                  {isAdmin && participant.id !== currentUser.id && (
                    <div className="flex items-center space-x-2">
                      {chat.admins.includes(participant.id) ? (
                        <button
                          onClick={() => onRemoveAdmin(participant.id)}
                          className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Remove admin
                        </button>
                      ) : (
                        <button
                          onClick={() => onMakeAdmin(participant.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Make admin
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveMember(participant.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Group Settings Section */}
          {isAdmin && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Group Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiMessageSquare className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send messages</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanPost}
                    onChange={(e) => handleSettingChange('onlyAdminsCanPost', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiUsers className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can add members</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanAddMembers}
                    onChange={(e) => handleSettingChange('onlyAdminsCanAddMembers', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiImage className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send media</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanSendMedia}
                    onChange={(e) => handleSettingChange('onlyAdminsCanSendMedia', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiLink className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send links</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanSendLinks}
                    onChange={(e) => handleSettingChange('onlyAdminsCanSendLinks', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiLock className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can change group info</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanChangeInfo}
                    onChange={(e) => handleSettingChange('onlyAdminsCanChangeInfo', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {isCreator ? (
              <button
                onClick={onDeleteGroup}
                className="w-full text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete Group
              </button>
            ) : (
              <button
                onClick={onLeaveGroup}
                className="w-full text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Leave Group
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal; 