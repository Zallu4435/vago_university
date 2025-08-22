import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { sportsService } from '../services/sports.service';
import { Team, TeamApiResponseSingle } from '../../domain/types/management/sportmanagement';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
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
    queryKey: ['teams', page, filters, searchTerm, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      return sportsService.getTeams(
        page,
        limit,
        filters.sportType !== 'all' ? filters.sportType : undefined,
        filters.status !== 'all' ? filters.status : undefined,
        undefined,
        dateRange,
        searchTerm && searchTerm.trim() !== '' ? searchTerm : undefined
      );
    },
    enabled: activeTab === 'teams',
  });

  const { data: playerRequestsData, isLoading: isLoadingPlayerRequests, error: playerRequestsError } = useQuery({
    queryKey: ['playerRequests', page, filters, searchTerm, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      return sportsService.getPlayerRequests(
        page,
        limit,
        filters.sportType !== 'all' ? filters.sportType : undefined,
        filters.status !== 'all' ? filters.status : undefined,
        dateRange,
        searchTerm && searchTerm.trim() !== '' ? searchTerm : undefined
      );
    },
    enabled: activeTab === 'requests',
  });

  const { data: teamDetails, isLoading: isLoadingTeamDetails } = useQuery<TeamApiResponseSingle['data']>({
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
    onError: (error: Error) => {
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
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team');
    },
  });

  const { mutateAsync: deleteTeam } = useMutation({
    mutationFn: (id: string) => sportsService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete team');
    },
  });

  const { mutateAsync: approvePlayerRequest } = useMutation({
    mutationFn: (id: string) => sportsService.approvePlayerRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['requestDetails'] });
      toast.success('Player request approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve player request');
    },
  });

  const { mutateAsync: rejectPlayerRequest } = useMutation({
    mutationFn: (id: string) => sportsService.rejectPlayerRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerRequests'] });
      queryClient.invalidateQueries({ queryKey: ['requestDetails'] });
      toast.success('Player request rejected successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject player request');
    },
  });

  const handleTabChange = (tab: 'teams' | 'requests') => {
    setActiveTab(tab);
    setPage(1);

    if (tab === 'teams') {
      queryClient.fetchQuery({
        queryKey: ['teams', page, filters, searchTerm, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          return sportsService.getTeams(
            page,
            limit,
            filters.sportType !== 'all' ? filters.sportType : undefined,
            filters.status !== 'all' ? filters.status : undefined,
            undefined, // coach
            dateRange,
            searchTerm && searchTerm.trim() !== '' ? searchTerm : undefined
          );
        },
      });
    } else if (tab === 'requests') {
      queryClient.fetchQuery({
        queryKey: ['playerRequests', page, filters, searchTerm, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          return sportsService.getPlayerRequests(
            page,
            limit,
            filters.sportType !== 'all' ? filters.sportType : undefined,
            filters.status !== 'all' ? filters.status : undefined,
            dateRange,
            searchTerm && searchTerm.trim() !== '' ? searchTerm : undefined
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
    teams: teamsData?.data || [],
    playerRequests: playerRequestsData?.data || [],
    totalPages: activeTab === 'teams' ? teamsData?.totalPages || 0 : playerRequestsData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    isLoading: isLoadingTeams || isLoadingPlayerRequests || isLoadingTeamDetails || isLoadingRequestDetails,
    error: teamsError || playerRequestsError,
    createTeam,
    updateTeam,
    deleteTeam,
    approvePlayerRequest,
    rejectPlayerRequest,
    handleTabChange,
    teamDetails : teamDetails?.sport,
    handleViewTeam,
    handleEditTeam,
    setSelectedTeamId,
    requestDetails,
    handleViewRequest,
    isLoadingRequestDetails,
  };
};