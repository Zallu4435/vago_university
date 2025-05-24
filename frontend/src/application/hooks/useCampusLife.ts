// src/application/hooks/useCampusLife.ts
import { useQuery } from '@tanstack/react-query';
import { campusLifeService } from '../services/campus-life.service';
import { Event, Sport, Club } from '../../domain/types/campus-life';

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
  };
};