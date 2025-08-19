import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { facultyService } from '../services/faculty.service';
import { FacultyApprovalData, FacultyFilters } from '../../domain/types/management/facultyManagement';

export const useFacultyManagement = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FacultyFilters>({
    status: 'all',
    department: 'all_departments',
    dateRange: 'all',
    startDate: undefined,
    endDate: undefined,
    search: '',
  });

  const queryClient = useQueryClient();
  const limit = 10; 

  const {
    data: facultyData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['faculty', page, filters],
    queryFn: () => {
      const cleanFilters = {
        status: filters.status === 'all' ? undefined : filters.status,
        department: filters.department === 'all_departments' ? undefined : filters.department,
        dateRange: filters.dateRange === 'all' ? undefined : filters.dateRange,
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: filters.search,
      };

      return facultyService.getFaculty(
        page,
        limit,
        cleanFilters.status,
        cleanFilters.department,
        cleanFilters.dateRange,
        cleanFilters.startDate,
        cleanFilters.endDate,
        cleanFilters.search
      );
    },
    placeholderData: (previousData) => previousData,
  });

  const getFacultyDetails = async (id: string) => {
    try {
      const response = await facultyService.getFacultyDetails(id);
      return response?.faculty;
    } catch (error) {
      toast.error('Error fetching faculty details');
      throw error;
    }
  };

  const approveFaculty = useMutation({
    mutationFn: (data: { id: string; approvalData: FacultyApprovalData }) => 
      facultyService.approveFaculty(data.id, data.approvalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty request approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error approving faculty request');
    }
  });

  const rejectFaculty = useMutation({
    mutationFn: (data: { id: string; reason: string }) => 
      facultyService.rejectFaculty(data.id, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty request rejected successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error rejecting faculty request');
    }
  });

  const deleteFaculty = useMutation({
    mutationFn: (id: string) => facultyService.deleteFaculty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty request deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error deleting faculty request');
    }
  });

  const updateFacultyStatus = useMutation({
    mutationFn: (data: { id: string; status: string }) => 
      facultyService.updateFacultyStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating faculty status');
    }
  });

  const blockFaculty = useMutation({
    mutationFn: (id: string) => facultyService.blockFaculty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty block status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating faculty block status');
    }
  });

  return {
    faculty: facultyData?.faculty || [],
    totalPages: facultyData?.totalPages || 1,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    getFacultyDetails,
    approveFaculty,
    rejectFaculty,
    deleteFaculty,
    updateFacultyStatus,
    blockFaculty 
  };
};