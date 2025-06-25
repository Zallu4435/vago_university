import httpClient from '../../frameworks/api/httpClient';
import { User } from '../../domain/types/userTypes';

interface RegisterResponse {
  message: string;
  user: User;
}

interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  async registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<RegisterResponse> {
    try {
      const response = await httpClient.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to register user');
    }
  }

  async loginUser(data: { email: string; password: string }): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>('/auth/login', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to login');
    }
  }

  async sendEmailOtp(email: string): Promise<{ message: string }> {
    try {
      const response = await httpClient.post('/auth/send-email-otp', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to send OTP');
    }
  }

  async verifyEmailOtp(email: string, otp: string): Promise<{ resetToken: string }> {
    try {
      const response = await httpClient.post('/auth/verify-email-otp', { email, otp });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to verify OTP');
    }
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<{ token: string; user: any; collection: string }> {
    try {
      const response = await httpClient.post('/auth/reset-password', { resetToken, newPassword });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to reset password');
    }
  }

  async confirmRegistration(token: string): Promise<{ message: string }> {
    try {
      const response = await httpClient.post('/auth/confirm-registration', { token });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to confirm registration');
    }
  }
}

export const authService = new AuthService();