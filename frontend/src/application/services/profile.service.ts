import httpClient from '../../frameworks/api/httpClient';
import { ProfileData, PasswordChangeData } from '../../domain/types/profile';

class ProfileService {
  async updateProfile(data: ProfileData): Promise<void> {
    try {
      await httpClient.put('/profile', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  async changePassword(data: PasswordChangeData): Promise<void> {
    try {
      await httpClient.post('/profile/password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  }

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

  async getProfile(): Promise<ProfileData> {
    try {
      const response = await httpClient.get<{ data: ProfileData }>('/profile');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch profile data');
    }
  }
}

export const profileService = new ProfileService();