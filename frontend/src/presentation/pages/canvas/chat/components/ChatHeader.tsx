import React from 'react';
import { FiMoreVertical, FiPhone, FiVideo, FiInfo, FiSun, FiMoon } from 'react-icons/fi';
import { Chat, Styles } from '../types/ChatTypes';

interface ChatHeaderProps {
  chat: Chat;
  styles: Styles;
  onInfoClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  styles,
  onInfoClick,
  isDarkMode,
  onToggleTheme
}) => {
  const isOnline = chat.participants.some(p => p.isOnline);

  return (
    <div className={`flex items-center justify-between p-4 border-b ${styles?.border} ${styles?.background}`}>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={chat.avatar}
            alt={chat.name || 'Chat'}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          )}
        </div>
        <div>
          <h2 className={`text-base font-medium ${styles?.text?.primary}`}>
            {chat.name}
          </h2>
          <p className={`text-sm ${styles?.text?.muted}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles?.button?.secondary}`}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
        <button
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles?.button?.secondary}`}
          title="Voice call"
        >
          <FiPhone className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles?.button?.secondary}`}
          title="Video call"
        >
          <FiVideo className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles?.button?.secondary}`}
          title="Chat info"
          onClick={onInfoClick}
        >
          <FiInfo className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${styles?.button?.secondary}`}
          title="More options"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}; 