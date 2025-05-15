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
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to login');
    }
  }
}

export const authService = new AuthService();