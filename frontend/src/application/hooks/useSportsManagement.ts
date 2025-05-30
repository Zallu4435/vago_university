import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sportsService } from '../services/sports.service';
import { Team } from '../../domain/types/sports';

interface Filters {
  sportType: string;
  status: string;
  dateRange: string;
}

export const useSportsManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    sportType: 'all',
    status: 'all',
    dateRange: 'all',
  });
  const [activeTab, setActiveTab] = useState<'teams' | 'requests'>('teams');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const limit = 10;

  const getDateRangeFilter = (dateRange: string): string | undefined => {
    if (!dateRange || dateRange === 'all') return undefined;

    const now = new Date();
    const startDate = new Date();

    switch (dateRange.toLowerCase()) {
      case 'last_week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'last_month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'last_3_months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'last_6_months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'last_year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return undefined;
    }

    const dateRangeString = `${startDate.toISOString()},${now.toISOString()}`;
    return dateRangeString;
  };

  const { data: teamsData, isLoading: isLoadingTeams, error: teamsError } = useQuery({
    queryKey: ['teams', page, filters, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      return sportsService.getTeams(
        page,
        limit,
        filters.sportType !== 'all' ? filters.sportType : undefined,
        filters.status !== 'all' ? filters.status : undefined,
        dateRange
      );
    },
    enabled: activeTab === 'teams',
  });

  const { data: playerRequestsData, isLoading: isLoadingPlayerRequests, error: playerRequestsError } = useQuery({
    queryKey: ['playerRequests', page, filters, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      return sportsService.getPlayerRequests(
        page,
        limit,
        filters.sportType !== 'all' ? filters.sportType : undefined,
        filters.status !== 'all' ? filters.status : undefined,
        dateRange
      );
    },
    enabled: activeTab === 'requests',
  });

  const { data: teamDetails, isLoading: isLoadingTeamDetails } = useQuery({
    queryKey: ['teamDetails', selectedTeamId],
    queryFn: () => {
      if (!selectedTeamId) throw new Error('No team ID provided');
      return sportsService.getTeamDetails(selectedTeamId);
    },
    enabled: !!selectedTeamId,
  });

  const { data: requestDetails, isLoading: isLoadingRequestDetails } = useQuery({
    queryKey: ['requestDetails', selectedRequestId],
    queryFn: () => {
      if (!selectedRequestId) throw new Error('No request ID provided');
      return sportsService.getRequestDetails(selectedRequestId);
    },
    enabled: !!selectedRequestId,
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

  const { mutateAsync: getESportRequestDetails } = useMutation({
    mutationFn: (id: string) => sportsService.getESportRequestDetails(id),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch event request details');
    },
  });

  const handleTabChange = (tab: 'teams' | 'requests') => {
    setActiveTab(tab);
    setPage(1);

    if (tab === 'teams') {
      queryClient.fetchQuery({
        queryKey: ['teams', page, filters, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          return sportsService.getTeams(
            page,
            limit,
            filters.sportType !== 'all' ? filters.sportType : undefined,
            filters.status !== 'all' ? filters.status : undefined,
            dateRange
          );
        },
      });
    } else if (tab === 'requests') {
      queryClient.fetchQuery({
        queryKey: ['playerRequests', page, filters, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          return sportsService.getPlayerRequests(
            page,
            limit,
            filters.sportType !== 'all' ? filters.sportType : undefined,
            filters.status !== 'all' ? filters.status : undefined,
            dateRange
          );
        },
      });
    }
  };

  const handleViewTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleEditTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleViewRequest = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  return {
    teams: teamsData?.teams || [],
    playerRequests: playerRequestsData?.playerRequests || [],
    totalPages: activeTab === 'teams' ? teamsData?.totalPages || 0 : playerRequestsData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading: isLoadingTeams || isLoadingPlayerRequests || isLoadingTeamDetails || isLoadingRequestDetails,
    error: teamsError || playerRequestsError,
    createTeam,
    updateTeam,
    deleteTeam,
    approvePlayerRequest,
    rejectPlayerRequest,
    handleTabChange,
    teamDetails,
    handleViewTeam,
    handleEditTeam,
    setSelectedTeamId,
    requestDetails,
    handleViewRequest,
    isLoadingRequestDetails,
  };
};