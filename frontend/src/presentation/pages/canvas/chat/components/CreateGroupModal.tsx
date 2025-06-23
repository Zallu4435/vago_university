import React, { useState } from 'react';
import { FiX, FiUser, FiCheck, FiMessageSquare, FiUsers, FiImage, FiLink, FiLock } from 'react-icons/fi';
import { User } from '../types/ChatTypes';

interface CreateGroupModalProps {
  onClose: () => void;
  onCreateGroup: (params: {
    name: string;
    description?: string;
    participants: string[];
    settings?: {
      onlyAdminsCanPost?: boolean;
      onlyAdminsCanAddMembers?: boolean;
      onlyAdminsCanChangeInfo?: boolean;
      onlyAdminsCanPinMessages?: boolean;
      onlyAdminsCanSendMedia?: boolean;
      onlyAdminsCanSendLinks?: boolean;
    };
  }) => void;
  onSearch: (query: string) => Promise<{ data: User[] }>;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onCreateGroup,
  onSearch
}) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState({
    onlyAdminsCanPost: false,
    onlyAdminsCanAddMembers: false,
    onlyAdminsCanChangeInfo: false,
    onlyAdminsCanPinMessages: false,
    onlyAdminsCanSendMedia: false,
    onlyAdminsCanSendLinks: false
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await onSearch(query);
        console.log(response, "kokokok")
        setSearchResults(response.items.filter(user => !selectedUsers.some(selected => selected.id === user.id)));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreateGroup({
        name: groupName.trim(),
        description: description.trim(),
        participants: selectedUsers.map(user => user.id),
        settings
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#202c33] rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Group</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#2a3942] shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#2c3e50] dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#2a3942] shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#2c3e50] dark:text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Add Members
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search users..."
                  className="block w-full rounded-md border-gray-300 dark:border-[#2a3942] shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-[#2c3e50] dark:text-white"
                />
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 dark:border-[#2a3942] rounded-md max-h-48 overflow-y-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleUserSelect(user)}
                        className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942]"
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

            {selectedUsers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selected Members
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 bg-gray-100 dark:bg-[#2a3942] rounded-full px-3 py-1"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
                      <button
                        type="button"
                        onClick={() => handleUserRemove(user.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Group Settings
              </label>
              <div className="mt-2 space-y-3">
                <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiMessageSquare className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send messages</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanPost}
                    onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanPost: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiUsers className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can add members</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanAddMembers}
                    onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanAddMembers: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiImage className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send media</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanSendMedia}
                    onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanSendMedia: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiLink className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can send links</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanSendLinks}
                    onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanSendLinks: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  />
                </label>
                <label className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#2a3942] rounded-md">
                  <div className="flex items-center space-x-3">
                    <FiLock className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Only admins can change group info</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.onlyAdminsCanChangeInfo}
                    onChange={(e) => setSettings(prev => ({ ...prev, onlyAdminsCanChangeInfo: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-[#2a3942]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2c3e50] border border-gray-300 dark:border-[#2a3942] rounded-md hover:bg-gray-100 dark:hover:bg-[#2a3942]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedUsers.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;