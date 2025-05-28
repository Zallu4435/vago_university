// src/application/hooks/useClubManagement.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { clubService } from '../services/club.service';
import { Club, ClubRequest, MemberRequest, ClubApiResponse } from '../../domain/types/club';

interface Filters {
  category: string;
  status: string;
}

export const useClubManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    status: 'all',
  });
  const limit = 10;

  const { data: clubsData, isLoading: isLoadingClubs, error: clubsError } = useQuery({
    queryKey: ['clubs', page, filters, limit],
    queryFn: () =>
      clubService.getClubs(
        page,
        limit,
        filters.status !== 'all' ? filters.status : undefined
      ),
  });

  const { data: clubRequestsData, isLoading: isLoadingRequests, error: requestsError } = useQuery({
    queryKey: ['clubRequests', page, filters, limit],
    queryFn: () =>
      clubService.getClubRequests(
        page,
        limit,
        filters.status !== 'all' ? filters.status : undefined
      ),
    enabled: false,
  });

  const { data: memberRequestsData, isLoading: isLoadingMembers, error: membersError } = useQuery({
    queryKey: ['memberRequests', page, filters, limit],
    queryFn: () =>
      clubService.getMemberRequests(
        page,
        limit,
        filters.status !== 'all' ? filters.status : undefined
      ),
    enabled: false,
  });

  const fetchDataForTab = async (tab: string) => {
    try {
      if (tab === 'requests') {
        const result = await queryClient.fetchQuery({
          queryKey: ['clubRequests', page, filters, limit],
          queryFn: () =>
            clubService.getClubRequests(
              page,
              limit,
              filters.status !== 'all' ? filters.status : undefined
            ),
          staleTime: 0,
        });
      } else if (tab === 'members') {
        const result = await queryClient.fetchQuery({
          queryKey: ['memberRequests', page, filters, limit],
          queryFn: () =>
            clubService.getMemberRequests(
              page,
              limit,
              filters.status !== 'all' ? filters.status : undefined
            ),
          staleTime: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching data for tab:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'requests' || tab === 'members') {
      fetchDataForTab(tab);
    }
  };

  const { mutateAsync: createClub } = useMutation({
    mutationFn: (data: Omit<Club, 'id' | 'members'>) => clubService.createClub(data),
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
    mutationFn: async (id: string) => {
      console.log('Approving club request:', id);
      await clubService.approveClubRequest(id);
    },
    onSuccess: async () => {
      console.log('Club request approved, invalidating queries...');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['clubRequests'] }),
        queryClient.invalidateQueries({ queryKey: ['clubs'] })
      ]);
      console.log('Queries invalidated, refetching data...');
      await fetchDataForTab('requests');
      console.log('Data refetched');
      toast.success('Club request approved successfully');
    },
    onError: (error: any) => {
      console.error('Error approving club request:', error);
      toast.error(error.message || 'Failed to approve club request');
    },
  });

  const { mutateAsync: rejectClubRequest } = useMutation({
    mutationFn: async (id: string) => {
      console.log('Rejecting club request:', id);
      await clubService.rejectClubRequest(id);
    },
    onSuccess: async () => {
      console.log('Club request rejected, invalidating queries...');
      await queryClient.invalidateQueries({ queryKey: ['clubRequests'] });
      console.log('Queries invalidated, refetching data...');
      await fetchDataForTab('requests');
      console.log('Data refetched');
      toast.success('Club request rejected successfully');
    },
    onError: (error: any) => {
      console.error('Error rejecting club request:', error);
      toast.error(error.message || 'Failed to reject club request');
    },
  });

  const { mutateAsync: approveMemberRequest } = useMutation({
    mutationFn: async (id: string) => {
      console.log('Approving member request:', id);
      await clubService.approveMemberRequest(id);
    },
    onSuccess: async () => {
      console.log('Member request approved, invalidating queries...');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['memberRequests'] }),
        queryClient.invalidateQueries({ queryKey: ['clubs'] })
      ]);
      console.log('Queries invalidated, refetching data...');
      await fetchDataForTab('members');
      console.log('Data refetched');
      toast.success('Member request approved successfully');
    },
    onError: (error: any) => {
      console.error('Error approving member request:', error);
      toast.error(error.message || 'Failed to approve member request');
    },
  });

  const { mutateAsync: rejectMemberRequest } = useMutation({
    mutationFn: async (id: string) => {
      console.log('Rejecting member request:', id);
      await clubService.rejectMemberRequest(id);
    },
    onSuccess: async () => {
      console.log('Member request rejected, invalidating queries...');
      await queryClient.invalidateQueries({ queryKey: ['memberRequests'] });
      console.log('Queries invalidated, refetching data...');
      await fetchDataForTab('members');
      console.log('Data refetched');
      toast.success('Member request rejected successfully');
    },
    onError: (error: any) => {
      console.error('Error rejecting member request:', error);
      toast.error(error.message || 'Failed to reject member request');
    },
  });

  return {
    clubs: clubsData?.clubs || [],
    clubRequests: clubRequestsData?.clubs || [],
    memberRequests: memberRequestsData?.memberRequests || [],
    totalPages: clubsData?.totalPages || 0,
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
    fetchDataForTab,
    handleTabChange,
  };
};