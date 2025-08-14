import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  [key: string]: any;
}

export function isAxiosErrorWithApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (error as AxiosError).isAxiosError !== undefined;
}
