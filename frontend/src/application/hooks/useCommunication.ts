import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { communicationService } from '../../application/services/communicationService';
import { Message, MessageForm } from '../../domain/types/communication';
import debounce from 'lodash/debounce';

interface UseCommunicationManagementProps {
  isAdmin?: boolean;
}

export const useCommunicationManagement = ({ isAdmin = false }: UseCommunicationManagementProps = {}) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All Statuses',
    from: 'All Senders',
    to: 'All Recipients',
  });

  const ITEMS_PER_PAGE = 10;

  const inboxQuery = useQuery({
    queryKey: ['inboxMessages', page, searchTerm, filters, isAdmin],
    queryFn: () =>
      communicationService.getInboxMessages({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status: filters.status !== 'All Statuses' ? (filters.status.toLowerCase() as 'read' | 'unread') : undefined,
        from: filters.from !== 'All Senders' ? filters.from : undefined,
        isAdmin,
      }),
  });

  const sentQuery = useQuery({
    queryKey: ['sentMessages', page, searchTerm, filters, isAdmin],
    queryFn: () =>
      communicationService.getSentMessages({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status:
          filters.status !== 'All Statuses'
            ? (filters.status.toLowerCase() as 'read' | 'unread' | 'delivered' | 'opened')
            : undefined,
        to: filters.to !== 'All Recipients' ? filters.to : undefined,
        isAdmin,
      }),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (form: MessageForm) => communicationService.sendMessage({ ...form, isAdmin }),
    onSuccess: () => {
      sentQuery.refetch();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => communicationService.markAsRead(messageId, isAdmin),
    onSuccess: () => inboxQuery.refetch(),
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => communicationService.deleteMessage(messageId, isAdmin),
    onSuccess: () => {
      inboxQuery.refetch();
      sentQuery.refetch();
    },
  });

  const handleSendMessage = (form: MessageForm) => {
    sendMessageMutation.mutate(form);
  };

  const handleReplyMessage = (message: Message) => {
    sendMessageMutation.mutate({
      to: [{ value: message.sender.id, label: message.sender.name }],
      subject: `Re: ${message.subject}`,
      message: '',
      attachments: [],
      isAdmin,
  });
};

  const handleDeleteMessage = (messageId: string, tab: 'inbox' | 'sent') => {
    deleteMessageMutation.mutate(messageId);
  };

  const handleArchiveMessage = (message: Message) => {
    console.log('Archiving message:', message); // Placeholder for archive functionality
  };

  const handleViewMessage = (message: Message) => {
    if (message.status === 'unread') {
      markAsReadMutation.mutate(message.id);
    }
  };

  const fetchSentMessages = () => {
    sentQuery.refetch();
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(1);
    }, 500),
    []
  );

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
      setPage(1);
    }, 500),
    []
  );

  // Map backend messages to frontend format
  const mapMessage = (msg: any): Message => ({
    id: msg._id,
    subject: msg.subject,
    content: msg.content,
    sender: {
      id: msg.sender._id,
      name: msg.sender.name,
      email: msg.sender.email,
      role: msg.sender.role,
    },
    recipients: [{
      id: 'admin',
      name: msg.to,
      email: msg.to,
      role: 'admin',
      status: msg.status === 'read' ? 'read' : 'unread'
    }],
    isBroadcast: msg.isBroadcast,
    createdAt: msg.createdAt,
    updatedAt: msg.updatedAt,
    status: msg.status,
    recipientsCount: msg.recipients
  });

  return {
    inboxMessages: (inboxQuery.data?.messages || []).map(mapMessage),
    sentMessages: (sentQuery.data?.messages || []).map(mapMessage),
    totalInboxPages: inboxQuery.data?.pagination.totalPages || 1,
    totalSentPages: sentQuery.data?.pagination.totalPages || 1,
    isLoadingInbox: inboxQuery.isLoading,
    isLoadingSent: sentQuery.isLoading,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    handleSendMessage,
    handleReplyMessage,
    handleDeleteMessage,
    handleArchiveMessage,
    handleViewMessage,
    fetchSentMessages,
    debouncedSearch,
    debouncedFilterChange,
  };
};