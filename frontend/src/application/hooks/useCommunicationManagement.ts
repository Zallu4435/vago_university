// src/application/hooks/useCommunicationManagement.ts

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { communicationService } from '../services/communication.service';
import { Message, MessageForm } from '../../domain/types/communication';

export const useCommunicationManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All Statuses',
    from: 'All Senders',
    to: 'All Recipients',
  });

  // Fetch inbox messages
  const {
    data: inboxData,
    isLoading: isLoadingInbox,
    error: inboxError,
  } = useQuery({
    queryKey: ['inbox', page, searchTerm, filters],
    queryFn: () =>
      communicationService.getInboxMessages({
        page,
        limit: 10,
        search: searchTerm,
        status: filters.status !== 'All Statuses' ? filters.status : undefined,
        from: filters.from !== 'All Senders' ? filters.from : undefined,
      }),
  });

  // Fetch sent messages
  const {
    data: sentData,
    isLoading: isLoadingSent,
    error: sentError,
  } = useQuery({
    queryKey: ['sent', page, searchTerm, filters],
    queryFn: () =>
      communicationService.getSentMessages({
        page,
        limit: 10,
        search: searchTerm,
        status: filters.status !== 'All Statuses' ? filters.status : undefined,
        to: filters.to !== 'All Recipients' ? filters.to : undefined,
      }),
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (form: MessageForm) => communicationService.sendMessage(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent'] });
      toast.success('Message sent successfully');
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  // Reply to message mutation
  const replyMessageMutation = useMutation({
    mutationFn: ({ messageId, form }: { messageId: string; form: MessageForm }) =>
      communicationService.replyToMessage(messageId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent', 'inbox'] });
      toast.success('Reply sent successfully');
    },
    onError: () => {
      toast.error('Failed to send reply');
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: ({ messageId, type }: { messageId: string; type: 'inbox' | 'sent' }) => 
      communicationService.deleteMessage(messageId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', 'sent'] });
      toast.success('Message deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete message');
    },
  });

  // Archive message mutation
  const archiveMessageMutation = useMutation({
    mutationFn: (messageId: string) => communicationService.archiveMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      toast.success('Message archived successfully');
    },
    onError: () => {
      toast.error('Failed to archive message');
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => communicationService.markAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
    },
    onError: () => {
      toast.error('Failed to mark message as read');
    },
  });

  // Handlers
  const handleSendMessage = useCallback(
    (form: MessageForm) => {
      sendMessageMutation.mutate(form);
    },
    [sendMessageMutation]
  );

  const handleReplyMessage = useCallback(
    (messageId: string, form: MessageForm) => {
      replyMessageMutation.mutate({ messageId, form });
    },
    [replyMessageMutation]
  );

  const handleDeleteMessage = useCallback(
    (messageId: any, type: 'inbox' | 'sent') => {
      deleteMessageMutation.mutate({ messageId, type });
    },
    [deleteMessageMutation]
  );

  const handleArchiveMessage = useCallback(
    (messageId: string) => {
      archiveMessageMutation.mutate(messageId);
    },
    [archiveMessageMutation]
  );

  const handleViewMessage = useCallback(
    (message: Message) => {
      if (message.status === 'unread') {
        markAsReadMutation.mutate(message.id);
      }
    },
    [markAsReadMutation]
  );

  return {
    // Data
    inboxMessages: inboxData?.data || [],
    sentMessages: sentData?.data || [],
    totalInboxPages: Math.ceil((inboxData?.total || 0) / 10),
    totalSentPages: Math.ceil((sentData?.total || 0) / 10),
    
    // Loading states
    isLoadingInbox,
    isLoadingSent,
    
    // Errors
    inboxError,
    sentError,
    
    // State
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    
    // Handlers
    handleSendMessage,
    handleReplyMessage,
    handleDeleteMessage,
    handleArchiveMessage,
    handleViewMessage,
  };
};