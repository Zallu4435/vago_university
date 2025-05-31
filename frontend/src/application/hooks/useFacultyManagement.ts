// src/application/hooks/useFacultyManagement.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService } from '../services/faculty.service';
import toast from 'react-hot-toast';
import { Faculty, FacultyApprovalData, FacultyFilters } from '../../domain/types/faculty.types';

export const useFacultyManagement = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FacultyFilters>({
    status: 'all',
    department: 'all_departments',
    dateRange: 'all',
    startDate: undefined,
    endDate: undefined
  });

  const queryClient = useQueryClient();
  const limit = 10; // Number of items per page

  // Fetch faculty list
  const {
    data: facultyData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['faculty', page, filters],
    queryFn: () => {
      // Clean up filter values before sending to API
      const cleanFilters = {
        status: filters.status === 'all' ? undefined : filters.status,
        department: filters.department === 'all_departments' ? undefined : filters.department,
        dateRange: filters.dateRange === 'all' ? undefined : filters.dateRange,
        startDate: filters.startDate,
        endDate: filters.endDate
      };

      return facultyService.getFaculty(
        page,
        limit,
        cleanFilters.status,
        cleanFilters.department,
        cleanFilters.dateRange,
        cleanFilters.startDate,
        cleanFilters.endDate
      );
    }
  });

  // Get faculty details
  const getFacultyDetails = async (id: string) => {
    try {
      const response = await facultyService.getFacultyDetails(id);
      return response;
    } catch (error) {
      toast.error('Error fetching faculty details');
      throw error;
    }
  };

  // Approve faculty mutation
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

  // Reject faculty mutation
  const rejectFaculty = useMutation({
    mutationFn: (data: { id: string; reason: string }) => 
      facultyService.rejectFaculty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty request rejected successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error rejecting faculty request');
    }
  });

  // Delete faculty mutation
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

  // Update faculty status mutation
  const updateFacultyStatus = useMutation({
    mutationFn: (data: { id: string; status: string }) => 
      facultyService.updateFacultyStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty status updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating faculty status');
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
    updateFacultyStatus
  };
};