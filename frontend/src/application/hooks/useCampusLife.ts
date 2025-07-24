// src/application/hooks/useCampusLife.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { campusLifeService } from '../services/campus-life.service';
import { JoinRequest } from '../../domain/types/user/campus-life';

export const useCampusLife = (activeTab?: string, searchTerm?: string, typeFilter?: string, statusFilter?: string, eventSearchTerm?: string, sportsSearchTerm?: string, sportsStatusFilter?: string) => {
  // Debug: log received arguments
  console.log('useCampusLife hook args', { activeTab, searchTerm, typeFilter, statusFilter, eventSearchTerm, sportsSearchTerm });
  // Fetch events
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useQuery({
    queryKey: ['events', eventSearchTerm || '', statusFilter || '', typeFilter || ''],
    queryFn: () => {
      const params = {
        search: eventSearchTerm,
        status: statusFilter,
        type: typeFilter,
      };
      console.log('useCampusLife getEvents params', params);
      return campusLifeService.getEvents(params);
    },
    enabled: activeTab === 'Events',
    staleTime: 0,
  });

  // Fetch sports
  const {
    data: sports,
    isLoading: isLoadingSports,
    error: sportsError,
  } = useQuery({
    queryKey: ['sports', sportsSearchTerm || '', sportsStatusFilter || ''],
    queryFn: () => {
      const params = { search: sportsSearchTerm, status: sportsStatusFilter };
      console.log('useCampusLife getSports params', params);
      return campusLifeService.getSports(params);
    },
    enabled: activeTab === 'Athletics',
  });

  // Fetch clubs
  const {
    data: clubs,
    isLoading: isLoadingClubs,
    error: clubsError,
  } = useQuery({
    queryKey: ['clubs', searchTerm || '', typeFilter || '', statusFilter || ''],
    queryFn: () => campusLifeService.getClubs({ search: searchTerm, type: typeFilter, status: statusFilter }),
    enabled: activeTab === 'Clubs',
    staleTime: 0,
  });

  // Join request mutations
  const {
    mutate: requestToJoinClub,
    isPending: isJoiningClub,
    error: joinClubError
  } = useMutation({
    mutationFn: ({ clubId, request }: { clubId: string; request: JoinRequest }) =>
      campusLifeService.requestToJoinClub(clubId, request)
  });

  const {
    mutate: requestToJoinSport,
    isPending: isJoiningSport,
    error: joinSportError
  } = useMutation({
    mutationFn: ({ sportId, request }: { sportId: string; request: JoinRequest }) =>
      campusLifeService.requestToJoinSport(sportId, request)
  });

  const {
    mutate: requestToJoinEvent,
    isPending: isJoiningEvent,
    error: joinEventError
  } = useMutation({
    mutationFn: ({ eventId, request }: { eventId: string; request: JoinRequest }) =>
      campusLifeService.requestToJoinEvent(eventId, request)
  });

  return {
    // Data
    events: events || [],
    sports: sports || [],
    clubs: clubs || [],
    
    // Loading states
    isLoadingEvents,
    isLoadingSports,
    isLoadingClubs,
    
    // Errors
    eventsError,
    sportsError,
    clubsError,
    
    // Join request methods
    requestToJoinClub,
    requestToJoinSport,
    requestToJoinEvent,
    
    // Join request loading states
    isJoiningClub,
    isJoiningSport,
    isJoiningEvent,
    
    // Join request errors
    joinClubError,
    joinSportError,
    joinEventError
  };
};