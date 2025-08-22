import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { eventService } from '../services/event.service';
import { Event, EventRequest, Filters } from '../../domain/types/management/eventmanagement';

export const useEventManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    eventType: 'All',
    dateRange: 'All',
    status: 'All',
    organizerType: 'All',
  });
  const [activeTab, setActiveTab] = useState<'events' | 'requests' | 'participants'>('events');
  const limit = 10;

  const getDateRangeFilter = (dateRange: string): string | undefined => {
    if (!dateRange || dateRange === 'All') return undefined;

    const now = new Date();
    const startDate = new Date();

    const range = dateRange.toLowerCase();

    switch (range) {
      case 'last_week':
      case 'last week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last_month':
      case 'last month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'last_3_months':
      case 'last 3 months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'last_6_months':
      case 'last 6 months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'last_year':
      case 'last year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return undefined;
    }

    const dateRangeString = `${startDate.toISOString()},${now.toISOString()}`;
    return dateRangeString;
  };

  const { data: eventsData, isLoading: isLoadingEvents, error: eventsError } = useQuery({
    queryKey: ['events', page, filters, searchTerm, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      return eventService.getEvents(
        page,
        limit,
        filters.eventType !== 'All' ? filters.eventType : undefined,
        filters.status !== 'All' ? filters.status : undefined,
        dateRange,
        searchTerm || undefined,
        filters.organizerType !== 'All' ? filters.organizerType : undefined
      );
    },
    enabled: activeTab === 'events', 
  });

  const { data: eventRequestsData, isLoading: isLoadingRequests, error: requestsError } = useQuery({
    queryKey: ['eventRequests', page, filters, searchTerm, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      return eventService.getEventRequests(
        page,
        limit,
        filters.eventType !== 'All' ? filters.eventType : undefined,
        filters.status !== 'All' ? filters.status : undefined,
        dateRange,
        searchTerm || undefined,
        filters.organizerType !== 'All' ? filters.organizerType : undefined
      );
    },
    enabled: activeTab === 'requests', 
  });

  const { mutateAsync: createEvent } = useMutation({
    mutationFn: (data: Omit<Event, 'id' | 'participants'>) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

  const { mutateAsync: updateEvent } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update event');
    },
  });

  const { mutateAsync: deleteEvent } = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });

  const { mutateAsync: approveEventRequest } = useMutation({
    mutationFn: (id: string) => eventService.approveEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventRequests', 'events'] });
      toast.success('Event request approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve event request');
    },
  });

  const { mutateAsync: rejectEventRequest } = useMutation({
    mutationFn: (id: string) => eventService.rejectEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventRequests'] });
      toast.success('Event request rejected successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject event request');
    },
  });

  const { mutateAsync: getEventDetails } = useMutation({
    mutationFn: (id: string) => eventService.getEventDetails(id),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to fetch event details');
    },
  });

  const { mutateAsync: getEventRequestDetails } = useMutation({
    mutationFn: (id: string) => eventService.getEventRequestDetails(id),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to fetch request details');
    },
  });

  const handleTabChange = (tab: 'events' | 'requests' | 'participants') => {
    setActiveTab(tab);
    setPage(1); 

    if (tab === 'events') {
      queryClient.fetchQuery({
        queryKey: ['events', page, filters, searchTerm, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          return eventService.getEvents(
            page,
            limit,
            filters.eventType !== 'All' ? filters.eventType : undefined,
            filters.status !== 'All' ? filters.status : undefined,
            dateRange,
            searchTerm || undefined,
            filters.organizerType !== 'All' ? filters.organizerType : undefined
          );
        },
      });
    } else if (tab === 'requests') {
      queryClient.fetchQuery({
        queryKey: ['eventRequests', page, filters, searchTerm, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          return eventService.getEventRequests(
            page,
            limit,
            filters.eventType !== 'All' ? filters.eventType : undefined,
            filters.status !== 'All' ? filters.status : undefined,
            dateRange,
            searchTerm || undefined,
            filters.organizerType !== 'All' ? filters.organizerType : undefined
          );
        },
      }); 
    }
  };
  console.log(getEventRequestDetails, 'getEventRequestDetails');  
  return {
    events: eventsData?.events || [],
    eventRequests: (eventRequestsData?.eventRequests || []).map((req: EventRequest) => ({ ...req, id: req.id })),
    totalPages: activeTab === 'events' ? eventsData?.totalPages || 0 : eventRequestsData?.totalPages || 0,
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    isLoading: isLoadingEvents || isLoadingRequests ,
    error: eventsError || requestsError,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEventRequest,
    rejectEventRequest,
    getEventDetails,
    getEventRequestDetails,
    handleTabChange,
  };
};