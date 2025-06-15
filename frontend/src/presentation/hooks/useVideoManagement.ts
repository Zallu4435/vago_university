import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { diplomaService } from '../../application/services/diploma.service';
import { toast } from 'react-hot-toast';

interface Video {
  _id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: "Published" | "Draft";
  diplomaId: string;
  description: string;
}

interface Diploma {
  _id: string;
  title: string;
  videoIds: string[];
}

export const useVideoManagement = (page: number, itemsPerPage: number, filters: { status: string; category: string }, activeTab: string) => {
  const queryClient = useQueryClient();

  // Fetch diplomas
  const { data: diplomasData, isLoading: isLoadingDiplomas } = useQuery<{ diplomas: Diploma[] }, Error>({
    queryKey: ['diplomas'],
    queryFn: async () => {
      const { diplomas } = await diplomaService.getDiplomas(1, 100);
      return { diplomas };
    },
  });

  // Fetch videos
  const { data: videosData, isLoading: isLoadingVideos } = useQuery<{ videos: Video[]; totalPages: number }, Error>({
    queryKey: ['videos', page, filters, activeTab],
    queryFn: () => diplomaService.getVideos(filters.category || '', page, itemsPerPage, activeTab === 'all' ? undefined : activeTab),
  });

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: ({ category, videoData }: { category: string; videoData: FormData }) =>
      diplomaService.createVideo(category, videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['diplomas'] });
      toast.success('Video created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create video');
    },
  });

  // Update video mutation
  const updateVideoMutation = useMutation({
    mutationFn: ({ videoId, videoData }: { videoId: string; videoData: Partial<Video> }) =>
      diplomaService.updateVideo(videoId, videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast.success('Video updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update video');
    },
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => diplomaService.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['diplomas'] });
      toast.success('Video deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete video');
    },
  });

  // Handle video save (create or update)
  const handleSaveVideo = async (videoData: FormData | Partial<Video>): Promise<void> => {
    try {
      if (videoData instanceof FormData) {
        // For new video creation
        const category = videoData.get('category');
        if (!category) {
          throw new Error('Please select a category for the new video');
        }
        await createVideoMutation.mutateAsync({ 
          category: category.toString(), 
          videoData 
        });
      } else {
        // For video updates
        if (!videoData._id) {
          throw new Error('Video ID is required for updates');
        }
        await updateVideoMutation.mutateAsync({ 
          videoId: videoData._id, 
          videoData 
        });
      }
    } catch (error) {
      console.error('Error saving video:', error);
      throw error;
    }
  };

  // Handle video delete
  const handleDeleteVideo = (video: Video) => {
    deleteVideoMutation.mutate(video._id);
  };

  return {
    diplomasData,
    videosData,
    isLoadingDiplomas,
    isLoadingVideos,
    handleSaveVideo,
    handleDeleteVideo,
    isCreating: createVideoMutation.isPending,
    isUpdating: updateVideoMutation.isPending,
    isDeleting: deleteVideoMutation.isPending,
  };
}; 