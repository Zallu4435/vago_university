import { toast } from 'react-hot-toast';
import { Message, User } from '../types/ChatTypes';
import { RefObject } from 'react';

export const handleScroll = (
  e: React.UIEvent<HTMLDivElement>,
  isLoadingMessages: boolean,
  loadingMoreMessages: boolean,
  hasMoreMessages: boolean,
  scrollState: { shouldScrollToBottom: boolean; oldScrollHeight: number },
  setLoadingMoreMessages: React.Dispatch<React.SetStateAction<boolean>>,
  setMessagesPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const { scrollTop, scrollHeight } = e.currentTarget;
  if (scrollTop === 0 && !isLoadingMessages && !loadingMoreMessages && hasMoreMessages) {
    scrollState.shouldScrollToBottom = false;
    scrollState.oldScrollHeight = scrollHeight;
    setLoadingMoreMessages(true);
    setMessagesPage((prev: number) => prev + 1);
  }
};

export const handleChatListScroll = (
  e: React.UIEvent<HTMLDivElement>,
  isLoadingChats: boolean,
  loadingMoreChats: boolean,
  hasMoreChats: boolean,
  setLoadingMoreChats: React.Dispatch<React.SetStateAction<boolean>>,
  setChatsPage: React.Dispatch<React.SetStateAction<number>>
) => {
  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  if (scrollHeight - scrollTop < clientHeight + 1 && !isLoadingChats && !loadingMoreChats && hasMoreChats) {
    setLoadingMoreChats(true);
    setChatsPage((prev: number) => prev + 1);
  }
};

export const handleChatSelect = async (
  chatId: string,
  setSelectedChatId: (id: string) => void,
  setAllMessages: (msgs: any[]) => void,
  setMessagesPage: (page: number) => void,
  setHasMoreMessages: (hasMore: boolean) => void,
  setReplyToMessage: (msg: any) => void,
  chats: any,
  chatMutations: any,
  setOldestMessageTimestamp: (ts: string | null) => void,
  scrollToBottom: (scrollRef: React.RefObject<HTMLDivElement>) => void,
  scrollRef: React.RefObject<HTMLDivElement>
) => {
    console.log(chatId, "id from the chathanders ")
  setSelectedChatId(chatId);
  setAllMessages([]);
  setMessagesPage(1);
  setHasMoreMessages(true);
  setReplyToMessage(null);
  const chatArray: any[] = Array.isArray(chats) ? chats : (chats && chats.data ? chats.data : []);
  if (!chatId || !chatArray) return;
  try {
    setOldestMessageTimestamp(null);
    await chatMutations.markMessagesAsRead.mutateAsync(chatId);
    scrollToBottom(scrollRef);
  } catch (error) {
    console.error('Error in handleChatSelect:', error);
  }
};

