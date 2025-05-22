import httpClient from '../../frameworks/api/httpClient';
import { ProfileData, PasswordChangeData } from '../../domain/types/profile';

class ProfileService {
  // Update user profile information
  async updateProfile(data: ProfileData): Promise<void> {
    try {
      await httpClient.put('/user/profile', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  // Change user password
  async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      await httpClient.post('/user/password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  }

  // Upload profile picture and return the URL
  async updateProfilePicture(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const response = await httpClient.post<{ url: string }>('/user/profile-picture', formData);
      return response.data.url;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile picture');
    }
  }

  // Fetch user profile data
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await httpClient.get<ProfileData>('/user/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile data');
    }
  }
}

export const profileService = new ProfileService();