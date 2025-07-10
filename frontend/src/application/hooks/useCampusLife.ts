// src/application/hooks/useCampusLife.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { campusLifeService } from '../services/campus-life.service';
import { JoinRequest } from '../../domain/types/user/campus-life';

export const useCampusLife = (activeTab?: string) => {
  // Fetch events
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useQuery({
    queryKey: ['events'],
    queryFn: () => campusLifeService.getEvents(),
    enabled: activeTab === 'Events'
  });

  // Fetch sports
  const {
    data: sports,
    isLoading: isLoadingSports,
    error: sportsError,
  } = useQuery({
    queryKey: ['sports'],
    queryFn: () => campusLifeService.getSports(),
    enabled: activeTab === 'Athletics'
  });

  // Fetch clubs
  const {
    data: clubs,
    isLoading: isLoadingClubs,
    error: clubsError,
  } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => campusLifeService.getClubs(),
    enabled: activeTab === 'Clubs'
  });

  // Join request mutations
  const {
    mutate: requestToJoinClub,
    isLoading: isJoiningClub,
    error: joinClubError
  } = useMutation({
    mutationFn: ({ clubId, request }: { clubId: string; request: JoinRequest }) =>
      campusLifeService.requestToJoinClub(clubId, request)
  });

  const {
    mutate: requestToJoinSport,
    isLoading: isJoiningSport,
    error: joinSportError
  } = useMutation({
    mutationFn: ({ sportId, request }: { sportId: string; request: JoinRequest }) =>
      campusLifeService.requestToJoinSport(sportId, request)
  });

  const {
    mutate: requestToJoinEvent,
    isLoading: isJoiningEvent,
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