import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiEdit2, FiUsers, FiLock, FiMessageSquare, FiImage, FiLink, FiSearch, FiTrash2, FiLogOut, FiBell, FiBellOff } from 'react-icons/fi';
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
  const [isMuted, setIsMuted] = useState(false); // Added mute state

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
    // Simulate initial mute state (you can replace with actual logic)
    setIsMuted(false); // TODO: Fetch actual mute status from chat settings
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
        const filteredResults = response.items?.filter(
          user => !chat.participants.some(p => p.id === user.id)
        );
        setSearchResults(filteredResults || []);
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
      const updatedChat = await chatService.getChatById(chat.id);
      onUpdateGroup({});
    } catch (error) {
      console.error('Error adding members:', error);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement mute/unmute API call
  };

  const isAdmin = chat.admins.includes(currentUser.id);
  const isCreator = chat.admins[0] === currentUser.id;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#202c33] rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Group Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Group Name */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Name</label>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
                >
                  <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a3942] bg-white dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-base text-gray-900 dark:text-white">{chat.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
                >
                  <FiEdit2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
            {isEditingDescription ? (
              <div className="flex items-center space-x-2">
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a3942] bg-white dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <button
                  onClick={handleSaveDescription}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">{chat.description || 'No description'}</p>
            )}
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Participants ({chat.participants.length})</label>
              {isAdmin && (
                <button
                  onClick={() => setShowMemberSearch(true)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
                >
                  <FiUsers className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {chat.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942]"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} className="w-full h-full rounded-full" />
                      ) : (
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {participant.firstName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {participant.firstName} {participant.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {participant.email} {chat.admins.includes(participant.id) && '(Admin)'}
                      </div>
                    </div>
                  </div>
                  {isAdmin && participant.id !== currentUser.id && (
                    <div className="space-x-2">
                      {!chat.admins.includes(participant.id) ? (
                        <button
                          onClick={() => onMakeAdmin(participant.id)}
                          className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        >
                          <FiUser className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onRemoveAdmin(participant.id)}
                          className="p-1 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-full"
                        >
                          <FiUser className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveMember(participant.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Members Search */}
          {showMemberSearch && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search users to add..."
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2a3942] bg-white dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowMemberSearch(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
                >
                  <FiX className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              {searchResults.length > 0 && (
                <div className="border border-gray-200 dark:border-[#2a3942] rounded-lg max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942]"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                        ) : (
                          <FiUser size={16} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedUsers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 bg-gray-100 dark:bg-[#2a3942] rounded-full px-3 py-1"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
                      <button
                        onClick={() => handleUserRemove(user.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddSelectedMembers}
                    className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Group Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Group Settings</label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiMessageSquare className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send messages</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanPost}
                  onChange={(e) => handleSettingChange('onlyAdminsCanPost', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  disabled={!isAdmin}
                />
              </label>
              <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiUsers className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can add members</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanAddMembers}
                  onChange={(e) => handleSettingChange('onlyAdminsCanAddMembers', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  disabled={!isAdmin}
                />
              </label>
              <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiImage className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send media</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanSendMedia}
                  onChange={(e) => handleSettingChange('onlyAdminsCanSendMedia', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  disabled={!isAdmin}
                />
              </label>
              <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiLink className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send links</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanSendLinks}
                  onChange={(e) => handleSettingChange('onlyAdminsCanSendLinks', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  disabled={!isAdmin}
                />
              </label>
              <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiLock className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can change info</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanChangeInfo}
                  onChange={(e) => handleSettingChange('onlyAdminsCanChangeInfo', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  disabled={!isAdmin}
                />
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notifications</label>
            <button
              onClick={handleToggleMute}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942] w-full"
            >
              {isMuted ? (
                <>
                  <FiBellOff className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Unmute Notifications</span>
                </>
              ) : (
                <>
                  <FiBell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mute Notifications</span>
                </>
              )}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 dark:border-[#2a3942] pt-4 mt-4">
            <h3 className="text-sm font-medium text-red-500 mb-2">Danger Zone</h3>
            <button
              onClick={onLeaveGroup}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-red-500"
              disabled={!isAdmin || chat.participants.length <= 1}
            >
              <FiLogOut className="w-4 h-4" />
              <span className="text-sm">Leave Group</span>
            </button>
            {isCreator && (
              <button
                onClick={onDeleteGroup}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-red-500 mt-2"
              >
                <FiTrash2 className="w-4 h-4" />
                <span className="text-sm">Delete Group</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;