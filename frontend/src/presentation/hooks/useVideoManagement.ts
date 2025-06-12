import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { diplomaService } from '../../application/services/diploma.service';
import { toast } from 'react-hot-toast';

interface Video {
  _id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: string;
  diplomaId: string;
  description: string;
}

interface Diploma {
  _id: string;
  title: string;
  videoCount: number;
}

export const useVideoManagement = (page: number, itemsPerPage: number, filters: { status: string; diploma: string }, activeTab: string) => {
  const queryClient = useQueryClient();

  // Fetch diplomas
  const { data: diplomasData, isLoading: isLoadingDiplomas } = useQuery<{ diplomas: Diploma[] }, Error>({
    queryKey: ['diplomas'],
    queryFn: async () => {
      const { diplomas } = await diplomaService.getDiplomas(1, 100);
      return { diplomas: diplomas.map(d => ({ _id: d._id, title: d.title, videoCount: d.videoIds.length })) };
    },
  });

  // Fetch videos
  const { data: videosData, isLoading: isLoadingVideos } = useQuery<{ videos: Video[]; totalPages: number }, Error>({
    queryKey: ['videos', page, filters, activeTab],
    queryFn: () => diplomaService.getVideos(filters.diploma || '', page, itemsPerPage, activeTab === 'all' ? undefined : activeTab),
  });

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: ({ diplomaId, videoData }: { diplomaId: string; videoData: Omit<Video, '_id' | 'uploadedAt'> }) =>
      diplomaService.createVideo(diplomaId, videoData),
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
    mutationFn: ({ diplomaId, videoId }: { diplomaId: string; videoId: string }) =>
      diplomaService.deleteVideo(diplomaId, videoId),
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
  const handleSaveVideo = (videoData: Partial<Video>, diplomaId: string, selectedVideo: Video | null) => {
    if (!diplomaId) {
      toast.error('Please select a diploma first');
      return;
    }

    const data = {
      title: videoData.title || '',
      duration: videoData.duration || '',
      module: videoData.module || 1,
      status: videoData.status || 'Draft',
      description: videoData.description || '',
      diplomaId: diplomaId,
    };

    if (selectedVideo) {
      updateVideoMutation.mutate({ videoId: selectedVideo._id, videoData: data });
    } else {
      createVideoMutation.mutate({ diplomaId, videoData: data });
    }
  };

  // Handle video delete
  const handleDeleteVideo = (video: Video, diplomaId: string) => {
    if (diplomaId) {
      deleteVideoMutation.mutate({ diplomaId, videoId: video._id });
    }
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