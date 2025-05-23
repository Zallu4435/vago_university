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
        filters.category !== 'all' ? filters.category : undefined,
        filters.status !== 'all' ? filters.status : undefined
      ),
    keepPreviousData: true,
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
    keepPreviousData: true,
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
    keepPreviousData: true,
  });

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
    memberRequests: memberRequestsData?.clubs || [],
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
  };
};