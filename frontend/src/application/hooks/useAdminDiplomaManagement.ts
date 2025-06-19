import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Diploma, Enrollment } from '../../domain/types/diploma';
import { diplomaBackendService } from '../../application/services/diplomaBackend.service';

interface Filters {
  category: string;
  status: string;
}

export const useAdminDiplomaManagement = () => {
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

  // Diplomas Query
  const {
    data: diplomasData,
    isLoading: isLoadingDiplomas,
    error: diplomasError,
  } = useQuery<{ diplomas: Diploma[]; totalPages: number }, Error>({
    queryKey: ['diplomas', page, filters, limit],
    queryFn: async () => {
      const result = await diplomaBackendService.getDiplomas(
        page,
        limit,
        filters.category !== 'All Categories' ? filters.category : undefined,
        filters.status !== 'All' ? filters.status.toLowerCase() === 'active' : undefined
      );
      // Add videoCount for convenience
      const diplomas = result.diplomas.map((d) => ({
        ...d,
        videoCount: d.videoIds.length,
      }));
      return { diplomas, totalPages: result.totalPages };
    },
    enabled: activeTab === 'diplomas',
  });

  // Enrollments Query
  const {
    data: enrollmentsData,
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
  } = useQuery<{ enrollments: Enrollment[]; totalPages: number }, Error>({
    queryKey: ['diploma-enrollments', page, filters, limit],
    queryFn: () =>
      diplomaBackendService.getEnrollments(
        page,
        limit,
        filters.category !== 'All Categories' ? filters.category : undefined,
        filters.status !== 'All' ? filters.status : undefined
      ),
    enabled: activeTab === 'enrollments',
  });

  // Diploma Details Query
  const { data: diplomaDetails, isLoading: isLoadingDiplomaDetails } = useQuery<
    Diploma & { enrolledStudents: Enrollment[] },
    Error
  >({
    queryKey: ['diploma-details', selectedDiplomaId],
    queryFn: () => diplomaBackendService.getDiplomaDetails(selectedDiplomaId!),
    enabled: !!selectedDiplomaId,
  });

  // Enrollment Details Query
  const { data: enrollmentDetails, isLoading: isLoadingEnrollmentDetails } = useQuery<
    Enrollment,
    Error
  >({
    queryKey: ['enrollment-details', selectedEnrollmentId],
    queryFn: () => diplomaBackendService.getEnrollmentDetails(selectedEnrollmentId!),
    enabled: !!selectedEnrollmentId,
  });

  // Mutations
  const { mutateAsync: createDiploma } = useMutation({
    mutationFn: (data: Omit<Diploma, '_id' | 'createdAt' | 'updatedAt'>) =>
      diplomaBackendService.createDiploma(data),
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
      diplomaBackendService.updateDiploma(id, data),
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
    mutationFn: (id: string) => diplomaBackendService.deleteDiploma(id),
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
    mutationFn: (requestId: string) => diplomaBackendService.approveEnrollment(requestId),
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
      diplomaBackendService.rejectEnrollment(requestId, reason),
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
    mutationFn: (requestId: string) => diplomaBackendService.resetProgress(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diploma-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-details'] });
      toast.success('Progress reset successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset progress');
    },
  });

  // Handlers
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