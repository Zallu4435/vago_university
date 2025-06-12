import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatList } from './components/ChatList';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { Chat, Message, User, PaginatedResponse } from './types/ChatTypes';
import { getStyles } from './utils/chatUtils';
import { chatService } from './services/chatService';
import { FiPlus, FiSearch, FiX, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../presentation/redux/store';
import { toast } from 'react-hot-toast';
import CreateGroupModal from './components/CreateGroupModal';
import GroupSettingsModal from './components/GroupSettingsModal';

export const ChatComponent: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('')
  const [showInfo, setShowInfo] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<string | null>(null);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const styles = getStyles(isDarkMode);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = currentUser?.id;

  // Fetch chats with pagination
  const fetchChats = async (page = 1) => {
    try {
      const response = await chatService.getChats(page);
      const formattedChats = response.data.map(chat => ({
        ...chat,
        participants: chat.participants.map(participant => ({
          id: participant.id,
          name: `${participant.firstName} ${participant.lastName}`,
          email: participant.email,
          avatar: participant.avatar,
          isOnline: false
        }))
      }));
      setChats(prev => page === 1 ? formattedChats : [...prev, ...formattedChats]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  // Fetch messages with pagination
  const fetchMessages = async (page = 1) => {
    if (!selectedChatId) return;

    try {
      setLoadingMoreMessages(true);
      const response = await chatService.getMessages(
        selectedChatId,
        page,
        20
      );
      
      setMessages(prev => page === 1 ? response.messages : [...prev, ...response.messages]);
      setHasMoreMessages(response.pagination.hasMore || false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMoreMessages(false);
    }
  };

  // Load more messages when scrolling up
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMoreMessages && !loadingMoreMessages) {
      fetchMessages();
    }
  }, [hasMoreMessages, loadingMoreMessages]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(1);
      scrollToBottom();
    }
  }, [selectedChatId]);

  // Initialize socket connection
  useEffect(() => {
    const initializeSocket = () => {
      try {
        const socketUrl = 'http://localhost:5000';
        const socketPath = ''; // Empty string for default path, as namespace is in the URL
        
        socketRef.current = io(`${socketUrl}/chat`, {
          path: socketPath,
          withCredentials: true,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ['websocket', 'polling'],
          auth: {
            token: token || '' // Ensure token is a string
          }
        });

        // Socket event listeners
        socketRef.current.on('connect', () => {
          console.log('Connected to chat server');
          setSocketError(null);
          // Join all existing chats
          if (Array.isArray(chats)) {
            chats.forEach(chat => {
              socketRef.current?.emit('joinChat', { chatId: chat.id });
            });
          }
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setSocketError('Failed to connect to chat server. Please try again later.');
        });

        socketRef.current.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, try to reconnect
            socketRef.current?.connect();
          }
        });

        socketRef.current.on('error', (error) => {
          console.error('Socket error:', error);
          setSocketError('An error occurred with the chat connection. Please try again later.');
        });

        socketRef.current.on('message', (newMessage: any) => {
          const formattedMessage = formatMessage(newMessage);
          
          // Add message to UI immediately
          setMessages(prev => [...prev, formattedMessage]);
          
          // Update last message in chat list
          setChats(prev =>
            prev.map(chat =>
              chat.id === newMessage.chatId
                ? {
                    ...chat,
                    lastMessage: {
                      id: newMessage.id,
                      content: newMessage.content,
                      senderId: newMessage.senderId,
                      senderName: newMessage.senderName || '',
                      type: newMessage.type || 'text',
                      status: newMessage.status || 'sending',
                      createdAt: newMessage.createdAt
                    },
                    unreadCount: chat.id === selectedChatId ? 0 : chat.unreadCount + 1
                  }
                : chat
            )
          );

          // If message is from current user, update its status
          if (newMessage.senderId === currentUserId) {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === newMessage.id
                  ? { ...msg, status: 'delivered' }
                  : msg
              )
            );
          }
        });

        socketRef.current.on('messageStatus', ({ messageId, status }) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === messageId
                ? { ...msg, status }
                : msg
            )
          );
        });

        socketRef.current.on('typing', ({ chatId, isTyping: typing }) => {
          setChats(prev =>
            prev.map(chat =>
              chat.id === chatId ? { ...chat, typing } : chat
            )
          );
        });

        socketRef.current.on('userStatus', ({ userId, online }) => {
          setChats(prev =>
            prev.map(chat =>
              chat.participants.includes(userId) ? { ...chat, online } : chat
            )
          );
        });

        socketRef.current.on('messageReaction', (data: { messageId: string; reaction: any }) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => {
              if (msg.id === data.messageId) {
                // If the reaction is being removed (no emoji), filter it out
                if (!data.reaction.emoji) {
                  return {
                    ...msg,
                    reactions: msg.reactions.filter(r => r.userId !== data.reaction.userId)
                  };
                }
                // Otherwise, add or update the reaction
                const existingReactionIndex = msg.reactions.findIndex(r => r.userId === data.reaction.userId);
                if (existingReactionIndex >= 0) {
                  const newReactions = [...msg.reactions];
                  newReactions[existingReactionIndex] = data.reaction;
                  return { ...msg, reactions: newReactions };
                }
                return {
                  ...msg,
                  reactions: [...msg.reactions, data.reaction]
                };
              }
              return msg;
            })
          );
        });
      } catch (error) {
        console.error('Error initializing socket:', error);
        setSocketError('Failed to initialize chat connection. Please refresh the page.');
      }
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedChatId, chats, currentUserId]);

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleChatSelect = async (chatId: string) => {
    if (!chatId || !chats) return;
    
    try {
      setSelectedChatId(chatId);
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setSelectedChat(chat);
        
        // Always fetch messages for the selected chat
        setMessages([]); // Clear existing messages
        setHasMoreMessages(true); // Reset pagination
        setOldestMessageTimestamp(null); // Reset timestamp
        
        // Load messages for the selected chat
        const response = await chatService.getMessages(chatId, 1);
        setMessages(response.messages);
        setHasMoreMessages(response.pagination.hasMore);
        
        // Mark messages as read
        await chatService.markMessagesAsRead(chatId);
        
        // Update chat list to reflect read status
        setChats(prevChats => 
          prevChats.map(c => 
            c.id === chatId ? { ...c, unreadCount: 0 } : c
          )
        );

        // Scroll to bottom
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error in handleChatSelect:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      try {
        const response = await chatService.searchUsers(query);
        console.log('Search response:', response);
        setSearchResults(response.items);
        return response;
    } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        throw error;
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      return { items: [], total: 0, page: 1, limit: 20, hasMore: false };
    }
  };

  // Handle user selection from search
  const handleUserSelect = async (user: User) => {
    console.log('Selected user:', user);
    
    try {
      // If chats is not initialized yet, just set pending user
      if (!Array.isArray(chats)) {
        console.log('Chats not initialized yet, setting pending user');
        setPendingUser(user);
        setSelectedChatId(null);
        setSearchQuery('');
        setSearchResults([]);
        setShowNewChat(false);
        return;
      }

      // Check if a chat already exists with this user
      const existingChat = chats.find(chat => 
        chat.type === 'direct' && 
        chat.participants.some(p => p.id === user.id)
      );

      if (existingChat) {
        // If chat exists, select it
        setSelectedChatId(existingChat.id);
        setSelectedChat(existingChat);
      } else {
        // If no chat exists, set pending user to show chat interface
        setPendingUser(user);
        setSelectedChatId(null);
      }
      
      setSearchQuery('');
      setSearchResults([]);
      setShowNewChat(false);
    } catch (error) {
      console.error('Error in handleUserSelect:', error);
      // Fallback to creating a new chat interface
      setPendingUser(user);
      setSelectedChatId(null);
      setSearchQuery('');
      setSearchResults([]);
      setShowNewChat(false);
    }
  };

  // Format message for display
  const formatMessage = (message: any): Message => {
    return {
      id: message.id,
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content || '',
      type: message.type || 'text',
      status: message.status || 'sending',
      createdAt: message.createdAt || new Date().toISOString(),
      updatedAt: message.updatedAt || new Date().toISOString(),
      reactions: message.reactions || [],
      attachments: message.attachments || [],
      isDeleted: message.isDeleted || false,
      deletedForEveryone: message.deletedForEveryone || false
    };
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await chatService.editMessage(selectedChatId!, messageId, newContent);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent, isEdited: true }
            : msg
        )
      );
    } catch (error) {
      console.error('Error editing message:', error);
      // Show error notification
    }
  };

  const handleDeleteMessage = async (messageId: string, deleteForEveryone: boolean) => {
    try {
      await chatService.deleteMessage(selectedChatId!, messageId, deleteForEveryone);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, isDeleted: true, deletedForEveryone: deleteForEveryone }
            : msg
        )
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      // Show error notification
    }
  };


  const handleReplyToMessage = (message: Message) => {
    setReplyToMessage(message);
  };

  const handleForwardMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    try {
      // TODO: Show a modal to select the chat to forward to
      // For now, we'll just log it
      console.log('Forwarding message:', message);
      // const forwardedMessage = await chatService.forwardMessage(messageId, targetChatId);
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  };

  const handleSendMessage = async (message: string, file?: File, replyTo?: Message) => {
    if (!message.trim() && !file) return;

    try {
      if (!selectedChatId && pendingUser) {
        // Create new chat when sending first message
        const newChat = await chatService.createChat({
          creatorId: currentUser?.id || '',
          participantId: pendingUser.id,
          type: 'direct',
          name: `${pendingUser.firstName} ${pendingUser.lastName}`,
          avatar: pendingUser.avatar
        });

        // Update chats list
        setChats(prev => [newChat, ...(Array.isArray(prev) ? prev : [])]);
        
        let sentMessage;
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          if (message.trim()) {
            formData.append('content', message.trim());
          }
          if (replyTo) {
            formData.append('replyTo', JSON.stringify({
              messageId: replyTo.id,
              content: replyTo.content,
              senderId: replyTo.senderId,
              senderName: replyTo.senderName,
              type: replyTo.type
            }));
          }
          sentMessage = await chatService.sendFile(newChat.id, formData);
        } else {
          sentMessage = await chatService.sendMessage(newChat.id, message, replyTo);
        }
        
        // Format the message with WhatsApp-style reply
        const formattedMessage = formatMessage({
          ...sentMessage,
          senderId: currentUserId,
          senderName: `${currentUser?.firstName} ${currentUser?.lastName}`,
          content: message.trim(),
          type: file ? (file.type.startsWith('image/') ? 'image' : 'file') : 'text',
          status: 'sending',
          replyTo: replyTo ? {
            id: replyTo.id,
            content: replyTo.content,
            senderId: replyTo.senderId,
            senderName: replyTo.senderName,
            type: replyTo.type,
            createdAt: replyTo.createdAt
          } : undefined
        });
        
        // Emit message through socket
        socketRef.current?.emit('message', formattedMessage);
        
        // Update messages list
        setMessages(prev => [...prev, formattedMessage]);
        
        // Update selected chat
        setSelectedChatId(newChat.id);
        setPendingUser(null);
        setReplyToMessage(null);
      } else if (selectedChatId) {
        let sentMessage;
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          if (message.trim()) {
            formData.append('content', message.trim());
          }
          if (replyTo) {
            formData.append('replyTo', JSON.stringify({
              messageId: replyTo.id,
              content: replyTo.content,
              senderId: replyTo.senderId,
              senderName: replyTo.senderName,
              type: replyTo.type
            }));
          }
          sentMessage = await chatService.sendFile(selectedChatId, formData);
        } else {
          sentMessage = await chatService.sendMessage(selectedChatId, message, replyTo);
        }
        
        // Format the message with WhatsApp-style reply
        const formattedMessage = formatMessage({
          ...sentMessage,
          senderId: currentUserId,
          senderName: `${currentUser?.firstName} ${currentUser?.lastName}`,
          content: message.trim(),
          type: file ? (file.type.startsWith('image/') ? 'image' : 'file') : 'text',
          status: 'sending',
          replyTo: replyTo ? {
            id: replyTo.id,
            content: replyTo.content,
            senderId: replyTo.senderId,
            senderName: replyTo.senderName,
            type: replyTo.type,
            createdAt: replyTo.createdAt
          } : undefined
        });
        
        // Emit message through socket
        socketRef.current?.emit('message', formattedMessage);
        
        // Update messages list
        setMessages(prev => [...prev, formattedMessage]);
        setReplyToMessage(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (!selectedChatId || !socketRef.current) return;
    socketRef.current.emit('typing', {
      chatId: selectedChatId,
      isTyping
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedChatId) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      chatId: selectedChatId,
      senderId: currentUserId!,
      content: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      status: 'sending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: [{
        id: `temp-${Date.now()}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        mimeType: file.type
      }],
      reactions: []
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const sentMessage = await chatService.sendFile(selectedChatId, formData);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? sentMessage : msg
        )
      );
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
        )
      );
    }
  };

  const handleCameraSelect = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Handle camera stream
        console.log('Camera access granted');
        // You can implement camera capture logic here
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(error => {
        console.error('Error accessing camera:', error);
      });
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await chatService.addReaction(messageId, emoji);
      // Update message reactions in UI
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
              reactions: [
                ...(msg.reactions || []),
                { id: Date.now().toString(), emoji, userId: currentUserId || '', createdAt: new Date().toISOString(), count: 1 }
              ]
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleSettingsClick = () => {
    setShowGroupSettings(true);
  };

  const handleUpdateGroup = async (updates: {
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
  }) => {
    if (!selectedChat || !currentUser) return;

    try {
      await chatService.updateGroupSettings(selectedChat.id, updates);
      
      // Refresh chat details
      const updatedChat = await chatService.getChatById(selectedChat.id);
      setSelectedChat(updatedChat);
      setChats(chats.map(chat => 
        chat.id === selectedChat.id ? updatedChat : chat
      ));

      toast.success('Group settings updated successfully');
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group settings');
    }
  };

  const handleAddMembers = async (selectedUsers: User[]) => {
    if (!selectedChat || !currentUser) return;

    try {
      // Add each selected user to the group
      for (const user of selectedUsers) {
        await chatService.addGroupMember(selectedChat.id, user.id, currentUser.id);
      }

      // Refresh chat details
      const updatedChat = await chatService.getChatById(selectedChat.id);
      setSelectedChat(updatedChat);
      setChats(chats.map(chat => 
        chat.id === selectedChat.id ? updatedChat : chat
      ));

      setShowNewChat(false);
      toast.success('Members added successfully');
    } catch (error) {
      console.error('Error adding members:', error);
      toast.error('Failed to add members');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedChat || !currentUser) return;

    try {
      await chatService.removeGroupMember(selectedChat.id, userId, currentUser.id);
      
      // Refresh chat details
      const updatedChat = await chatService.getChatById(selectedChat.id);
      setSelectedChat(updatedChat);
      setChats(chats.map(chat => 
        chat.id === selectedChat.id ? updatedChat : chat
      ));

      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!selectedChat) return;

    try {
      await chatService.makeAdmin(selectedChat.id, userId);
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                admins: [...chat.admins, userId]
              }
            : chat
        )
      );
      setSelectedChat(prev => prev ? {
        ...prev,
        admins: [...prev.admins, userId]
      } : null);
      toast.success('Admin added successfully');
    } catch (error) {
      console.error('Error making admin:', error);
      toast.error('Failed to make admin');
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!selectedChat) return;

    try {
      await chatService.removeAdmin(selectedChat.id, userId);
      setChats(prev =>
        prev.map(chat =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                admins: chat.admins.filter(id => id !== userId)
              }
            : chat
        )
      );
      setSelectedChat(prev => prev ? {
        ...prev,
        admins: prev.admins.filter(id => id !== userId)
      } : null);
      toast.success('Admin removed successfully');
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin');
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedChat) return;

    try {
      await chatService.leaveGroup(selectedChat.id);
      setChats(prev => prev.filter(chat => chat.id !== selectedChat.id));
      setSelectedChat(null);
      setShowGroupSettings(false);
      toast.success('Left group successfully');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedChat || !currentUser) return;

    try {
      await chatService.leaveGroup(selectedChat.id, currentUser.id);
      setChats(chats.filter(chat => chat.id !== selectedChat.id));
      setSelectedChat(null);
      setShowGroupSettings(false);
      toast.success('Group deleted successfully');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  // Render search results
  const renderSearchResults = () => {
    console.log('renderSearchResults called', {
      showNewChat,
      searchQuery,
      searchResults,
      isSearching
    });

    if (!showNewChat || !searchQuery) {
      console.log('Not showing results because:', { showNewChat, searchQuery });
      return null;
    }

    return (
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
                onClick={() => handleUserSelect(user)}
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
    );
  };

  // Add socket event listener for deleted messages
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('messageDeleted', ({ messageId, deleteForEveryone }) => {
        if (deleteForEveryone) {
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
        }
      });
    }
  }, []);

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${styles.background}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (socketError) {
    return (
      <div className={`flex h-screen items-center justify-center ${styles.background}`}>
        <div className="text-red-500 text-center">
          <p className="mb-4">{socketError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <ChatList
          chats={Array.isArray(chats) ? chats : []}
          styles={styles}
          selectedChatId={selectedChatId}
          onChatSelect={(chatId) => {
            setSelectedChatId(chatId);
            const chat = chats.find(c => c.id === chatId);
            if (chat) setSelectedChat(chat);
          }}
          onSearch={handleSearch}
          onNewChat={() => setShowNewChat(true)}
          setMessages={setMessages}
          setChats={setChats}
          onUserSelect={handleUserSelect}
          onCreateGroup={() => setShowCreateGroup(true)}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedChatId && selectedChat ? (
          <>
            <ChatHeader
              chat={selectedChat}
              onInfoClick={() => setShowInfo(true)}
              onSettingsClick={handleSettingsClick}
              styles={styles}
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            />
            <div className="flex flex-col h-[calc(100vh-160px)]">
              <div
                className="flex-1 overflow-y-auto p-4"
                onScroll={handleScroll}
              >
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    previousMessage={index > 0 ? messages[index - 1] : undefined}
                    styles={styles}
                    onReaction={handleReaction}
                    onDelete={handleDeleteMessage}
                    onEdit={handleEditMessage}
                    onReply={handleReplyToMessage}
                    onForward={handleForwardMessage}
                    currentUserId={currentUserId || ''}
                  />
                ))}
                <div ref={messagesEndRef} />
                {isTyping && <TypingIndicator styles={styles} />}
              </div>
              <ChatInput
                onSendMessage={handleSendMessage}
                onFileSelect={handleFileUpload}
                onCameraSelect={handleCameraSelect}
                onTyping={handleTyping}
                styles={styles}
                replyToMessage={replyToMessage}
                onCancelReply={() => setReplyToMessage(null)}
              />
            </div>
          </>
        ) : pendingUser ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">{pendingUser.firstName} {pendingUser.lastName}</h2>
            </div>
            <div className="flex-1 p-4">
              <p className="text-gray-500">Start a conversation by sending a message.</p>
            </div>
            <div className="p-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 border border-gray-300 rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat or start a new conversation.</p>
          </div>
        )}
      </div>
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={async (params) => {
            // Call your chatService.createGroupChat here
            try {
              const newGroup = await chatService.createGroupChat({
                ...params,
                creatorId: currentUser?.id || ''
              });
              setChats(prev => [newGroup, ...prev]);
              setShowCreateGroup(false);
            } catch (error) {
              toast.error('Failed to create group');
            }
          }}
          onSearch={handleSearch}
        />
      )}
      {showGroupSettings && selectedChat && (
        <GroupSettingsModal
          chat={selectedChat}
          currentUser={currentUser}
          onClose={() => setShowGroupSettings(false)}
          onUpdateGroup={handleUpdateGroup}
          onAddMembers={handleAddMembers}
          onRemoveMember={handleRemoveMember}
          onMakeAdmin={handleMakeAdmin}
          onRemoveAdmin={handleRemoveAdmin}
          onLeaveGroup={handleLeaveGroup}
          onDeleteGroup={handleDeleteGroup}
        />
      )}
    </div>
  );
};