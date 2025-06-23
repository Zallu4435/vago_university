import React, { useState } from 'react';
import { FiSearch, FiUser, FiPlus, FiX, FiUsers } from 'react-icons/fi';
import { Chat, Message, Styles, User, PaginatedResponse } from '../types/ChatTypes';
import { formatChatTime, formatMessageTime } from '../utils/chatUtils';
import io, { Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

interface ChatListProps {
  chats: Chat[];
  styles: Styles;
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
  onSearch: (query: string) => Promise<PaginatedResponse<User>>;
  onNewChat: () => void;
  onCreateGroup: () => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onUserSelect: (user: User) => void;
  currentUserId: string | undefined;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  styles,
  selectedChatId,
  onChatSelect,
  onSearch,
  onNewChat,
  onCreateGroup,
  setMessages,
  setChats,
  onUserSelect,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setShowNewChat(true);
    if (query.trim()) {
      setIsSearching(true);
      try {
        const response = await onSearch(query);
        console.log('Search response:', response);
        setSearchResults(response.items);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  console.log('chats', chats);

  return (
    <div className="w-full border-r border-gray-200 dark:border-[#2a3942] bg-white dark:bg-[#202c33] flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-[#2a3942]">
        <div className="relative">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowNewChat(true)}
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchQuery) {
                      setShowNewChat(false);
                    }
                  }, 200);
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowNewChat(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiPlus size={20} />
            </button>
            <button
              onClick={onCreateGroup}
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FiUsers size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showNewChat && searchQuery && (
          <div className="p-4 border-b border-gray-200 dark:border-[#2a3942]">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Search Results</h3>
            {isSearching ? (
              <div className="text-center py-2 text-gray-500 dark:text-gray-400">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onUserSelect(user);
                      setShowNewChat(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942]"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                      ) : (
                        <FiUser size={20} className="text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left items-start">
                      <div className="font-medium text-gray-900 dark:text-white w-full whitespace-normal break-words text-left">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 w-full whitespace-normal break-words text-left">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-2 text-gray-500 dark:text-gray-400">No users found</div>
            )}
          </div>
        )}

        <div className="divide-y divide-gray-200 dark:divide-[#2a3942]">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-[#2a3942] ${
                selectedChatId === chat.id ? 'bg-gray-200 dark:bg-[#2c3e50]' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {chat.avatar ? (
                  <img src={chat.avatar} alt={chat.name || 'Chat'} className="w-full h-full rounded-full" />
                ) : (
                  <FiUsers size={24} className="text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white w-full whitespace-normal break-words text-left">
                    {chat.type === 'group' ? (
                      <>
                        {chat.name}
                        {chat.isAdmin && <span className="ml-2 text-xs text-blue-500">(Admin)</span>}
                      </>
                    ) : (
                      chat.name || 'Unknown User'
                    )}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatChatTime(chat.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400 w-full whitespace-normal break-words text-left">
                    {chat.lastMessage ? (
                      <>
                        {chat.type === 'group' && (
                          <span className="font-medium">
                            {chat.lastMessage.senderId === currentUserId ? 'You' : chat.participants.find(p => p.id === chat.lastMessage?.senderId)?.firstName + ' ' + chat.participants.find(p => p.id === chat.lastMessage?.senderId)?.lastName}:
                          </span>
                        )}
                        {chat.type === 'direct' && (
                          <span className="font-medium">
                            {chat.lastMessage.senderId === currentUserId ? 'You' : ''}:
                          </span>
                        )}{' '}
                        {chat.lastMessage.content}
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-500 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};