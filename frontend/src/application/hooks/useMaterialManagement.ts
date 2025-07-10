import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialService } from '../services/materialService';
import { Material } from '../../domain/types/materialmanagement';
import { toast } from 'react-hot-toast';

export const useMaterialManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    subject: 'All Subjects',
    course: 'All Courses',
    semester: 'All Semesters',
    type: 'All Types',
    uploadedBy: 'All Uploaders',
  });
  const [activeTab, setActiveTab] = useState<'all' | 'restricted'>('all');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  const { data: materialsData, isLoading, error } = useQuery<{ materials: Material[]; totalPages: number }, Error>({
    queryKey: ['materials', page, filters, activeTab],
    queryFn: () => materialService.getMaterials(filters, page, 10),
    select: (data) => ({
      materials: activeTab === 'restricted' ? data.materials.filter((m) => m.isRestricted) : data.materials,
      totalPages: data.totalPages,
    }),
  });

  const createMaterialMutation = useMutation({
    mutationFn: (data: Omit<Material, '_id' | 'uploadedAt' | 'views' | 'downloads' | 'rating'>) =>
      materialService.createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create material');
    },
  });

  const updateMaterialMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Material> }) =>
      materialService.updateMaterial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update material');
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: (id: string) => materialService.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete material');
    },
  });

  const toggleRestrictionMutation = useMutation({
    mutationFn: ({ id, isRestricted }: { id: string; isRestricted: boolean }) =>
      materialService.toggleRestriction(id, isRestricted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success('Material restriction updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update restriction');
    },
  });

  const { data: materialDetails, isLoading: isLoadingMaterialDetails } = useQuery<Material, Error>({
    queryKey: ['materialDetails', selectedMaterialId],
    queryFn: () => materialService.getMaterialById(selectedMaterialId || ''),
    enabled: !!selectedMaterialId,
  });

  const handleViewMaterial = (id: string) => {
    setSelectedMaterialId(id);
  };

  const handleEditMaterial = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['materialDetails', id],
      queryFn: () => materialService.getMaterialById(id),
    });
  };

  const handleTabChange = (tab: 'all' | 'restricted') => {
    setActiveTab(tab);
    setPage(1);
  };

  return {
    materials: materialsData?.materials || [],
    totalPages: Number(materialsData?.totalPages) || 1,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createMaterial: createMaterialMutation.mutate,
    updateMaterial: updateMaterialMutation.mutate,
    deleteMaterial: deleteMaterialMutation.mutate,
    toggleRestrictionMaterial: toggleRestrictionMutation.mutate,
    materialDetails,
    isLoadingMaterialDetails,
    handleViewMaterial,
    handleEditMaterial,
    activeTab,
    handleTabChange,
  };
};