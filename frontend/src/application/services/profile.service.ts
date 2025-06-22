import httpClient from '../../frameworks/api/httpClient';
import { ProfileData, PasswordChangeData } from '../../domain/types/profile';

class ProfileService {
  // Update profile information - automatically uses correct endpoint based on auth context
  async updateProfile(data: ProfileData): Promise<void> {
    try {
      await httpClient.put('/profile', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  // Change password - automatically uses correct endpoint based on auth context
  async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      await httpClient.post('/profile/password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  }

  // Upload profile picture and return the URL - automatically uses correct endpoint based on auth context
  async updateProfilePicture(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await httpClient.post<{ url: string }>('/profile/profile-picture', formData);
      return response.data.url;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile picture');
    }
  }

  // Fetch profile data - automatically uses correct endpoint based on auth context
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await httpClient.get<ProfileData>('/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile data');
    }
  }
}

export const profileService = new ProfileService();