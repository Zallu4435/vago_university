import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import { toast } from 'react-hot-toast';

export const useChatMutations = (chatId?: string, currentUserId?: string) => {
  const queryClient = useQueryClient();

  // Helper to ensure required params
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
    mutationFn: async (settings: any) => {
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
        senderName: '', // Optionally use current user's name
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
      queryClient.setQueryData(['messages', params.chatId], (old: any[] = []) => [...old, optimisticMessage]);
      return { previousMessages };
    },
    onError: (err, params, context) => {
      queryClient.setQueryData(['messages', params.chatId], context?.previousMessages);
    },
    onSettled: (_data, _error, params) => {
      queryClient.invalidateQueries({ queryKey: ['messages', params.chatId] });
    }
  });

  const sendFile = useMutation({
    mutationFn: (params: { chatId: string; formData: FormData; file: File }) =>
      chatService.sendFile(params.chatId, params.formData),
    
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['messages', variables.chatId] });
      
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        chatId: variables.chatId,
        senderId: currentUserId,
        senderName: 'You', // Replace with actual user name
        content: variables.formData.get('content') as string || '',
        type: variables.file.type.startsWith('image/') ? 'image' : 'document',
        status: 'sending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [{
          id: `temp-attach-${Date.now()}`,
          url: URL.createObjectURL(variables.file),
          name: variables.file.name,
          size: variables.file.size,
          mimeType: variables.file.type,
          type: variables.file.type.startsWith('image/') ? 'image' : 'document',
        }],
        reactions: [],
        isDeleted: false,
      };

      const previousMessages = queryClient.getQueryData(['messages', variables.chatId]);

      queryClient.setQueryData(['messages', variables.chatId], (oldData: any) => {
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

    onError: (err, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', variables.chatId], context.previousMessages);
      }
      toast.error('Failed to send file.');
    },

    onSettled: (data, error, variables, context) => {
      if (context?.optimisticMessage?.attachments?.[0]?.url) {
        URL.revokeObjectURL(context.optimisticMessage.attachments[0].url);
      }
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (params: { chatId: string; messageId: string; deleteForEveryone: boolean }) =>
      chatService.deleteMessage(params.messageId, params.deleteForEveryone),
    onSuccess: () => {
      if (chatId) queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    }
  });

  const forwardMessage = useMutation({
    mutationFn: async (params: { messageId: string; targetChatId: string }) =>
      chatService.forwardMessage(params.messageId, params.targetChatId),
    onSuccess: () => {
      if (chatId) queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    }
  });

  const replyToMessage = useMutation({
    mutationFn: async (params: { chatId: string; replyToId: string; content: string }) =>
      chatService.replyToMessage(params.chatId, params.replyToId, params.content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
    }
  });

  const markMessagesAsRead = useMutation({
    mutationFn: async (chatId: string) => chatService.markMessagesAsRead(chatId),
    onSuccess: (_data, chatId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    }
  });

  // Reaction mutations
  const addReaction = useMutation({
    mutationFn: async (params: { messageId: string; emoji: string; userId: string }) =>
      chatService.addReaction(params.messageId, params.emoji, params.userId),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['messages', chatId] });
      const previousMessages = queryClient.getQueryData(['messages', chatId]);
      queryClient.setQueryData(['messages', chatId], (old: any[] = []) => {
        return old.map((msg) => {
          if (msg.id === params.messageId) {
            // Add or update the reaction for this user/emoji
            const existing = msg.reactions.find((r: any) => r.emoji === params.emoji && r.userId === params.userId);
            if (existing) {
              return msg;
            }
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                {
                  id: `temp-${Date.now()}`,
                  emoji: params.emoji,
                  userId: params.userId,
                  createdAt: new Date().toISOString(),
                  count: 1,
                },
              ],
            };
          }
          return msg;
        });
      });
      return { previousMessages };
    },
    onError: (_err, _params, context) => {
      queryClient.setQueryData(['messages', chatId], context?.previousMessages);
    },
    onSettled: () => {
      if (chatId) queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const removeReaction = useMutation({
    mutationFn: async (params: { messageId: string; userId: string }) =>
      chatService.removeReaction(params.messageId, params.userId),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['messages', chatId] });
      const previousMessages = queryClient.getQueryData(['messages', chatId]);
      queryClient.setQueryData(['messages', chatId], (old: any[] = []) => {
        return old.map((msg) => {
          if (msg.id === params.messageId) {
            return {
              ...msg,
              reactions: msg.reactions.filter((r: any) => r.userId !== params.userId),
            };
          }
          return msg;
        });
      });
      return { previousMessages };
    },
    onError: (_err, _params, context) => {
      queryClient.setQueryData(['messages', chatId], context?.previousMessages);
    },
    onSettled: () => {
      if (chatId) queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  const editMessage = useMutation({
    mutationFn: async (params: { chatId: string; messageId: string; newContent: string }) =>
      chatService.editMessage(params.chatId, params.messageId, params.newContent),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
    }
  });

  // Chat management mutations
  const deleteChat = useMutation({
    mutationFn: async (chatId: string) => chatService.deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });

  const blockChat = useMutation({
    mutationFn: async (chatId: string) => chatService.blockChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });

  const clearChat = useMutation({
    mutationFn: async (chatId: string) => chatService.clearChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });

  return {
    // Group
    addGroupMember,
    removeGroupMember,
    updateGroupAdmin,
    updateGroupSettings,
    updateGroupInfo,
    leaveGroup,
    // Chat
    createChat,
    createGroupChat,
    // Message
    sendMessage,
    sendFile,
    deleteMessage,
    forwardMessage,
    replyToMessage,
    markMessagesAsRead,
    // Reaction
    addReaction,
    removeReaction,
    editMessage,
    // Chat management
    deleteChat,
    blockChat,
    clearChat,
  };
}; 