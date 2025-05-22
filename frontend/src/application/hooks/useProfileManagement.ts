import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { profileService } from '../services/profile.service';
import { ProfileData, PasswordChangeData } from '../../domain/types/profile';

export const useProfileManagement = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch profile data with controlled refetching
  const { data: profile, isLoading, error } = useQuery<ProfileData, Error>({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch profile data');
    },
  });

  // Update profile mutation
  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: (data: ProfileData) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  // Change password mutation
  const { mutateAsync: changePassword } = useMutation({
    mutationFn: (data: PasswordChangeData) => profileService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });

  // Update profile picture mutation
  const { mutateAsync: updateProfilePicture } = useMutation({
    mutationFn: (file: File) => profileService.updateProfilePicture(file),
    onSuccess: (url: string) => {
      queryClient.setQueryData(['profile'], (oldData: ProfileData | undefined) =>
        oldData ? { ...oldData, profilePicture: url } : oldData
      );
      toast.success('Profile picture updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile picture');
    },
  });

  return {
    profile,
    isLoading,
    error,
    isEditing,
    setIsEditing,
    updateProfile,
    changePassword,
    updateProfilePicture,
  };
};