import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  code?: string;
  details?: unknown;
  statusCode?: number;
  [key: string]: string | number | boolean | unknown | undefined;
}

export function isAxiosErrorWithApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (error as AxiosError).isAxiosError !== undefined;
}
