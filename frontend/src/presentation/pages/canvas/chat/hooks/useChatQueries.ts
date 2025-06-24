import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../services/chatService';

export const useChatQueries = (params: {
  chatId?: string;
  messagesPage?: number;
  messagesLimit?: number;
  chatsPage?: number;
  chatsLimit?: number;
  query?: string;
} = {}) => {
  const queryClient = useQueryClient();

  // All chats
  const {
    data: chatsResponse,
    isLoading: isLoadingChats,
    error: errorChats
  } = useQuery({
    queryKey: ['chats', params.chatsPage, params.chatsLimit],
    queryFn: () => chatService.getChats(params.chatsPage, params.chatsLimit),
    enabled: params.chatsPage !== undefined && params.chatsLimit !== undefined,
  });

  // Search chats
  const {
    data: searchChats,
    isLoading: isLoadingSearchChats,
    error: errorSearchChats
  } = useQuery({
    queryKey: ['searchChats', params.query, params.chatsPage, params.chatsLimit],
    queryFn: () => chatService.searchChats(params.query!, params.chatsPage, params.chatsLimit),
    enabled: !!params.query,
  });

  // Chat details
  const {
    data: chatDetails,
    isLoading: isLoadingChatDetails,
    error: errorChatDetails
  } = useQuery({
    queryKey: ['chat', params.chatId],
    queryFn: () => chatService.getChatDetails(params.chatId!),
    enabled: !!params.chatId,
  });

  // Messages
  const {
    data: messagesResponse,
    isLoading: isLoadingMessages,
    error: errorMessages
  } = useQuery({
    queryKey: ['messages', params.chatId, params.messagesPage, params.messagesLimit],
    queryFn: () => chatService.getMessages(params.chatId!, params.messagesPage, params.messagesLimit),
    enabled: !!params.chatId && params.messagesPage !== undefined && params.messagesLimit !== undefined,
  });

  // Chat by ID (alias)
  const {
    data: chatById,
    isLoading: isLoadingChatById,
    error: errorChatById
  } = useQuery({
    queryKey: ['chatById', params.chatId],
    queryFn: () => chatService.getChatById(params.chatId!),
    enabled: !!params.chatId,
  });

  // Search users
  const {
    data: searchUsers,
    isLoading: isLoadingSearchUsers,
    error: errorSearchUsers
  } = useQuery({
    queryKey: ['searchUsers', params.query, params.chatsPage, params.chatsLimit],
    queryFn: () => chatService.searchUsers(params.query!, params.chatsPage, params.chatsLimit),
    enabled: !!params.query,
  });

  // Helper to refetch all chats
  const refetchChats = () => queryClient.invalidateQueries({ queryKey: ['chats'] });

  console.log(messagesResponse, "messagesResponsemessagesResponse")

  return {
    // Data
    chatsResponse,
    searchChats,
    chatDetails,
    messagesResponse,
    chatById,
    searchUsers,

    // Loading states
    isLoadingChats,
    isLoadingSearchChats,
    isLoadingChatDetails,
    isLoadingMessages,
    isLoadingChatById,
    isLoadingSearchUsers,

    // Error states
    errorChats,
    errorSearchChats,
    errorChatDetails,
    errorMessages,
    errorChatById,
    errorSearchUsers,

    // Helpers
    refetchChats,
  };
}; 