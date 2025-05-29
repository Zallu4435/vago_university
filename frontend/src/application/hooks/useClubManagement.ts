import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { clubService } from '../services/club.service';
import { Club, ClubRequest, MemberRequest, ClubApiResponse } from '../../domain/types/club';

interface Filters {
  category: string;
  status: string;
  dateRange: string;
}

export const useClubManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    status: 'All',
    dateRange: 'All',
  });
  const [activeTab, setActiveTab] = useState<'clubs' | 'requests' | 'members'>('clubs');
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
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
    console.log('Date range string:', dateRangeString);
    return dateRangeString;
  };

  const { data: clubsData, isLoading: isLoadingClubs, error: clubsError } = useQuery({
    queryKey: ['clubs', page, filters, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      const category = filters.category !== 'All' ? filters.category.toLowerCase().replace(/\s+/g, '_') : undefined;
      const status = filters.status !== 'All' ? filters.status.toLowerCase().replace(/\s+/g, '_') : undefined;
      
      console.log('Clubs API call with filters:', {
        page,
        limit,
        category,
        status,
        dateRange
      });

      return clubService.getClubs(
        page,
        limit,
        category,
        status,
        dateRange
      );
    },
    enabled: activeTab === 'clubs',
  });

  const { data: clubRequestsData, isLoading: isLoadingRequests, error: requestsError } = useQuery({
    queryKey: ['clubRequests', page, filters, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      const category = filters.category !== 'All' ? filters.category.toLowerCase().replace(/\s+/g, '_') : undefined;
      const status = filters.status !== 'All' ? filters.status.toLowerCase().replace(/\s+/g, '_') : undefined;
      
      console.log('Club Requests API call with filters:', {
        page,
        limit,
        category,
        status,
        dateRange
      });

      return clubService.getClubRequests(
        page,
        limit,
        category,
        status,
        dateRange
      );
    },
    enabled: activeTab === 'requests',
  });

  const { data: memberRequestsData, isLoading: isLoadingMembers, error: membersError } = useQuery({
    queryKey: ['memberRequests', page, filters, limit],
    queryFn: () => {
      const dateRange = getDateRangeFilter(filters.dateRange);
      const status = filters.status !== 'All' ? filters.status.toLowerCase().replace(/\s+/g, '_') : undefined;
      
      console.log('Member Requests API call with filters:', {
        page,
        limit,
        status,
        dateRange
      });

      return clubService.getMemberRequests(
        page,
        limit,
        status,
        dateRange
      );
    },
    enabled: activeTab === 'members',
  });

  const { data: selectedClub, isLoading: isLoadingClubDetails, error: clubDetailsError } = useQuery({
    queryKey: ['clubDetails', selectedClubId],
    queryFn: () => {
      if (!selectedClubId) return null;
      return clubService.getClubDetails(selectedClubId);
    },
    enabled: !!selectedClubId,
  });

  const { mutateAsync: getClubDetails } = useMutation({
    mutationFn: (id: string) => clubService.getClubDetails(id),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch club details');
    },
  });

  const { mutateAsync: getClubRequestDetails } = useMutation({
    mutationFn: (id: string) => clubService.getClubRequestDetails(id),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch club request details');
    },
  });

  const handleTabChange = (tab: 'clubs' | 'requests' | 'members') => {
    setActiveTab(tab);
    setPage(1); // Reset page when changing tabs

    // Trigger the appropriate query based on the active tab
    if (tab === 'clubs') {
      queryClient.fetchQuery({
        queryKey: ['clubs', page, filters, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          const category = filters.category !== 'All' ? filters.category.toLowerCase().replace(/\s+/g, '_') : undefined;
          const status = filters.status !== 'All' ? filters.status.toLowerCase().replace(/\s+/g, '_') : undefined;
          
          console.log('Clubs API call with filters (tab change):', {
            page,
            limit,
            category,
            status,
            dateRange
          });

          return clubService.getClubs(
            page,
            limit,
            category,
            status,
            dateRange
          );
        },
      });
    } else if (tab === 'requests') {
      queryClient.fetchQuery({
        queryKey: ['clubRequests', page, filters, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          const category = filters.category !== 'All' ? filters.category.toLowerCase().replace(/\s+/g, '_') : undefined;
          const status = filters.status !== 'All' ? filters.status.toLowerCase().replace(/\s+/g, '_') : undefined;
          
          console.log('Club Requests API call with filters (tab change):', {
            page,
            limit,
            category,
            status,
            dateRange
          });

          return clubService.getClubRequests(
            page,
            limit,
            category,
            status,
            dateRange
          );
        },
      });
    } else if (tab === 'members') {
      queryClient.fetchQuery({
        queryKey: ['memberRequests', page, filters, limit],
        queryFn: () => {
          const dateRange = getDateRangeFilter(filters.dateRange);
          const status = filters.status !== 'All' ? filters.status.toLowerCase().replace(/\s+/g, '_') : undefined;
          
          console.log('Member Requests API call with filters (tab change):', {
            page,
            limit,
            status,
            dateRange
          });

          return clubService.getMemberRequests(
            page,
            limit,
            status,
            dateRange
          );
        },
      });
    }
  };

  const { mutateAsync: createClub } = useMutation({
    mutationFn: (data: Omit<Club, '_id' | 'members'>) => clubService.createClub(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Club created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create club');
    },
  });

  const { mutateAsync: updateClub } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Club> }) =>
      clubService.updateClub(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Club updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update club');
    },
  });

  const { mutateAsync: deleteClub } = useMutation({
    mutationFn: (id: string) => clubService.deleteClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast.success('Club deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete club');
    },
  });

  const { mutateAsync: approveClubRequest } = useMutation({
    mutationFn: (id: string) => clubService.approveClubRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubRequests', 'clubs'] });
      toast.success('Club request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve club request');
    },
  });

  const { mutateAsync: rejectClubRequest } = useMutation({
    mutationFn: (id: string) => clubService.rejectClubRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubRequests'] });
      toast.success('Club request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject club request');
    },
  });

  const { mutateAsync: approveMemberRequest } = useMutation({
    mutationFn: (id: string) => clubService.approveMemberRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberRequests', 'clubs'] });
      toast.success('Member request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve member request');
    },
  });

  const { mutateAsync: rejectMemberRequest } = useMutation({
    mutationFn: (id: string) => clubService.rejectMemberRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberRequests'] });
      toast.success('Member request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject member request');
    },
  });


  return {
    clubs: clubsData?.clubs || [],
    clubRequests: clubRequestsData?.clubs || [],
    memberRequests: memberRequestsData?.memberRequests || [],
    totalPages:
      activeTab === 'clubs'
        ? clubsData?.totalPages || 0
        : activeTab === 'requests'
        ? clubRequestsData?.totalPages || 0
        : memberRequestsData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading: isLoadingClubs || isLoadingRequests || isLoadingMembers,
    error: clubsError || requestsError || membersError,
    createClub,
    updateClub,
    deleteClub,
    approveClubRequest,
    rejectClubRequest,
    approveMemberRequest,
    rejectMemberRequest,
    handleTabChange,
    getClubDetails,
    getClubRequestDetails,
    selectedClub,
    isLoadingClubDetails,
    clubDetailsError,
  };
};