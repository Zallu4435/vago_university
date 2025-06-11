import React, { useState } from 'react';
import { FiX, FiUser, FiCheck, FiTrash2, FiUserPlus, FiUserMinus } from 'react-icons/fi';
import { Chat, User } from '../types/ChatTypes';

interface GroupSettingsModalProps {
  chat: Chat;
  onClose: () => void;
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
  onUpdateAdmin: (userId: string, isAdmin: boolean) => void;
  onUpdateSettings: (settings: {
    onlyAdminsCanPost?: boolean;
    onlyAdminsCanAddMembers?: boolean;
    onlyAdminsCanChangeInfo?: boolean;
  }) => void;
  onUpdateInfo: (info: {
    name?: string;
    description?: string;
    avatar?: string;
  }) => void;
  onLeaveGroup: () => void;
  onSearch: (query: string) => Promise<{ data: User[] }>;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
  chat,
  onClose,
  onAddMember,
  onRemoveMember,
  onUpdateAdmin,
  onUpdateSettings,
  onUpdateInfo,
  onLeaveGroup,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [groupName, setGroupName] = useState(chat.name || '');
  const [description, setDescription] = useState(chat.description || '');
  const [settings, setSettings] = useState(chat.groupInfo?.settings || {
    onlyAdminsCanPost: false,
    onlyAdminsCanAddMembers: false,
    onlyAdminsCanChangeInfo: false
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await onSearch(query);
        setSearchResults(response.data.filter(user => !chat.participants.some(p => p.id === user.id)));
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = (user: User) => {
    onAddMember(user.id);
    setSearchResults(prev => prev.filter(u => u.id !== user.id));
    setSearchQuery('');
    setShowAddMember(false);
  };

  const handleUpdateSettings = () => {
    onUpdateSettings(settings);
  };

  const handleUpdateInfo = () => {
    onUpdateInfo({
      name: groupName,
      description
    });
  };

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
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Group Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>
              <button
                onClick={handleUpdateInfo}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Group Info
              </button>
            </div>
          </div>

          {/* Members Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Members</h3>
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FiUserPlus size={16} />
                <span>Add Member</span>
              </button>
            </div>
            <div className="space-y-2">
              {chat.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} className="w-full h-full rounded-full" />
                      ) : (
                        <FiUser size={16} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{participant.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{participant.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {chat.admins.includes(participant.id) ? (
                      <span className="text-xs text-blue-600 dark:text-blue-400">Admin</span>
                    ) : (
                      <button
                        onClick={() => onUpdateAdmin(participant.id, true)}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Make Admin
                      </button>
                    )}
                    {participant.id !== chat.creatorId && (
                      <button
                        onClick={() => onRemoveMember(participant.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiUserMinus size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group Settings Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Group Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanPost}
                  onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanPost: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Only admins can post messages
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanAddMembers}
                  onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanAddMembers: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Only admins can add members
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.onlyAdminsCanChangeInfo}
                  onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanChangeInfo: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Only admins can change group info
                </span>
              </label>
            </div>
            <button
              onClick={handleUpdateSettings}
              className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Settings
            </button>
          </div>

          {/* Leave Group Button */}
          <button
            onClick={onLeaveGroup}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Leave Group
          </button>
        </div>

        {/* Add Member Modal */}
        {showAddMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Members</h3>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search users..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {searchResults.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-y-auto">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSettingsModal; 