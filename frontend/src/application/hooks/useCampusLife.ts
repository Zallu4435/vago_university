// src/application/hooks/useCampusLife.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { campusLifeService } from '../services/campus-life.service';
import { Event, Sport, Club, JoinRequest } from '../../domain/types/campus-life';

export const useCampusLife = () => {
  // Fetch all campus life data
  const {
    data: campusLifeData,
    isLoading: isLoadingCampusLife,
    error: campusLifeError,
  } = useQuery({
    queryKey: ['campusLife'],
    queryFn: () => campusLifeService.getCampusLifeData(),
  });

  // Fetch events
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: eventsError,
  } = useQuery({
    queryKey: ['events'],
    queryFn: () => campusLifeService.getEvents(),
  });

  // Fetch sports
  const {
    data: sports,
    isLoading: isLoadingSports,
    error: sportsError,
  } = useQuery({
    queryKey: ['sports'],
    queryFn: () => campusLifeService.getSports(),
  });

  // Fetch clubs
  const {
    data: clubs,
    isLoading: isLoadingClubs,
    error: clubsError,
  } = useQuery({
    queryKey: ['clubs'],
    queryFn: () => campusLifeService.getClubs(),
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
    campusLifeData,
    events: events || [],
    sports: sports || [],
    clubs: clubs || [],
    
    // Loading states
    isLoadingCampusLife,
    isLoadingEvents,
    isLoadingSports,
    isLoadingClubs,
    
    // Errors
    campusLifeError,
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