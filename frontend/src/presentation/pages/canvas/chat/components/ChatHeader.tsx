import React from 'react';
import { FiMoreVertical, FiPhone, FiVideo, FiInfo, FiSun, FiMoon, FiSettings } from 'react-icons/fi';
import { Chat, Styles } from '../types/ChatTypes';

interface ChatHeaderProps {
  chat: Chat;
  styles: Styles;
  onInfoClick: () => void;
  onSettingsClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  styles,
  onInfoClick,
  onSettingsClick,
  isDarkMode,
  onToggleTheme
}) => {
  const isOnline = chat.participants.some(p => p.isOnline);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#202c33]">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name || 'Chat'}
            className="w-12 h-12 rounded-full object-cover"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#202c33]" />
          )}
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {chat.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {chat.type === 'group' 
              ? `${chat.participants.length} members`
              : isOnline ? 'Online' : 'Offline'
            }
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
        </button>
        {chat.type === 'direct' && (
          <>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
              title="Voice call"
            >
              <FiPhone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
              title="Video call"
            >
              <FiVideo className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </>
        )}
        {chat.type === 'group' && (
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
            title="Group settings"
          >
            <FiSettings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
          title="Chat info"
          onClick={onInfoClick}
        >
          <FiInfo className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942] transition-colors duration-200"
          title="More options"
        >
          <FiMoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};