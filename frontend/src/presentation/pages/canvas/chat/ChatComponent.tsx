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
import { FiPlus, FiSearch, FiX, FiUser, FiMenu } from 'react-icons/fi';
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
  const [searchQuery, setSearchQuery] = useState('');
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
      const response = await chatService.getMessages(selectedChatId, page, 20);
      setMessages(prev => page === 1 ? response.messages : [...response.messages, ...prev]);
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
    const socketUrl = 'http://localhost:5000';
    socketRef.current = io(`${socketUrl}/chat`, {
      withCredentials: true,
      auth: { token: token || '' },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => setSocketError(null));
    socketRef.current.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      setSocketError('Failed to connect to chat server. Please try again later.');
    });
    socketRef.current.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      if (reason === 'io server disconnect') socketRef.current?.connect();
    });
    socketRef.current.on('error', (error) => {
      console.error('[Socket] General error:', error);
      setSocketError('An error occurred with the chat connection.');
    });
    socketRef.current.on('message', (newMessage: any) => {
      const formattedMessage = formatMessage(newMessage);
      setMessages(prev => [...prev, formattedMessage]);
      setChats(prev =>
        prev.map(chat =>
          chat.id === newMessage.chatId
            ? { ...chat, lastMessage: formattedMessage, unreadCount: chat.id === selectedChatId ? 0 : chat.unreadCount + 1 }
            : chat
        )
      );
      if (newMessage.senderId === currentUserId) setMessages(prev => prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg));
    });
    socketRef.current.on('messageStatus', ({ messageId, status }) => {
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, status } : msg));
    });
    socketRef.current.on('typing', ({ chatId, isTyping: typing }) => {
      setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, typing } : chat));
    });
    socketRef.current.on('userStatus', ({ userId, online }) => {
      setChats(prev => prev.map(chat => chat.participants.some(p => p.id === userId) ? { ...chat, online } : chat));
    });
    socketRef.current.on('messageReaction', (data: { messageId: string; reaction: any }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === data.messageId
            ? {
                ...msg,
                reactions: data.reaction.emoji
                  ? [...(msg.reactions || []), data.reaction]
                  : msg.reactions.filter(r => r.userId !== data.reaction.userId)
              }
            : msg
        )
      );
    });
    socketRef.current.on('messageDeleted', ({ messageId, deleteForEveryone }) => {
      if (deleteForEveryone) setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (socketRef.current && Array.isArray(chats)) {
      chats.forEach(chat => socketRef.current?.emit('joinChat', { chatId: chat.id }));
    }
  }, [chats]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleChatSelect = async (chatId: string) => {
    if (!chatId || !chats) return;
    try {
      setSelectedChatId(chatId);
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setSelectedChat(chat);
        setMessages([]);
        setHasMoreMessages(true);
        setOldestMessageTimestamp(null);
        const response = await chatService.getMessages(chatId, 1);
        setMessages(response.messages);
        setHasMoreMessages(response.pagination.hasMore);
        await chatService.markMessagesAsRead(chatId);
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
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

  const handleUserSelect = async (user: User) => {
    try {
      if (!Array.isArray(chats)) {
        setPendingUser(user);
        setSelectedChatId(null);
        setSearchQuery('');
        setSearchResults([]);
        setShowNewChat(false);
        return;
      }
      const existingChat = chats.find(chat => chat.type === 'direct' && chat.participants.some(p => p.id === user.id));
      if (existingChat) {
        setSelectedChatId(existingChat.id);
        setSelectedChat(existingChat);
      } else {
        setPendingUser(user);
        setSelectedChatId(null);
      }
      setSearchQuery('');
      setSearchResults([]);
      setShowNewChat(false);
    } catch (error) {
      console.error('Error in handleUserSelect:', error);
      setPendingUser(user);
      setSelectedChatId(null);
      setSearchQuery('');
      setSearchResults([]);
      setShowNewChat(false);
    }
  };

  const formatMessage = (message: any): Message => ({
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
      deleteForEveryone: message.deletedForEveryone || false
  });

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await chatService.editMessage(selectedChatId!, messageId, newContent);
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, content: newContent, isEdited: true } : msg));
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string, deleteForEveryone: boolean) => {
    try {
      await chatService.deleteMessage(selectedChatId!, messageId, deleteForEveryone);
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isDeleted: true, deleteForEveryone } : msg));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleReplyToMessage = (message: Message) => setReplyToMessage(message);

  const handleForwardMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) console.log('Forwarding message:', message); // TODO: Implement forward logic
  };

  const handleSendMessage = async (message: string, file?: File, replyTo?: Message) => {
    if (!message.trim() && !file) return;

    if (!selectedChatId && pendingUser) {
      try {
        const newChat = await chatService.createChat({
          creatorId: currentUser?.id || '',
          participantId: pendingUser.id,
          type: 'direct',
          name: `${pendingUser.firstName} ${pendingUser.lastName}`,
          avatar: pendingUser.avatar
        });
        setChats(prev => [newChat, ...(Array.isArray(prev) ? prev : [])]);
        setSelectedChatId(newChat.id);
        setPendingUser(null);
        setTimeout(() => handleSendMessage(message, file, replyTo), 0);
        return;
      } catch (error) {
        console.error('Failed to create chat:', error);
        return;
      }
    }

    if (!selectedChatId) return;

    try {
      let sentMessage;
      if (file) {
        const formData = new FormData();
        formData.append('files', file);
        if (message.trim()) formData.append('content', message.trim());
        if (replyTo) formData.append('replyTo', JSON.stringify(replyTo));
        sentMessage = await chatService.sendFile(selectedChatId, formData);
      } else {
        sentMessage = await chatService.sendMessage(selectedChatId, message, replyTo);
      }
      const formattedMessage = formatMessage({
        ...sentMessage,
        senderId: currentUserId,
        senderName: `${currentUser?.firstName} ${currentUser?.lastName}`,
        content: message.trim(),
        type: file ? (file.type.startsWith('image/') ? 'image' : 'file') : 'text',
        status: 'sending',
        replyTo
      });
      socketRef.current?.emit('message', formattedMessage);
      setMessages(prev => [...prev, formattedMessage]);
      setReplyToMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (!selectedChatId || !socketRef.current) return;
    socketRef.current.emit('typing', { chatId: selectedChatId, isTyping });
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedChatId) return;
    const tempMessage = {
      id: `temp-${Date.now()}`,
      chatId: selectedChatId,
      senderId: currentUserId!,
      content: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      status: 'sending',
      createdAt: new Date().toISOString(),
      attachments: [{ id: `temp-${Date.now()}`, type: file.type.startsWith('image/') ? 'image' : 'file', url: URL.createObjectURL(file), name: file.name, size: file.size }],
      reactions: []
    };
    setMessages(prev => [...prev, tempMessage]);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const sentMessage = await chatService.sendFile(selectedChatId, formData);
      setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? sentMessage : msg));
    } catch (error) {
      setMessages(prev => prev.map(msg => msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg));
    }
  };

  const handleCameraSelect = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { console.log('Camera access granted'); stream.getTracks().forEach(track => track.stop()); })
      .catch(error => console.error('Error accessing camera:', error));
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await chatService.addReaction(messageId, emoji);
      setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, reactions: [...(msg.reactions || []), { id: Date.now().toString(), emoji, userId: currentUserId || '', createdAt: new Date().toISOString(), count: 1 }] } : msg));
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    try {
      await chatService.removeReaction(messageId, emoji);
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions.filter(r => !(r.emoji === emoji && r.userId === currentUserId))
          };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  };

  const handleToggleTheme = () => setIsDarkMode(prev => !prev);

  const handleSettingsClick = () => setShowGroupSettings(true);

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
      const updatedChat = await chatService.getChatById(selectedChat.id);
      setSelectedChat(updatedChat);
      setChats(chats.map(chat => chat.id === selectedChat.id ? updatedChat : chat));
      toast.success('Group settings updated');
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group settings');
    }
  };

  const handleAddMembers = async (selectedUsers: User[]) => {
    if (!selectedChat || !currentUser) return;
    try {
      for (const user of selectedUsers) await chatService.addGroupMember(selectedChat.id, user.id, currentUser.id);
      const updatedChat = await chatService.getChatById(selectedChat.id);
      setSelectedChat(updatedChat);
      setChats(chats.map(chat => chat.id === selectedChat.id ? updatedChat : chat));
      setShowNewChat(false);
      toast.success('Members added');
    } catch (error) {
      console.error('Error adding members:', error);
      toast.error('Failed to add members');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedChat || !currentUser) return;
    try {
      await chatService.removeGroupMember(selectedChat.id, userId, currentUser.id);
      const updatedChat = await chatService.getChatById(selectedChat.id);
      setSelectedChat(updatedChat);
      setChats(chats.map(chat => chat.id === selectedChat.id ? updatedChat : chat));
      toast.success('Member removed');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!selectedChat) return;
    try {
      await chatService.makeAdmin(selectedChat.id, userId);
      setChats(prev => prev.map(chat => chat.id === selectedChat.id ? { ...chat, admins: [...chat.admins, userId] } : chat));
      setSelectedChat(prev => prev ? { ...prev, admins: [...prev.admins, userId] } : null);
      toast.success('Admin added');
    } catch (error) {
      console.error('Error making admin:', error);
      toast.error('Failed to make admin');
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!selectedChat) return;
    try {
      await chatService.removeAdmin(selectedChat.id, userId);
      setChats(prev => prev.map(chat => chat.id === selectedChat.id ? { ...chat, admins: chat.admins.filter(id => id !== userId) } : chat));
      setSelectedChat(prev => prev ? { ...prev, admins: prev.admins.filter(id => id !== userId) } : null);
      toast.success('Admin removed');
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
      toast.success('Left group');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedChat || !currentUser) return;
    try {
      await chatService.deleteGroup(selectedChat.id, currentUser.id);
      setChats(chats.filter(chat => chat.id !== selectedChat.id));
      setSelectedChat(null);
      setShowGroupSettings(false);
      toast.success('Group deleted');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  const renderSearchResults = () => {
    if (!showNewChat || !searchQuery) return null;
    return (
      <div className="absolute top-14 left-0 right-0 bg-white dark:bg-[#202c33] shadow-lg rounded-lg mt-1 max-h-96 overflow-y-auto z-50 border border-gray-200 dark:border-gray-700">
        {isSearching ? (
          <div className="p-4 text-center"><div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full mx-auto" /></div>
        ) : searchResults.length > 0 ? (
          searchResults.map(user => (
              <div
                key={user.id}
              className="p-3 hover:bg-gray-100 dark:hover:bg-[#2a3942] cursor-pointer flex items-center space-x-3"
                onClick={() => handleUserSelect(user)}
              >
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" /> : `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
                </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">No users found</div>
        )}
      </div>
    );
  };

  if (loading) return <div className={`flex h-screen items-center justify-center ${styles.background}`}><div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full" /></div>;
  if (socketError) return (
      <div className={`flex h-screen items-center justify-center ${styles.background}`}>
      <div className="text-center">
        <p className="text-red-500 mb-4">{socketError}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Retry</button>
      </div>
      </div>
    );

    return (
    <div className={`flex h-screen ${styles.background} font-sans`}>
      {/* Sidebar (Chat List) */}
      <div className="w-100 border-r border-gray-200 dark:border-[#2a3942] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-[#2a3942] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942]">
              <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">WhatsApp</h1>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setShowCreateGroup(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942]">
              <FiPlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={() => setShowNewChat(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942]">
              <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="relative p-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowNewChat(true)}
              onBlur={() => !searchQuery && setShowNewChat(false)}
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-100 dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchQuery && (
          <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); setShowNewChat(false); }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
                <FiX size={18} />
          </button>
            )}
        </div>
          {renderSearchResults()}
      </div>
        <ChatList
          chats={chats}
          styles={styles}
          selectedChatId={selectedChatId || ''}
          onChatSelect={handleChatSelect}
          onSearch={handleSearch}
          onNewChat={() => setShowNewChat(true)}
          onCreateGroup={() => setShowCreateGroup(true)}
          setMessages={setMessages}
          setChats={setChats}
          onUserSelect={handleUserSelect}
          currentUserId={currentUserId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatId && selectedChat ? (
          <>
            <ChatHeader
              chat={selectedChat}
              onInfoClick={() => setShowInfo(true)}
              onSettingsClick={handleSettingsClick}
              styles={styles}
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
            />
            <div className="flex-1 overflow-y-auto p-4" onScroll={handleScroll}>
                {messages
                  .filter(msg => !msg.deletedFor?.includes(currentUserId))
                  .map((message, index) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      previousMessage={index > 0 ? messages[index - 1] : undefined}
                      styles={styles}
                      onReaction={handleReaction}
                      onRemoveReaction={handleRemoveReaction}
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
                selectedChatId={selectedChatId}
              />
          </>
        ) : pendingUser ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-[#2a3942] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{pendingUser.firstName} {pendingUser.lastName}</h2>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">Start a conversation by sending a message.</p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-[#2a3942]">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Select a chat or start a new conversation.</p>
          </div>
        )}
      </div>

      {/* Info/Settings Area (Placeholder) */}
      {showInfo && selectedChat && (
        <div className="w-80 border-l border-gray-200 dark:border-[#2a3942] bg-white dark:bg-[#202c33] p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat Info</h2>
          {/* Add chat info content here */}
          <button onClick={() => setShowInfo(false)} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Close</button>
        </div>
      )}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={async (params) => {
            try {
              const newGroup = await chatService.createGroupChat({ ...params, creatorId: currentUser?.id || '' });
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