export const handleUserSelect = async (
  user: any,
  chats: any,
  setPendingUser: (user: any) => void,
  setSelectedChatId: (id: string | null) => void,
  setSearchQuery: (q: string) => void,
  setSearchResults: (r: any[]) => void,
  setShowNewChat: (b: boolean) => void
) => {
  try {
    const chatArray: any[] = Array.isArray(chats) ? chats : [];
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
    const existingChat = chatArray.find((chat) => chat.type === 'direct' && chat.participants.some((p: any) => p.id === user.id));
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

export const handleEditMessage = async (
  messageId: string,
  newContent: string,
  selectedChatId: string,
  chatMutations: any
) => {
  try {
    await chatMutations.editMessage.mutateAsync({ chatId: selectedChatId!, messageId, newContent });
  } catch (error) {
    toast.error('Failed to edit message');
  }
};

export const handleDeleteMessage = async (
  messageId: string,
  deleteForEveryone: boolean,
  selectedChatId: string,
  chatMutations: any
) => {
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

export const handleReplyToMessage = (
  message: Message,
  setReplyToMessage: (message: Message) => void
) => setReplyToMessage(message);

export const handleForwardMessage = async (
) => {
};

export const handleSendMessage = async (
  message: string,
  selectedChatId: string | null,
  pendingUser: User | null,
  currentUser: any,
  chatMutations: any,
  setSelectedChatId: (value: string) => void,
  setPendingUser: (value: null) => void,
  setReplyToMessage: (value: null) => void,
  fileOrFiles?: File | File[],
  replyTo?: Message
) => {
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
      setTimeout(() => handleSendMessage(message, newChat.id, null, currentUser, chatMutations, setSelectedChatId, setPendingUser, setReplyToMessage, fileOrFiles, replyTo), 0);
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

export const handleTyping = (
  isTyping: boolean,
  selectedChatId: string | null,
  socketRef: RefObject<any>
) => {
  if (!selectedChatId || !socketRef.current) return;
  socketRef.current.emit('typing', { chatId: selectedChatId, isTyping });
};

export const handleCameraSelect = () => {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { console.log('Camera access granted'); stream.getTracks().forEach(track => track.stop()); })
    .catch(error => console.error('Error accessing camera:', error));
};

export const handleReaction = async (
  messageId: string,
  emoji: string,
  currentUserId: string,
  chatMutations: any
) => {
  try {
    await chatMutations.addReaction.mutateAsync({ messageId, emoji, userId: currentUserId! });
  } catch (error) {
    console.error('Error adding reaction:', error);
  }
};

export const handleRemoveReaction = async (
  messageId: string,
  currentUserId: string,
  chatMutations: any
) => {
  try {
    await chatMutations.removeReaction.mutateAsync({ messageId, userId: currentUserId! });
  } catch (error) {
    console.error('Error removing reaction:', error);
  }
};

export const handleUpdateGroup = async (
  updates: {
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
  },
  flatChat: any,
  currentUser: any,
  selectedChatId: string,
  chatMutations: any
) => {
  if (!flatChat || !currentUser) return;
  try {
    await chatMutations.updateGroupSettings.mutateAsync({ chatId: selectedChatId!, updates });
    toast.success('Group settings updated');
  } catch (error) {
    console.error('Error updating group:', error);
    toast.error('Failed to update group settings');
  }
};

export const handleAddMembers = async (
  selectedUsers: User[],
  flatChat: any,
  currentUser: any,
  chatMutations: any
) => {
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

export const handleRemoveMember = async (
  userId: string,
  flatChat: any,
  currentUser: any,
  chatMutations: any,
  setSelectedChatId: (value: string) => void
) => {
  if (!flatChat || !currentUser) return;
  try {
    const updatedChat = await chatMutations.removeGroupMember.mutateAsync(userId);
    setSelectedChatId(updatedChat.id);
    toast.success('Member removed');
  } catch (error) {
    toast.error('Failed to remove member');
  }
};

export const handleMakeAdmin = async (
  userId: string,
  flatChat: any,
  currentUser: any,
  chatMutations: any,
  setSelectedChatId: (value: any) => void
) => {
  if (!flatChat || !currentUser) return;
  try {
    await chatMutations.updateGroupAdmin.mutateAsync({ userId, isAdmin: true });
    setSelectedChatId((prev: any) => prev ? { ...prev, admins: [...prev.admins, userId] } : null);
    toast.success('Admin added');
  } catch (error) {
    console.error('Error making admin:', error);
    toast.error('Failed to make admin');
  }
};

export const handleRemoveAdmin = async (
  userId: string,
  flatChat: any,
  currentUser: any,
  chatMutations: any,
  setSelectedChatId: (value: any) => void
) => {
  if (!flatChat || !currentUser) return;
  try {
    await chatMutations.updateGroupAdmin.mutateAsync({ userId, isAdmin: false });
    setSelectedChatId((prev: any) => prev ? { ...prev, admins: prev.admins.filter((id: string) => id !== userId) } : null);
    toast.success('Admin removed');
  } catch (error) {
    console.error('Error removing admin:', error);
    toast.error('Failed to remove admin');
  }
};

export const handleLeaveGroup = async (
  flatChat: any,
  chatMutations: any,
  setSelectedChatId: (value: null) => void,
  setShowGroupSettings: (value: boolean) => void
) => {
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

export const handleDeleteGroup = async (
  flatChat: any,
  currentUser: any,
  setSelectedChatId: (value: null) => void,
  setShowGroupSettings: (value: boolean) => void
) => {
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

export const handleDeleteChat = async (
  flatChat: any,
  chatMutations: any,
  setSelectedChatId: (value: null) => void
) => {
  if (!flatChat) return;
  if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
    try {
      await chatMutations.deleteChat.mutateAsync(flatChat.id);
      setSelectedChatId(null);
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  }
};

export const handleBlock = async (
  flatChat: any,
  chatMutations: any,
  setSelectedChatId: (value: null) => void
) => {
  if (!flatChat) return;
  if (window.confirm(`Are you sure you want to block this ${flatChat.type === 'group' ? 'group' : 'user'}?`)) {
    try {
      await chatMutations.blockChat.mutateAsync(flatChat.id);
      setSelectedChatId(null);
      toast.success(`${flatChat.type === 'group' ? 'Group' : 'User'} blocked`);
    } catch (error) {
      toast.error('Failed to block');
    }
  }
};

export const handleClearChat = async (
  flatChat: any,
  chatMutations: any,
  setAllMessages: (value: Message[]) => void
) => {
  if (!flatChat) return;
  if (window.confirm('Are you sure you want to clear all messages in this chat?')) {
    try {
      await chatMutations.clearChat.mutateAsync(flatChat.id);
      setAllMessages([]);
      toast.success('Chat cleared');
    } catch (error) {
      toast.error('Failed to clear chat');
    }
  }
};

export const scrollToBottom = (scrollRef: React.RefObject<HTMLDivElement>) => {
  if (scrollRef && scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }
};