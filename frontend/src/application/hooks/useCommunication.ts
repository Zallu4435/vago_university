import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { communicationService } from '../../application/services/communicationService';
import debounce from 'lodash/debounce';
import { Message, MessageForm } from '../../domain/types/user/communication';

interface UseCommunicationManagementProps {
  isAdmin?: boolean;
}

type RecipientType = '' | 'all_students' | 'all_faculty' | 'all_users' | 'individual_students' | 'individual_faculty';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
    mutationFn: (form: MessageForm) => communicationService.sendMessage(form),
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
    sendMessageMutation.mutate({ ...form, isAdmin });
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

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  const handleArchiveMessage = (message: Message) => {
    console.log('Archiving message:', message); 
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

  const mapMessage = (msg: any): Message => {
    const mappedMessage = {
      id: msg._id,
      subject: msg.subject,
      content: msg.content,
      sender: {
        id: msg.sender._id,
        name: msg.sender.name,
        email: msg.sender.email,
        role: msg.sender.role,
      },
      recipients: msg.recipients.map((recipient: any) => ({
        id: recipient._id,
        name: recipient.name,
        email: recipient.email,
        role: recipient.role,
        status: recipient.status
      })),
      attachments: msg.attachments || [],
      isBroadcast: msg.isBroadcast,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      status: msg.status,
      recipientsCount: msg.recipientsCount
    };
    return mappedMessage;
  };

  const fetchUsers = useCallback(async (type: RecipientType, search?: string): Promise<User[]> => {
    try {
      if (!type) {
        return [];
      }
      const users = await communicationService.fetchUsers(type, search);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }, []);

  const handleSendMessageCallback = useCallback(async (form: MessageForm) => {
    try {
      const message = await communicationService.sendMessage(form);
      sentQuery.refetch();
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [sentQuery]);

  const handleViewMessageCallback = useCallback(async (message: Message) => {
    try {
      await communicationService.markAsRead(message.id, isAdmin);
      inboxQuery.refetch();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }, [inboxQuery, isAdmin]);

  const handleDeleteMessageCallback = useCallback(async (messageId: string, type: 'inbox' | 'sent') => {
    try {
      await communicationService.deleteMessage(messageId, isAdmin);
      if (type === 'inbox') {
        inboxQuery.refetch();
      } else {
        sentQuery.refetch();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }, [inboxQuery, sentQuery, isAdmin]);

  const loadInboxMessages = useCallback(async () => {
    try {
      await communicationService.getInboxMessages({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status: filters.status !== 'All Statuses' ? (filters.status.toLowerCase() as 'read' | 'unread') : undefined,
        from: filters.from !== 'All Senders' ? filters.from : undefined,
        isAdmin,
      });
      inboxQuery.refetch();
    } catch (error) {
      console.error('Error loading inbox messages:', error);
    }
  }, [inboxQuery, page, searchTerm, filters, isAdmin]);

  const loadSentMessages = useCallback(async () => {
    try {
      await communicationService.getSentMessages({
        page,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status:
          filters.status !== 'All Statuses'
            ? (filters.status.toLowerCase() as 'read' | 'unread' | 'delivered' | 'opened')
            : undefined,
        to: filters.to !== 'All Recipients' ? filters.to : undefined,
        isAdmin,
      });
      sentQuery.refetch();
    } catch (error) {
      console.error('Error loading sent messages:', error);
    }
  }, [sentQuery, page, searchTerm, filters, isAdmin]);

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
    fetchUsers,
    handleSendMessageCallback,
    handleViewMessageCallback,
    handleDeleteMessageCallback,
    loadInboxMessages,
    loadSentMessages,
  };
};