// application/hooks/useSubmitApplication.ts

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { applicationService } from '../../infrastructure/services/applicationService';

export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: async (applicationId: string) => {
      return await applicationService.submitApplication(applicationId);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Application submitted successfully!');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
      return data;
    },
    onError: () => {
      toast.error('An error occurred while submitting your application. Please try again later.');
    }
  });
};