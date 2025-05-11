// application/hooks/useGetApplication.ts

import { useQuery } from '@tanstack/react-query';
import { applicationService } from '../../infrastructure/services/applicationService';

export const useGetApplication = (applicationId: string | null | undefined) => {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => {
      if (!applicationId) return null;
      return applicationService.getApplicationById(applicationId);
    },
    enabled: !!applicationId, // Only run the query if we have an applicationId
  });
};