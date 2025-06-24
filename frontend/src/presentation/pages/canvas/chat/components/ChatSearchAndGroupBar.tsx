import React from 'react';
import { FiUsers, FiX } from 'react-icons/fi';

interface ChatSearchAndGroupBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onCreateGroup: () => void;
  onClose: () => void;
}

const ChatSearchAndGroupBar: React.FC<ChatSearchAndGroupBarProps> = ({
  searchQuery,
  onSearch,
  onCreateGroup,
  onClose
}) => {
  return (
    <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-[#2a3942] bg-white dark:bg-[#202c33]">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onCreateGroup}
        className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        title="Create group"
      >
        <FiUsers size={20} />
      </button>
      <button
        onClick={onClose}
        className="p-2 rounded-lg bg-gray-200 dark:bg-[#2c3e50] text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-[#202c33] focus:outline-none"
        title="Close search"
      >
        <FiX size={20} />
      </button>
    </div>
  );
};

export default ChatSearchAndGroupBar;