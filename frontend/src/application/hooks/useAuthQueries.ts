import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../application/services/auth.service';
import { User } from '../../domain/entities/User';

interface RegisterResponse {
  message: string;
  user: User;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation<
    RegisterResponse,
    Error,
    { firstName: string; lastName: string; email: string; password: string }
  >({
    mutationFn: authService.registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, { email: string; password: string }>({
    mutationFn: authService.loginUser,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};