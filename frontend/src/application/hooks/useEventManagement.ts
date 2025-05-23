// src/application/hooks/useEventManagement.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { eventService } from '../services/event.service';
import { Event, EventRequest, Participant, EventApiResponse } from '../../domain/types/event';

interface Filters {
  type: string;
  status: string;
  organizer: string;
}

export const useEventManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    type: 'All Types',
    status: 'All Statuses',
    organizer: 'All Organizers',
  });
  const limit = 10;

  const { data: eventsData, isLoading: isLoadingEvents, error: eventsError } = useQuery({
    queryKey: ['events', page, filters, limit],
    queryFn: () =>
      eventService.getEvents(
        page,
        limit,
        filters.type !== 'All Types' ? filters.type : undefined,
        filters.status !== 'All Statuses' ? filters.status : undefined,
        filters.organizer !== 'All Organizers' ? filters.organizer : undefined
      ),
    keepPreviousData: true,
  });

  const { data: eventRequestsData, isLoading: isLoadingRequests, error: requestsError } = useQuery({
    queryKey: ['eventRequests', page, filters, limit],
    queryFn: () =>
      eventService.getEventRequests(
        page,
        limit,
        filters.type !== 'All Types' ? filters.type : undefined,
        filters.status !== 'All Statuses' ? filters.status : undefined,
        filters.organizer !== 'All Organizers' ? filters.organizer : undefined
      ),
    enabled: false,
    keepPreviousData: true,
  });

  const { data: participantsData, isLoading: isLoadingParticipants, error: participantsError } = useQuery({
    queryKey: ['participants', page, filters, limit],
    queryFn: () =>
      eventService.getParticipants(
        page,
        limit,
        filters.status !== 'All Statuses' ? filters.status : undefined
      ),
    enabled: false,
    keepPreviousData: true,
  });

  const { mutateAsync: createEvent } = useMutation({
    mutationFn: (data: Omit<Event, 'id' | 'participants'>) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

  const { mutateAsync: updateEvent } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => 
      eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    },
  });

  const { mutateAsync: deleteEvent } = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });

  const { mutateAsync: approveEventRequest } = useMutation({
    mutationFn: (id: string) => eventService.approveEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventRequests', 'events'] });
      toast.success('Event request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve event request');
    },
  });

  const { mutateAsync: rejectEventRequest } = useMutation({
    mutationFn: (id: string) => eventService.rejectEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventRequests'] });
      toast.success('Event request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject event request');
    },
  });

  const { mutateAsync: approveParticipant } = useMutation({
    mutationFn: (id: string) => eventService.approveParticipant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', 'events'] });
      toast.success('Participant approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve participant');
    },
  });

  const { mutateAsync: rejectParticipant } = useMutation({
    mutationFn: (id: string) => eventService.rejectParticipant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participant rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject participant');
    },
  });

  const { mutateAsync: removeParticipant } = useMutation({
    mutationFn: (id: string) => eventService.removeParticipant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      toast.success('Participant removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove participant');
    },
  });

  return {
    events: eventsData?.events || [],
    eventRequests: eventRequestsData?.events || [],
    participants: participantsData?.events || [],
    totalPages: eventsData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading: isLoadingEvents || isLoadingRequests || isLoadingParticipants,
    error: eventsError || requestsError || participantsError,
    createEvent,
    updateEvent,
    deleteEvent,
    approveEventRequest,
    rejectEventRequest,
    approveParticipant,
    rejectParticipant,
    removeParticipant,
  };
};