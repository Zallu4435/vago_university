export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
} 

export interface RegisterResponse {
  message: string;
  user: User;
}

// domain/types/user.ts (extend if needed)
export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., 'admin', 'student'
}

export interface UserApiResponse {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}