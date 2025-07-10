import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { diplomaBackendService } from '../services/diplomaBackend.service';
import { toast } from 'react-hot-toast';

interface Video {
  id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: "Published" | "Draft";
  diplomaId: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
  diploma?: {
    id: string;
    title: string;
    category: string;
  };
}

interface Diploma {
  _id: string;
  title: string;
  category: string;
  videoIds: string[];
}

export const useVideoManagement = (page: number, itemsPerPage: number, filters: { status: string; category: string }, activeTab: string) => {
  const queryClient = useQueryClient();

  // Fetch diplomas
  const { data: diplomasData, isLoading: isLoadingDiplomas } = useQuery<{ diplomas: Diploma[] }, Error>({
    queryKey: ['diplomas'],
    queryFn: async () => {
      const { diplomas } = await diplomaBackendService.getDiplomas(1, 100);
      return { diplomas };
    },
  });

  // Fetch videos
  const { data: videosData, isLoading: isLoadingVideos } = useQuery<{ videos: Video[]; totalPages: number }, Error>({
    queryKey: ['videos', page, filters, activeTab],
    queryFn: () => diplomaBackendService.getVideos(filters.category || '', page, itemsPerPage, activeTab === 'all' ? undefined : activeTab),
  });

  // Fetch single video by ID - memoized to prevent infinite re-renders
  const fetchVideoById = useCallback(async (videoId: string): Promise<Video> => {
    try {
      const video = await diplomaBackendService.getVideoById(videoId);
      return video;
    } catch (error) {
      console.error('Error fetching video by ID:', error);
      throw error;
    }
  }, []);

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: ({ category, videoData }: { category: string; videoData: FormData }) =>
      diplomaBackendService.createVideo(category, videoData),
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
    mutationFn: ({ videoId, videoData }: { videoId: string; videoData: Partial<Video> | FormData }) =>
      diplomaBackendService.updateVideo(videoId, videoData),
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
    mutationFn: (videoId: string) => diplomaBackendService.deleteVideo(videoId),
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
        // Check if this is an update (has videoId) or create
        const videoId = videoData.get('videoId') || videoData.get('id');
        
        if (videoId) {
          // This is an update with FormData (has new file)
          console.log('Updating video with new file:', videoId);
          await updateVideoMutation.mutateAsync({ 
            videoId: videoId.toString(), 
            videoData 
          });
        } else {
          // This is a new video creation
          const category = videoData.get('category');
          if (!category) {
            throw new Error('Please select a category for the new video');
          }
          await createVideoMutation.mutateAsync({ 
            category: category.toString(), 
            videoData 
          });
        }
      } else {
        // This is an update without new file (plain object)
        if (!videoData.id) {
          throw new Error('Video ID is required for updates');
        }
        console.log('Updating video without new file:', videoData.id);
        await updateVideoMutation.mutateAsync({ 
          videoId: videoData.id, 
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
    deleteVideoMutation.mutate(video.id);
  };

  return {
    diplomasData,
    videosData,
    isLoadingDiplomas,
    isLoadingVideos,
    handleSaveVideo,
    handleDeleteVideo,
    fetchVideoById,
    isCreating: createVideoMutation.isPending,
    isUpdating: updateVideoMutation.isPending,
    isDeleting: deleteVideoMutation.isPending,
  };
}; 