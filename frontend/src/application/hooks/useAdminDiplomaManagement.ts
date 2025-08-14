import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { diplomaBackendService } from '../../application/services/diplomaBackend.service';
import { Diploma } from '../../domain/types/management/diplomamanagement';

type Filters = {
  category: string;
  status: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
};

export const useAdminDiplomaManagement = (searchTerm?: string, filters?: Filters) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [selectedDiplomaId, setSelectedDiplomaId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diplomas' | 'enrollments'>('diplomas');
  const limit = 10;

  const {
    data: diplomasData,
    isLoading: isLoadingDiplomas,
    error: diplomasError,
  } = useQuery<{ diplomas: Diploma[]; totalPages: number }, Error>({
    queryKey: ['diplomas', page, filters, limit, searchTerm],
    queryFn: async () => {
      const result = await diplomaBackendService.getDiplomas({
        page,
        limit,
        category: filters?.category !== 'All Categories' ? filters?.category : undefined,
        status: filters?.status !== 'All' ? filters?.status : undefined,
        search: searchTerm && searchTerm.trim() ? searchTerm : undefined,
        dateRange: filters?.dateRange && filters?.dateRange !== 'All' ? filters?.dateRange : undefined,
        startDate: filters?.dateRange === 'custom' ? filters?.startDate : undefined,
        endDate: filters?.dateRange === 'custom' ? filters?.endDate : undefined,
      });
      const diplomas = result.diplomas.map((d) => ({
        ...d,
        videoCount: d.videoIds.length,
      }));
      return { diplomas, totalPages: result.totalPages };
    },
    enabled: activeTab === 'diplomas',
  });

  const { data: diplomaDetails, isLoading: isLoadingDiplomaDetails } = useQuery<
    Diploma,
    Error
  >({
    queryKey: ['diploma-details', selectedDiplomaId],
    queryFn: () => diplomaBackendService.getDiplomaDetails(selectedDiplomaId!),
    enabled: !!selectedDiplomaId,
  });

  const { mutateAsync: createDiploma } = useMutation({
    mutationFn: (data: Omit<Diploma, '_id' | 'createdAt' | 'updatedAt'>) =>
      diplomaBackendService.createDiploma(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diplomas'] });
      toast.success('Diploma created successfully');
    },
    onError: (error: Error) => {
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
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update diploma');
    },
  });

  const { mutateAsync: deleteDiploma } = useMutation({
    mutationFn: (id: string) => diplomaBackendService.deleteDiploma(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diplomas'] });
      toast.success('Diploma deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete diploma');
    },
  });

  const handleTabChange = (tab: 'diplomas' | 'enrollments') => {
    setActiveTab(tab);
    setPage(1);
    queryClient.invalidateQueries({
      queryKey: tab === 'diplomas' ? ['diplomas'] : [],
    });
  };

  const handleViewDiploma = (diplomaId: string) => {
    setSelectedDiplomaId(diplomaId);
  };

  const handleEditDiploma = (diplomaId: string) => {
    setSelectedDiplomaId(diplomaId);
  };

  return {
    diplomas: diplomasData?.diplomas || [],
    totalPages: diplomasData?.totalPages || 0,
    page,
    setPage,
    isLoading: isLoadingDiplomas,
    error: diplomasError,
    createDiploma,
    updateDiploma,
    deleteDiploma,
    diplomaDetails,
    isLoadingDiplomaDetails,
    handleViewDiploma,
    handleEditDiploma,
    activeTab,
    handleTabChange,
  };
}; 