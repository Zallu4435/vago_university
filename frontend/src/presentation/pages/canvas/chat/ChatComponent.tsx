import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatList } from './components/ChatList';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { Chat, Message, User, Participant } from './types/ChatTypes';
import { getStyles } from './utils/chatUtils';
import { FiPlus, FiSearch, FiX, FiUser, FiMenu, FiArrowLeft, FiUsers, FiMessageSquare } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../presentation/redux/store';
import { toast } from 'react-hot-toast';
import CreateGroupModal from './components/CreateGroupModal';
import GroupSettingsModal from './components/GroupSettingsModal';
import ChatSearchAndGroupBar from './components/ChatSearchAndGroupBar';
import { useChatQueries } from './hooks/useChatQueries';
import { useChatMutations } from './hooks/useChatMutations';
import { chatService } from './services/chatService';

export const ChatComponent: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [oldestMessageTimestamp, setOldestMessageTimestamp] = useState<string | null>(null);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const styles = getStyles(isDarkMode);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showAttachmentPanel, setShowAttachmentPanel] = useState(false);
  const [messagesPage, setMessagesPage] = useState(1);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [chatsPage, setChatsPage] = useState(1);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [hasMoreChats, setHasMoreChats] = useState(true);
  const [loadingMoreChats, setLoadingMoreChats] = useState(false);
  const scrollState = useRef({
    shouldScrollToBottom: true,
    oldScrollHeight: 0,
  }).current;

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const currentUserId = currentUser?.id;

  const {
    chatsResponse,
    isLoadingChats,
    chatDetails,
    messagesResponse,
    isLoadingMessages,
    searchUsers: searchUsersQuery
  } = useChatQueries({
    chatId: selectedChatId || undefined,
    messagesPage,
    messagesLimit: 20,
    chatsPage,
    chatsLimit: 20,
    query: searchQuery
  });

  const messages = messagesResponse?.messages || [];
  const hasMore = messagesResponse?.hasMore || false;
  const chats = chatsResponse?.data || [];

  const chatMutations = useChatMutations(selectedChatId || undefined, currentUserId);

  const flatChat = chatDetails?.chat ?? chatDetails;

  useEffect(() => {
    setLoading(isLoadingChats);
  }, [isLoadingChats]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (messagesPage === 1 && messages.length > 0) {
      setAllMessages(messages);
      setHasMoreMessages(true);
    } else if (messagesPage > 1) {
      if (messages.length > 0) {
        setAllMessages(prev => [...messages, ...prev]);
      } else {
        setHasMoreMessages(false);
      }
    }
  }, [messages, messagesPage]);

  useEffect(() => {
    const hasMoreChatsResponse = chatsResponse?.hasMore || false;
    if (chatsPage === 1 && chats.length > 0) {
      setAllChats(chats);
      setHasMoreChats(hasMoreChatsResponse);
    } else if (chatsPage > 1) {
      if (chats.length > 0) {
        setAllChats(prev => [...prev, ...chats]);
        setHasMoreChats(hasMoreChatsResponse);
      } else {
        setHasMoreChats(false);
      }
    }
  }, [chats, chatsPage, chatsResponse?.hasMore]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight } = e.currentTarget;
    if (scrollTop === 0 && !isLoadingMessages && !loadingMoreMessages && hasMoreMessages) {
      scrollState.shouldScrollToBottom = false;
      scrollState.oldScrollHeight = scrollHeight;
      setLoadingMoreMessages(true);
      setMessagesPage((prev) => prev + 1);
    }
  };

  const handleChatListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop < clientHeight + 1 && !isLoadingChats && !loadingMoreChats && hasMoreChats) {
      setLoadingMoreChats(true);
      setChatsPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!isLoadingMessages) {
      setLoadingMoreMessages(false);
    }
  }, [isLoadingMessages]);

  useEffect(() => {
    if (!isLoadingChats) {
      setLoadingMoreChats(false);
    }
  }, [isLoadingChats]);

  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
    setAllMessages([]);
    setMessagesPage(1);
    setHasMoreMessages(true);
    setReplyToMessage(null);
    const chatArray: Chat[] = Array.isArray(chats) ? chats as Chat[] : (chats?.data as Chat[] || []);
    if (!chatId || !chatArray) return;
    try {
      setOldestMessageTimestamp(null);
      await chatMutations.markMessagesAsRead.mutateAsync(chatId);
      scrollToBottom();
    } catch (error) {
      console.error('Error in handleChatSelect:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      try {
        let response: any = { items: [] };
        if (searchUsersQuery && 'items' in searchUsersQuery) {
          response = searchUsersQuery;
        }
        setSearchResults(response.items);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserSelect = async (user: User) => {
    try {
      const chatArray: Chat[] = Array.isArray(chats) ? (chats as Chat[]) : [];
      if (!chatArray.length) {
        const userWithName = {
          ...user,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()
        };
        setPendingUser(userWithName);
        setSelectedChatId(null);
        setSearchQuery('');
        setSearchResults([]);
        setShowNewChat(false);
        return;
      }
      const existingChat = chatArray.find((chat) => chat.type === 'direct' && chat.participants.some((p) => p.id === user.id));
      if (existingChat) {
        setSelectedChatId(existingChat.id);
      } else {
        const userWithName = {
          ...user,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()
        };
        setPendingUser(userWithName);
        setSelectedChatId(null);
      }
      setSearchQuery('');
      setSearchResults([]);
      setShowNewChat(false);
    } catch (error) {
      console.error('Error in handleUserSelect:', error);
      const userWithName = {
        ...user,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      };
      setPendingUser(userWithName);
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
    senderName: message.senderName || '',
    content: message.content || '',
    type: message.type || 'text',
    status: message.status || 'sending',
    createdAt: message.createdAt || new Date().toISOString(),
    updatedAt: message.updatedAt || new Date().toISOString(),
    reactions: message.reactions || [],
    attachments: message.attachments || [],
    isDeleted: message.isDeleted || false,
    deletedForEveryone: message.deletedForEveryone || false,
  });

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      await chatMutations.editMessage.mutateAsync({ chatId: selectedChatId!, messageId, newContent });
    } catch (error) {
      toast.error('Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId: string, deleteForEveryone: boolean) => {
    try {
      await chatMutations.deleteMessage.mutateAsync({ 
        chatId: selectedChatId!, 
        messageId, 
        deleteForEveryone 
      });
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleReplyToMessage = (message: Message) => setReplyToMessage(message);

  const handleForwardMessage = async (messageId: string) => {
    const message = messages.find((m: Message) => m.id === messageId);
    if (message) console.log('Forwarding message:', message); // TODO: Implement forward logic
  };

  const handleSendMessage = async (message: string, fileOrFiles?: File | File[], replyTo?: Message) => {
    if (!message.trim() && !fileOrFiles) return;

    if (!selectedChatId && pendingUser) {
      try {
        const newChat = await chatMutations.createChat.mutateAsync({
          creatorId: currentUser?.id || '',
          participantId: pendingUser.id,
          type: 'direct',
          name: `${pendingUser.firstName} ${pendingUser.lastName}`,
          avatar: pendingUser.avatar
        });
        setSelectedChatId(newChat.id);
        setPendingUser(null);
        setTimeout(() => handleSendMessage(message, fileOrFiles, replyTo), 0);
        return;
      } catch (error) {
        console.error('Failed to create chat:', error);
        return;
      }
    }

    if (!selectedChatId) return;

    try {
      if (fileOrFiles) {
        const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        if (message.trim()) formData.append('content', message.trim());
        if (replyTo) formData.append('replyTo', JSON.stringify(replyTo));
        // Only pass the first file for optimistic preview, but all files are sent
        await chatMutations.sendFile.mutateAsync({ chatId: selectedChatId, formData, file: files[0] });
      } else {
        await chatMutations.sendMessage.mutateAsync({ chatId: selectedChatId, content: message, type: 'text' });
      }
      setReplyToMessage(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (!selectedChatId || !socketRef.current) return;
    socketRef.current.emit('typing', { chatId: selectedChatId, isTyping });
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedChatId) return;
    try {
      const formData = new FormData();
      formData.append('files', file);
      await chatMutations.sendFile.mutateAsync({ chatId: selectedChatId, formData, file });
    } catch (error) {
      // handle error
    }
  };

  const handleCameraSelect = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { console.log('Camera access granted'); stream.getTracks().forEach(track => track.stop()); })
      .catch(error => console.error('Error accessing camera:', error));
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await chatMutations.addReaction.mutateAsync({ messageId, emoji, userId: currentUserId! });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleRemoveReaction = async (messageId: string, emoji: string) => {
    try {
      await chatMutations.removeReaction.mutateAsync({ messageId, userId: currentUserId! });
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
    if (!flatChat || !currentUser) return;
    try {
      await chatMutations.updateGroupSettings.mutateAsync({ chatId: selectedChatId!, updates });
      toast.success('Group settings updated');
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group settings');
    }
  };

  const handleAddMembers = async (selectedUsers: User[]) => {
    if (!flatChat || !currentUser) return;
    try {
      for (const user of selectedUsers) {
        await chatMutations.addGroupMember.mutateAsync(user.id);
      }
      toast.success('Members added');
    } catch (error) {
      toast.error('Failed to add members');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!flatChat || !currentUser) return;
    try {
      const updatedChat = await chatMutations.removeGroupMember.mutateAsync(userId);
      setSelectedChatId(updatedChat.id);
      toast.success('Member removed');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    if (!flatChat || !currentUser) return;
    try {
      await chatMutations.updateGroupAdmin.mutateAsync({ userId, isAdmin: true });
      setSelectedChatId(prev => prev ? { ...prev, admins: [...prev.admins, userId] } : null);
      toast.success('Admin added');
    } catch (error) {
      console.error('Error making admin:', error);
      toast.error('Failed to make admin');
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    if (!flatChat || !currentUser) return;
    try {
      await chatMutations.updateGroupAdmin.mutateAsync({ userId, isAdmin: false });
      setSelectedChatId(prev => prev ? { ...prev, admins: prev.admins.filter(id => id !== userId) } : null);
      toast.success('Admin removed');
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Failed to remove admin');
    }
  };

  const handleLeaveGroup = async () => {
    if (!flatChat) return;
    try {
      await chatMutations.leaveGroup.mutateAsync();
      setSelectedChatId(null);
      setShowGroupSettings(false);
      toast.success('Left group');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error('Failed to leave group');
    }
  };

  const handleDeleteGroup = async () => {
    if (!flatChat || !currentUser) return;
    try {
      setSelectedChatId(null);
      setShowGroupSettings(false);
      toast.success('Group deleted');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (scrollState.shouldScrollToBottom) {
      scrollToBottom();
    } else if (scrollRef.current && scrollState.oldScrollHeight) {
      const newScrollHeight = scrollRef.current.scrollHeight;
      scrollRef.current.scrollTop = newScrollHeight - scrollState.oldScrollHeight;
      scrollState.oldScrollHeight = 0; // Reset
    }
  }, [allMessages]); // Trigger on allMessages change

  useEffect(() => {
    scrollState.shouldScrollToBottom = true;
  }, [selectedChatId]); // Reset on chat change

  // Menu action handlers for ChatHeader
  const handleDeleteChat = () => {
    toast('Delete Chat clicked (not implemented)');
    // TODO: Implement delete chat logic
  };
  const handleBlock = () => {
    toast('Block clicked (not implemented)');
    // TODO: Implement block logic
  };
  const handleClearChat = () => {
    toast('Clear Chat clicked (not implemented)');
    // TODO: Implement clear chat logic
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
      <div className={`transition-all duration-300 ${showGroupSettings ? 'w-80' : 'w-100'} border-r border-gray-200 dark:border-[#2a3942] flex flex-col relative overflow-hidden`}>
        <div className="p-4 border-b border-gray-200 dark:border-[#2a3942] flex items-center justify-between relative z-10 bg-white dark:bg-[#202c33]">
          <span className="text-lg font-semibold">WhatsApp</span>
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowSearchBar(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942]">
              <FiPlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={() => setShowCreateGroup(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942]">
              <FiUsers className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="relative flex-1">
          <div
            className={`absolute inset-0 top-0 transition-transform duration-300 ${showSearchBar ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}
          >
            <ChatList
              chats={allChats}
              styles={styles}
              selectedChatId={selectedChatId || ''}
              onChatSelect={handleChatSelect}
              onScroll={handleChatListScroll}
              onSearch={async (query: string) => {
                setIsSearching(true);
                try {
                  const response = await chatService.searchUsers(query);
                  setSearchResults(response.data ?? response.items ?? []);
                  return response;
                } catch {
                  setSearchResults([]);
                  return { data: [], total: 0, page: 1, limit: 20, hasMore: false };
                } finally {
                  setIsSearching(false);
                }
              }}
              onNewChat={() => setShowNewChat(true)}
              onCreateGroup={() => setShowCreateGroup(true)}
              onUserSelect={handleUserSelect}
              currentUserId={currentUserId}
              setMessages={() => {}}
              setChats={() => {}}
            />
          </div>
          <div
            className={`absolute inset-0 top-0 bg-white dark:bg-[#202c33] z-10 transition-transform duration-300 ${showSearchBar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}
          >
            <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-[#2a3942] bg-white dark:bg-[#202c33]">
              <button
                onClick={() => {
                  setShowSearchBar(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3942]"
                title="Back"
              >
                <FiArrowLeft size={20} />
              </button>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={async (e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  if (query.trim()) {
                    setIsSearching(true);
                    try {
                      const response = await chatService.searchUsers(query);
                      setSearchResults(response.data ?? response.items ?? []);
                    } catch {
                      setSearchResults([]);
                    } finally {
                      setIsSearching(false);
                    }
                  } else {
                    setSearchResults([]);
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2c3e50] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="p-2">
              {searchQuery ? (
                isSearching ? (
                  <div className="text-center py-2 text-gray-500 dark:text-gray-400">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a3942]"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name || (user.firstName + ' ' + user.lastName)} className="w-full h-full rounded-full" />
                          ) : (
                            <FiUser size={20} className="text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left items-start">
                          <div className="font-medium text-gray-900 dark:text-white w-full whitespace-normal break-words text-left">{user.name || (user.firstName + ' ' + user.lastName)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 w-full whitespace-normal break-words text-left">{user.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-2 text-gray-500 dark:text-gray-400">No users found</div>
                )
              ) : null}
            </div>
          </div>
        </div>
        {showCreateGroup && (
          <CreateGroupModal
            onClose={() => setShowCreateGroup(false)}
            onCreateGroup={async (params) => {
              try {
                console.log('ChatComponent: onCreateGroup called with:', params);
                let newGroup;
                if (params.avatar) {
                  const formData = new FormData();
                  formData.append('name', params.name);
                  if (params.description) formData.append('description', params.description);
                  formData.append('creatorId', currentUser?.id || '');
                  formData.append('participants', JSON.stringify(params.participants));
                  if (params.settings) formData.append('settings', JSON.stringify(params.settings));
                  formData.append('avatar', params.avatar);
                  console.log('ChatComponent: Submitting FormData to createGroupChat');
                  newGroup = await chatMutations.createGroupChat.mutateAsync(formData);
                } else {
                  console.log('ChatComponent: Submitting JSON to createGroupChat');
                  newGroup = await chatMutations.createGroupChat.mutateAsync({ ...params, creatorId: currentUser?.id || '' });
                }
                setSelectedChatId(newGroup.id);
                setAllMessages([]);
                setMessagesPage(1);
                setHasMoreMessages(true);
                setReplyToMessage(null);
                setShowCreateGroup(false);
              } catch (error) {
                console.error('ChatComponent: Error in onCreateGroup', error);
                toast.error('Failed to create group');
              }
            }}
            onSearch={async (query: string) => {
              setIsSearching(true);
              try {
                const response = await chatService.searchUsers(query);
                setSearchResults(response.data ?? response.items ?? []);
                return response;
              } catch {
                setSearchResults([]);
                return { data: [], total: 0, page: 1, limit: 20, hasMore: false };
              } finally {
                setIsSearching(false);
              }
            }}
          />
        )}
      </div>

      <div className="flex-1 flex flex-row h-full">
        <div className={`flex flex-col transition-all duration-300 ${showGroupSettings ? 'w-2/3' : 'w-full'}`}>
          {selectedChatId && flatChat ? (
            <>
              <ChatHeader
                chat={flatChat}
                styles={styles}
                onInfoClick={() => setShowInfo(true)}
                onSettingsClick={() => setShowGroupSettings(true)}
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode((prev) => !prev)}
                onDeleteChat={handleDeleteChat}
                onBlock={handleBlock}
                onClearChat={handleClearChat}
              />
              <div className="flex-1 overflow-y-auto p-4" onScroll={handleScroll} ref={scrollRef}>
                {isLoadingMessages && messagesPage === 1 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full" />
                  </div>
                ) : allMessages.length > 0 ? (
                  allMessages.map((message: Message, index: number) => {
                    const isLast = index === allMessages.length - 1;
                    return (
                      <ChatMessage
                        key={message.id}
                        ref={isLast ? messagesEndRef : undefined}
                        message={message}
                        previousMessage={index > 0 ? allMessages[index - 1] : undefined}
                        styles={styles}
                        onReaction={handleReaction}
                        onRemoveReaction={handleRemoveReaction}
                        onDelete={handleDeleteMessage}
                        onEdit={handleEditMessage}
                        onReply={handleReplyToMessage}
                        onForward={handleForwardMessage}
                        currentUserId={currentUserId || ''}
                      />
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 dark:text-gray-400">
                    <FiMessageSquare size={60} className="mb-4" />
                    <h2 className="text-xl font-semibold">No Messages Yet</h2>
                    <p>Start the conversation by sending a message.</p>
                  </div>
                )}
                {isTyping && <TypingIndicator styles={styles} />}
              </div>
              <ChatInput
                onSendMessage={handleSendMessage}
                onTyping={handleTyping}
                styles={styles}
                replyToMessage={replyToMessage}
                onCancelReply={() => setReplyToMessage(null)}
                selectedChatId={selectedChatId || ''}
                currentUserId={currentUserId || ''}
              />
            </>
          ) : pendingUser ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-[#2a3942] flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {pendingUser.name || `${pendingUser.firstName || ''} ${pendingUser.lastName || ''}`.trim()}
                </h2>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-gray-800/50">
                <div className="w-24 h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
                  <FiMessageSquare size={60} className="text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No Messages Yet
                </h2>
                <p className="text-md text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                  Start a conversation by sending a message.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-[#2a3942] p-4">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  styles={styles}
                  replyToMessage={replyToMessage}
                  onCancelReply={() => setReplyToMessage(null)}
                  selectedChatId={''}
                  currentUserId={currentUserId || ''}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 dark:bg-gray-800/50">
              <div className="w-24 h-24 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
                <FiMessageSquare size={60} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Welcome to Chat</h2>
              <p className="text-md text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                Select a conversation from the list on the left, or start a new one to begin messaging.
              </p>
            </div>
          )}
        </div>
        {showGroupSettings && flatChat && currentUser && (
          <div className="w-1/3 h-full border-l border-gray-200 dark:border-[#2a3942] bg-white dark:bg-[#1f2937] shadow-lg transition-all duration-300">
            <GroupSettingsModal
              onClose={() => setShowGroupSettings(false)}
              chat={flatChat}
              currentUser={currentUser}
              onUpdateGroup={handleUpdateGroup}
              onAddMembers={handleAddMembers}
              onRemoveMember={handleRemoveMember}
              onMakeAdmin={handleMakeAdmin}
              onRemoveAdmin={handleRemoveAdmin}
              onLeaveGroup={handleLeaveGroup}
              onDeleteGroup={handleDeleteGroup}
            />
          </div>
        )}
      </div>
    </div>
  );
};