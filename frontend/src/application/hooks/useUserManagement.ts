// frontend/src/application/hooks/useUserManagement.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { userService } from '../services/user.service';
import { AdmissionApiResponse, AdmissionDetails } from '../../domain/types/admission';

interface Filters {
  status: string;
  program: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
}

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    program: 'all',
    dateRange: 'all',
  });
  const limit = 5;

  const { data, isLoading, error } = useQuery<AdmissionApiResponse, Error>({
    queryKey: ['admissions', page, filters, limit],
    queryFn: () =>
      userService.getAdmissions(
        page,
        limit,
        filters.status !== 'all' ? filters.status : undefined,
        filters.program !== 'all' ? filters.program : undefined,
        filters.dateRange !== 'all' ? filters.dateRange : undefined,
        filters.startDate,
        filters.endDate
      ),
    keepPreviousData: true,
  });

  const { mutateAsync: getAdmissionDetails } = useMutation({
    mutationFn: (id: string) => userService.getAdmissionDetails(id),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch admission details');
    },
  });

  const { mutateAsync: approveAdmission } = useMutation({
    mutationFn: (data: { id: string; approvalData: {
      programDetails: string;
      startDate: string;
      scholarshipInfo: string;
      additionalNotes: string;
    }}) => userService.approveAdmission(data.id, data.approvalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      toast.success('Admission approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve admission');
    },
  });

  const { mutateAsync: rejectAdmission } = useMutation({
    mutationFn: (data: { id: string; reason: string }) => 
      userService.rejectAdmission(data.id, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      toast.success('Admission rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject admission');
    },
  });

  const { mutateAsync: deleteAdmission } = useMutation({
    mutationFn: (id: string) => userService.deleteAdmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      toast.success('Admission deleted');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete admission');
    },
  });

  return {
    users: data?.admissions || [],
    totalPages: data?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    getAdmissionDetails,
    approveAdmission,
    rejectAdmission,
    deleteAdmission,
  };
};