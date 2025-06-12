import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { diplomaService } from '../services/diploma.service';
import { Diploma, Enrollment } from '../../domain/types/diploma';

interface Filters {
  category: string;
  status: string;
}

export const useDiplomaManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [selectedDiplomaId, setSelectedDiplomaId] = useState<string | null>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    category: 'All Categories',
    status: 'All',
  });
  const [activeTab, setActiveTab] = useState<'diplomas' | 'enrollments'>('diplomas');
  const limit = 10;

  const {
    data: diplomasData,
    isLoading: isLoadingDiplomas,
    error: diplomasError,
  } = useQuery<{ diplomas: Diploma[]; totalPages: number }, Error>({
    queryKey: ['diplomas', page, filters, limit],
    queryFn: async () => {
      const result = await diplomaService.getDiplomas(
        page,
        limit,
        filters.category !== 'All Categories' ? filters.category : undefined,
        filters.status !== 'All' ? filters.status.toLowerCase() === 'active' : undefined
      );
      // Map diplomas to include videoCount
      const diplomas = result.diplomas.map((d) => ({
        ...d,
        videoCount: d.videoIds.length,
      }));
      return { diplomas, totalPages: result.totalPages };
    },
    enabled: activeTab === 'diplomas',
  });

  const {
    data: enrollmentsData,
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
  } = useQuery<{ enrollments: Enrollment[]; totalPages: number }, Error>({
    queryKey: ['diploma-enrollments', page, filters, limit],
    queryFn: () =>
      diplomaService.getEnrollments(
        page,
        limit,
        filters.category !== 'All Categories' ? filters.category : undefined,
        filters.status !== 'All' ? filters.status : undefined
      ),
    enabled: activeTab === 'enrollments',
  });

  const { data: diplomaDetails, isLoading: isLoadingDiplomaDetails } = useQuery<
    Diploma & { enrolledStudents: Enrollment[] },
    Error
  >({
    queryKey: ['diploma-details', selectedDiplomaId],
    queryFn: () => diplomaService.getDiplomaDetails(selectedDiplomaId!),
    enabled: !!selectedDiplomaId,
  });

  const { data: enrollmentDetails, isLoading: isLoadingEnrollmentDetails } = useQuery<
    Enrollment,
    Error
  >({
    queryKey: ['enrollment-details', selectedEnrollmentId],
    queryFn: () => diplomaService.getEnrollmentDetails(selectedEnrollmentId!),
    enabled: !!selectedEnrollmentId,
  });

  const { mutateAsync: createDiploma } = useMutation({
    mutationFn: (data: Omit<Diploma, '_id' | 'createdAt' | 'updatedAt'>) =>
      diplomaService.createDiploma(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diplomas'] });
      toast.success('Diploma created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create diploma');
    },
  });

  const { mutateAsync: updateDiploma } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Diploma> }) =>
      diplomaService.updateDiploma(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diplomas'] });
      queryClient.invalidateQueries({ queryKey: ['diploma-details'] });
      toast.success('Diploma updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update diploma');
    },
  });

  const { mutateAsync: deleteDiploma } = useMutation({
    mutationFn: (id: string) => diplomaService.deleteDiploma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diplomas'] });
      queryClient.invalidateQueries({ queryKey: ['diploma-enrollments'] });
      toast.success('Diploma deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete diploma');
    },
  });

  const { mutateAsync: approveEnrollment } = useMutation({
    mutationFn: (requestId: string) => diplomaService.approveEnrollment(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diploma-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-details'] });
      toast.success('Enrollment approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve enrollment');
    },
  });

  const { mutateAsync: rejectEnrollment } = useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) =>
      diplomaService.rejectEnrollment(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diploma-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-details'] });
      toast.success('Enrollment rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject enrollment');
    },
  });

  const { mutateAsync: resetProgress } = useMutation({
    mutationFn: (requestId: string) => diplomaService.resetProgress(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diploma-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-details'] });
      toast.success('Progress reset successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset progress');
    },
  });

  const handleTabChange = (tab: 'diplomas' | 'enrollments') => {
    setActiveTab(tab);
    setPage(1);
    setFilters({
      category: 'All Categories',
      status: 'All',
    });
    queryClient.invalidateQueries({
      queryKey: tab === 'diplomas' ? ['diplomas'] : ['diploma-enrollments'],
    });
  };

  const handleViewDiploma = (diplomaId: string) => {
    setSelectedDiplomaId(diplomaId);
  };

  const handleEditDiploma = (diplomaId: string) => {
    setSelectedDiplomaId(diplomaId);
  };

  const handleViewEnrollment = (enrollmentId: string) => {
    setSelectedEnrollmentId(enrollmentId);
  };

  return {
    diplomas: diplomasData?.diplomas || [],
    totalPages: diplomasData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading: isLoadingDiplomas,
    error: diplomasError || enrollmentsError,
    createDiploma,
    updateDiploma,
    deleteDiploma,
    enrollments: enrollmentsData?.enrollments || [],
    enrollmentTotalPages: enrollmentsData?.totalPages || 0,
    isLoadingEnrollments,
    approveEnrollment,
    rejectEnrollment,
    resetProgress,
    diplomaDetails,
    isLoadingDiplomaDetails,
    handleViewDiploma,
    handleEditDiploma,
    enrollmentDetails,
    isLoadingEnrollmentDetails,
    handleViewEnrollment,
    activeTab,
    handleTabChange,
  };
};