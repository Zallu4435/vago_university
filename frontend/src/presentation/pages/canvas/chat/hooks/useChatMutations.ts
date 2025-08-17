import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { Message } from '../types/ChatTypes';

export const useChatMutations = (chatId?: string, currentUserId?: string) => {
  const queryClient = useQueryClient();

  const requireIds = () => {
    if (!chatId || !currentUserId) throw new Error('chatId and currentUserId are required');
  };

  // Group mutations
  const addGroupMember = useMutation({
    mutationFn: async (userId: string) => {
      requireIds();
      return chatService.addGroupMember(chatId!, userId, currentUserId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const removeGroupMember = useMutation({
    mutationFn: async (userId: string) => {
      requireIds();
      return chatService.removeGroupMember(chatId!, userId, currentUserId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const updateGroupAdmin = useMutation({
    mutationFn: async (params: { userId: string; isAdmin: boolean }) => {
      requireIds();
      return chatService.updateGroupAdmin(chatId!, params.userId, params.isAdmin, currentUserId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    }
  });

  const updateGroupSettings = useMutation({
    mutationFn: async (settings: { onlyAdminsCanPost?: boolean; onlyAdminsCanAddMembers?: boolean; onlyAdminsCanChangeInfo?: boolean; onlyAdminsCanPinMessages?: boolean; onlyAdminsCanSendMedia?: boolean; onlyAdminsCanSendLinks?: boolean }) => {
      requireIds();
      return chatService.updateGroupSettings(chatId!, settings, currentUserId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    }
  });

  const updateGroupInfo = useMutation({
    mutationFn: async (info: { name?: string; description?: string; avatar?: string }) => {
      requireIds();
      return chatService.updateGroupInfo(chatId!, info, currentUserId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const leaveGroup = useMutation({
    mutationFn: async () => {
      requireIds();
      return chatService.leaveGroup(chatId!, currentUserId!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  // Chat mutations
  const createChat = useMutation({
    mutationFn: chatService.createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const createGroupChat = useMutation({
    mutationFn: chatService.createGroupChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const createGroupChatWithAvatar = useMutation({
    mutationFn: chatService.createGroupChatWithAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  // Message mutations
  const sendMessage = useMutation({
    mutationFn: async (params: { chatId: string; content: string; type?: string }) =>
      chatService.sendMessage(params.chatId, params.content, params.type as 'text' | 'image' | 'file' | 'audio' | 'video' | undefined),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['messages', params.chatId] });
      const previousMessages = queryClient.getQueryData(['messages', params.chatId]);
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        chatId: params.chatId,
        senderId: currentUserId,
        senderName: '',
        content: params.content,
        type: (params.type || 'text') as 'text' | 'image' | 'file' | 'audio' | 'video',
        status: 'sending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reactions: [],
        attachments: [],
        isDeleted: false,
        deletedForEveryone: false,
      };
      queryClient.setQueryData(['messages', params?.chatId], (old: Message[] = []) => [...old, optimisticMessage]);
      return { previousMessages };
    },
    onError: (_err, params, context) => {
      queryClient.setQueryData(['messages', params?.chatId], context?.previousMessages);
    },
    onSettled: (_data, _error, params) => {
      queryClient.invalidateQueries({ queryKey: ['messages', params?.chatId] });
    }
  });

  const sendFile = useMutation({
    mutationFn: (params: { chatId: string; formData: FormData; file: File }) =>
      chatService.sendFile(params.chatId, params.formData),
    
    onMutate: async (variables) => {
      if (!currentUserId) throw new Error('User not authenticated');
      await queryClient.cancelQueries({ queryKey: ['messages', variables.chatId] });
      
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        chatId: variables.chatId,
        senderId: currentUserId,
        senderName: 'You',
        content: variables.formData.get('content') as string || '',
        type: (variables.file.type.startsWith('image/') ? 'image' : 'document') as 'image' | 'document',
        status: 'sending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [{
          id: `temp-attach-${Date.now()}`,
          url: URL.createObjectURL(variables.file),
          name: variables.file.name,
          size: variables.file.size,
          mimeType: variables.file.type,
          type: (variables.file.type.startsWith('image/') ? 'image' : 'document') as 'image' | 'document',
        }],
        reactions: [],
        isDeleted: false,
      };

      const previousMessages = queryClient.getQueryData(['messages', variables.chatId]);

      queryClient.setQueryData(['messages', variables.chatId], (oldData: { pages: { messages: Message[] }[] }) => {
        if (!oldData || !oldData.pages) {
          return {
            pages: [{ messages: [optimisticMessage], hasMore: true }],
            pageParams: [1],
          };
        }
        const newPages = [...oldData.pages];
        newPages[newPages.length - 1] = {
          ...newPages[newPages.length - 1],
          messages: [...newPages[newPages.length - 1].messages, optimisticMessage],
        };
        return { ...oldData, pages: newPages };
      });
      
      return { previousMessages, optimisticMessage };
    },

    onError: (_err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', variables.chatId], context.previousMessages);
      }
      toast.error('Failed to send file.');
    },

    onSettled: (_data, _error, variables, context) => {
      if (context?.optimisticMessage?.attachments?.[0]?.url) {
        URL.revokeObjectURL(context.optimisticMessage.attachments[0].url);
      }
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (params: { chatId: string; messageId: string; deleteForEveryone: boolean }) =>
      chatService.deleteMessage(params.chatId, params.messageId, params.deleteForEveryone),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['messages', params.chatId] });
      const previousMessages = queryClient.getQueryData(['messages', params.chatId]);
      queryClient.setQueryData(['messages', params.chatId], (old: { pages: { messages: Message[] }[] } | Message[]) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter((msg) => msg.id !== params.messageId);
        }
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: { messages: Message[] }) => ({
              ...page,
              messages: page.messages.filter((msg) => msg.id !== params.messageId)
            }))
          };
        }
        return old;
      });
      return { previousMessages };
    },
    onError: (_err, params, context) => {
      queryClient.setQueryData(['messages', params.chatId], context?.previousMessages);
    },
    onSettled: (_data, _error, params) => {
      queryClient.invalidateQueries({ queryKey: ['messages', params?.chatId] });
    }
  });

  const editMessage = useMutation({
    mutationFn: async (params: { chatId: string; messageId: string; newContent: string }) =>
      chatService.editMessage(params.chatId, params.messageId, params.newContent),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: ['messages', params.chatId] });
    }
  });

  const replyToMessage = useMutation({
    mutationFn: async (params: { chatId: string; replyToId: string; content: string }) =>
      chatService.replyToMessage(params.chatId, params.replyToId, params.content),
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({ queryKey: ['messages', params.chatId] });
    }
  });

  const addReaction = useMutation({
    mutationFn: async (params: { messageId: string; emoji: string }) => {
      if (!currentUserId) throw new Error('User not authenticated');
      return chatService.addReaction(params.messageId, params.emoji, currentUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const removeReaction = useMutation({
    mutationFn: async (params: { messageId: string }) => {
      if (!currentUserId) throw new Error('User not authenticated');
      return chatService.removeReaction(params.messageId, currentUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  });

  const markMessagesAsRead = useMutation({
    mutationFn: async (chatId: string) => chatService.markMessagesAsRead(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const deleteChat = useMutation({
    mutationFn: async (chatId: string) => chatService.deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const blockChat = useMutation({
    mutationFn: async (chatId: string) => chatService.blockChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  });

  const clearChat = useMutation({
    mutationFn: async (chatId: string) => chatService.clearChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    }
  });

  return {
    // Group mutations
    addGroupMember,
    removeGroupMember,
    updateGroupAdmin,
    updateGroupSettings,
    updateGroupInfo,
    leaveGroup,

    // Chat mutations
    createChat,
    createGroupChat,
    createGroupChatWithAvatar,
    deleteChat,
    blockChat,
    clearChat,

    // Message mutations
    sendMessage,
    sendFile,
    deleteMessage,
    editMessage,
    replyToMessage,
    addReaction,
    removeReaction,
    markMessagesAsRead,
  };
}; 