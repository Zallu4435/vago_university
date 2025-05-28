import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sportsService } from '../services/sports.service';
import { Team, Event, TeamRequest, PlayerRequest, SportsApiResponse } from '../../domain/types/sports';

interface Filters {
  sportType: string;
  status: string;
  coach: string;
}

export const useSportsManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    sportType: 'all',
    status: 'all',
    coach: 'all',
  });
  const limit = 10;
  const [activeTab, setActiveTab] = useState<'teams' | 'events' | 'requests'>('teams');

  // Only fetch teams when component mounts
  const { data: teamsData, isLoading: isLoadingTeams, error: teamsError } = useQuery({
    queryKey: ['teams', page, filters, limit],
    queryFn: () =>
      sportsService.getTeams(
        page,
        limit,
        filters.sportType !== 'all' ? filters.sportType : undefined,
        filters.status !== 'all' ? filters.status : undefined,
        filters.coach !== 'all' ? filters.coach : undefined
      ),
    enabled: activeTab === 'teams',
  });

  // Only fetch events when needed
  const { data: eventsData, isLoading: isLoadingEvents, error: eventsError } = useQuery({
    queryKey: ['events', page, filters, limit],
    queryFn: () =>
      sportsService.getEvents(
        page,
        limit,
        filters.sportType !== 'all' ? filters.sportType : undefined,
        filters.status !== 'all' ? filters.status : undefined
      ),
    enabled: activeTab === 'events',
  });

  // Only fetch team requests when needed
  const { data: teamRequestsData, isLoading: isLoadingTeamRequests, error: teamRequestsError } = useQuery({
    queryKey: ['teamRequests', page, filters, limit],
    queryFn: () =>
      sportsService.getTeamRequests(
        page,
        limit,
        filters.status !== 'all' ? filters.status : undefined
      ),
    enabled: activeTab === 'requests',
  });

  // Only fetch player requests when needed
  const { data: playerRequestsData, isLoading: isLoadingPlayerRequests, error: playerRequestsError } = useQuery({
    queryKey: ['playerRequests', page, filters, limit],
    queryFn: () =>
      sportsService.getPlayerRequests(
        page,
        limit,
        filters.status !== 'all' ? filters.status : undefined
      ),
    enabled: activeTab === 'requests',
  });

  const { mutateAsync: createTeam } = useMutation({
    mutationFn: (data: Omit<Team, 'id'>) => sportsService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create team');
    },
  });

  const { mutateAsync: updateTeam } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Team> }) => 
      sportsService.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update team');
    },
  });

  const { mutateAsync: deleteTeam } = useMutation({
    mutationFn: (id: string) => sportsService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete team');
    },
  });

  const { mutateAsync: scheduleEvent } = useMutation({
    mutationFn: (data: Omit<Event, 'id'>) => sportsService.scheduleEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to schedule event');
    },
  });

  const { mutateAsync: approveTeamRequest } = useMutation({
    mutationFn: (id: string) => sportsService.approveTeamRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamRequests', 'teams'] });
      toast.success('Team request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve team request');
    },
  });

  const { mutateAsync: rejectTeamRequest } = useMutation({
    mutationFn: (id: string) => sportsService.rejectTeamRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamRequests'] });
      toast.success('Team request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject team request');
    },
  });

  const { mutateAsync: approvePlayerRequest } = useMutation({
    mutationFn: (id: string) => sportsService.approvePlayerRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerRequests', 'teams'] });
      toast.success('Player request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve player request');
    },
  });

  const { mutateAsync: rejectPlayerRequest } = useMutation({
    mutationFn: (id: string) => sportsService.rejectPlayerRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerRequests'] });
      toast.success('Player request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject player request');
    },
  });

  // Function to fetch data based on active tab
  const fetchDataForTab = async (tab: 'teams' | 'events' | 'requests') => {
    switch (tab) {
      case 'events':
        await queryClient.fetchQuery({
          queryKey: ['events', page, filters, limit],
          queryFn: () =>
            sportsService.getEvents(
              page,
              limit,
              filters.sportType !== 'all' ? filters.sportType : undefined,
              filters.status !== 'all' ? filters.status : undefined
            ),
        });
        break;
      case 'requests':
        await Promise.all([
          queryClient.fetchQuery({
            queryKey: ['teamRequests', page, filters, limit],
            queryFn: () =>
              sportsService.getTeamRequests(
                page,
                limit,
                filters.status !== 'all' ? filters.status : undefined
              ),
          }),
          queryClient.fetchQuery({
            queryKey: ['playerRequests', page, filters, limit],
            queryFn: () =>
              sportsService.getPlayerRequests(
                page,
                limit,
                filters.status !== 'all' ? filters.status : undefined
              ),
          }),
        ]);
        break;
    }
  };

  const handleTabChange = (tab: 'teams' | 'events' | 'requests') => {
    setActiveTab(tab);
  };

  return {
    teams: teamsData?.teams || [],
    events: eventsData?.events || [],
    teamRequests: teamRequestsData?.teamRequests || [],
    playerRequests: playerRequestsData?.playerRequests || [],
    totalPages: teamsData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading: isLoadingTeams || isLoadingEvents || isLoadingTeamRequests || isLoadingPlayerRequests,
    error: teamsError || eventsError || teamRequestsError || playerRequestsError,
    createTeam,
    updateTeam,
    deleteTeam,
    scheduleEvent,
    approveTeamRequest,
    rejectTeamRequest,
    approvePlayerRequest,
    rejectPlayerRequest,
    handleTabChange,
  };
};