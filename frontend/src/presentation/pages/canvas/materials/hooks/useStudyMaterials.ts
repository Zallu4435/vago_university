import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userMaterialService } from '../services/userMaterialService';
import { Material } from '../types/MaterialTypes';

interface GetMaterialsFilters {
  subject?: string;
  course?: string;
  semester?: string;
  type?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useStudyMaterials = (filters: GetMaterialsFilters = {}) => {
  const queryClient = useQueryClient();

  const { data: materialsData, isLoading: isLoadingMaterials, error: materialsError } = useQuery({
    queryKey: ['materials', filters],
    queryFn: async () => {
      console.log('Fetching materials with filters:', filters);
      try {
        const response = await userMaterialService.getMaterials(filters);
        console.log('Materials response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching materials:', error);
        throw error;
      }
    },
  });

  const { data: bookmarkedMaterials, isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ['bookmarkedMaterials'],
    queryFn: async () => {
      const response = await userMaterialService.getBookmarkedMaterials();
      return response;
    },
  });

  const { data: likedMaterials, isLoading: isLoadingLikes } = useQuery({
    queryKey: ['likedMaterials'],
    queryFn: async () => {
      const response = await userMaterialService.getLikedMaterials();
      return response;
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const response = await userMaterialService.toggleBookmark(materialId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const response = await userMaterialService.toggleLike(materialId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likedMaterials'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (materialId: string) => {
      const response = await userMaterialService.downloadMaterial(materialId);
      return response;
    },
  });

  return {
    materials: materialsData?.materials || [],
    totalPages: materialsData?.totalPages || 0,
    isLoading: isLoadingMaterials || isLoadingBookmarks || isLoadingLikes,
    error: materialsError,
    bookmarkedMaterials: bookmarkedMaterials?.materials || [],
    likedMaterials: likedMaterials?.materials || [],
    getMaterials: () => queryClient.invalidateQueries({ queryKey: ['materials'] }),
    downloadMaterial: (materialId: string) => downloadMutation.mutate(materialId),
    toggleBookmark: (materialId: string) => bookmarkMutation.mutate(materialId),
    toggleLike: (materialId: string) => likeMutation.mutate(materialId),
    isDownloading: downloadMutation.isPending,
  };
}; 