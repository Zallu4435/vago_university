import React, { useEffect, useRef, useState } from 'react';
import { FiSearch, FiUser, FiPlus, FiX } from 'react-icons/fi';
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
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  onUserSelect: (user: User) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  styles,
  selectedChatId,
  onChatSelect,
  onSearch,
  onNewChat,
  setMessages,
  setChats,
  onUserSelect
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [socketError, setSocketError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = currentUser?.id;
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const initializeSocket = () => {
      try {
        const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        console.log('=== Socket Initialization Start ===');
        console.log('1. Connection URL:', socketUrl);
        console.log('2. Token available:', !!token);
        console.log('3. Token format:', token ? token.substring(0, 20) + '...' : 'No token');

        // First establish the main connection
        socketRef.current = io(socketUrl, {
          path: '/socket.io',
          withCredentials: true,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ['websocket', 'polling'],
          auth: {
            token: token
          }
        });

        console.log('4. Main socket instance created');

        // Wait for the main connection before connecting to namespace
        socketRef.current.on('connect', () => {
          console.log('5. Main socket connected, connecting to chat namespace...');
          
          // Now connect to the chat namespace
          const chatNamespace = io(`${socketUrl}/chat`, {
            path: '',
            withCredentials: true,
            auth: {
              token: token
            }
          });

          console.log('6. Chat namespace connection initiated');

          chatNamespace.on('connect', () => {
            console.log('7. Connected to chat namespace');
            setSocketError(null);
            
            console.log('8. Joining chats:', chats.map(chat => chat.id));
            chats.forEach(chat => {
              console.log('9. Emitting joinChat for:', chat.id);
              chatNamespace.emit('joinChat', { chatId: chat.id });
            });
          });

          chatNamespace.on('connect_error', (error: Error) => {
            console.error('10. Chat namespace connection error:', {
              message: error.message,
              stack: error.stack
            });
            setSocketError(`Failed to connect to chat server: ${error.message}`);
          });

          // Message events
          chatNamespace.on('message', (newMessage: Message) => {
            console.log('11. New message received:', {
              messageId: newMessage.id,
              chatId: newMessage.chatId,
              type: newMessage.type
            });
            setMessages(prev => [...prev, newMessage]);
            
            setChats(prev =>
              prev.map(chat =>
                chat.id === newMessage.chatId
                  ? {
                      ...chat,
                      lastMessage: {
                        id: newMessage.id,
                        content: newMessage.content,
                        senderId: newMessage.senderId,
                        senderName: chat.participants.includes(newMessage.senderId) ? chat.name : 'Unknown',
                        type: newMessage.type,
                        status: newMessage.status,
                        createdAt: newMessage.createdAt
                      },
                      unreadCount: chat.id === selectedChatId ? 0 : chat.unreadCount + 1
                    }
                  : chat
              )
            );
          });

          chatNamespace.on('messageStatus', ({ messageId, status }: { messageId: string; status: Message['status'] }) => {
            console.log('12. Message status update:', {
              messageId,
              status
            });
            setMessages(prev =>
              prev.map(msg =>
                msg.id === messageId
                  ? { ...msg, status }
                  : msg
              )
            );
          });

          chatNamespace.on('typing', ({ chatId, isTyping: typing }: { chatId: string; isTyping: boolean }) => {
            console.log('13. Typing status:', {
              chatId,
              isTyping: typing
            });
            setChats(prev =>
              prev.map(chat =>
                chat.id === chatId ? { ...chat, typing } : chat
              )
            );
          });

          chatNamespace.on('userStatus', ({ userId, online }: { userId: string; online: boolean }) => {
            console.log('14. User status update:', {
              userId,
              online
            });
            setChats(prev =>
              prev.map(chat =>
                chat.participants.includes(userId) ? { ...chat, online } : chat
              )
            );
          });

          console.log('15. All chat namespace event listeners attached');
        });

        socketRef.current.on('connect_error', (error: Error) => {
          console.error('16. Main socket connection error:', {
            message: error.message,
            stack: error.stack
          });
          setSocketError(`Failed to connect to main socket: ${error.message}`);
        });

        console.log('17. All main socket event listeners attached');

      } catch (error) {
        console.error('18. Socket initialization error:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        setSocketError('Failed to initialize chat connection');
      }
    };

    console.log('19. Effect triggered with token:', !!token);
    if (token) {
      initializeSocket();
    }

    return () => {
      console.log('20. Cleanup: Disconnecting socket');
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedChatId, chats, currentUserId, setMessages, setChats, token]);

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

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                  // Delay hiding the results to allow for clicking on them
                  setTimeout(() => {
                    if (!searchQuery) {
                      setShowNewChat(false);
                    }
                  }, 200);
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX />
                </button>
              )}
            </div>
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FiPlus />
            </button>
          </div>
          {showNewChat && searchQuery && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-1 max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center space-x-3"
                      onClick={() => {
                        console.log('User clicked in ChatList:', user);
                        onUserSelect(user);
                      }}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {user.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Array.isArray(chats) && chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedChatId === chat.id ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-500">
                    {chat.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {chat.name}
                  </h3>
                  {chat.unreadCount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 