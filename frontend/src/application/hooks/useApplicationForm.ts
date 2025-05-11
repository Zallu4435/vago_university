import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { applicationService } from '../services/applicationService';
import { 
  FormData, 
  PersonalInfo, 
  ProgrammeChoice, 
  EducationData, 
  AchievementSection,
  OtherInformationSection,
  DocumentUploadSection,
  DeclarationSection
} from '../../domain/types/formTypes';

export const useApplicationForm = () => {
  const queryClient = useQueryClient();

  // Create new application
  const { mutateAsync: createApplication, isLoading: isCreating } = useMutation({
    mutationFn: async (applicationId: string) => {
      return await applicationService.createApplication(applicationId);
    },
    onSuccess: (_, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      toast.success('Application initialized');
    },
    onError: () => {
      toast.error('Failed to initialize application');
    }
  });

  // Save personal info section
  const { mutateAsync: savePersonalInfo, isLoading: isSavingPersonalInfo } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: PersonalInfo }) => {
      return await applicationService.savePersonalInfo(applicationId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Personal information saved');
    },
    onError: () => {
      toast.error('Failed to save personal information');
    }
  });

  // Save choice of study section
  const { mutateAsync: saveChoiceOfStudy, isLoading: isSavingChoiceOfStudy } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: ProgrammeChoice[] }) => {
      return await applicationService.saveChoiceOfStudy(applicationId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Choice of study saved');
    },
    onError: () => {
      toast.error('Failed to save choice of study');
    }
  });

  // Save education section
  const { mutateAsync: saveEducation, isLoading: isSavingEducation } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: EducationData }) => {
      return await applicationService.saveEducation(applicationId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Education information saved');
    },
    onError: () => {
      toast.error('Failed to save education information');
    }
  });

  // Save achievements section
  const { mutateAsync: saveAchievements, isLoading: isSavingAchievements } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: AchievementSection }) => {
      return await applicationService.saveAchievements(applicationId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Achievements saved');
    },
    onError: () => {
      toast.error('Failed to save achievements');
    }
  });

  // Save other information section
  const { mutateAsync: saveOtherInfo, isLoading: isSavingOtherInfo } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: OtherInformationSection }) => {
      return await applicationService.saveOtherInfo(applicationId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Other information saved');
    },
    onError: () => {
      toast.error('Failed to save other information');
    }
  });

  // Save documents section
  const { mutateAsync: saveDocuments, isLoading: isSavingDocuments } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: DocumentUploadSection }) => {
      return await applicationService.saveDocuments(applicationId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Documents uploaded successfully');
    },
    onError: () => {
      toast.error('Failed to upload documents');
    }
  });

  // Save declaration section
  const { mutateAsync: saveDeclaration, isLoading: isSavingDeclaration } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: DeclarationSection }) => {
      return await applicationService.saveDeclaration(applicationId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Declaration saved');
    },
    onError: () => {
      toast.error('Failed to save declaration');
    }
  });

  // Submit full application for payment
  const { mutateAsync: submitApplication, isLoading: isSubmitting } = useMutation({
    mutationFn: async (applicationId: string) => {
      return await applicationService.submitApplication(applicationId);
    },
    onSuccess: (data) => {
      toast.success('Application submitted successfully!');
      return data;
    },
    onError: () => {
      toast.error('Failed to submit application');
    }
  });

  // Process payment
  const { mutateAsync: processPayment, isLoading: isProcessingPayment } = useMutation({
    mutationFn: async ({ applicationId, paymentDetails }: { applicationId: string, paymentDetails: any }) => {
      return await applicationService.processPayment(applicationId, paymentDetails);
    },
    onSuccess: () => {
      toast.success('Payment processed successfully!');
    },
    onError: () => {
      toast.error('Payment processing failed');
    }
  });

  return {
    createApplication,
    savePersonalInfo,
    saveChoiceOfStudy,
    saveEducation,
    saveAchievements,
    saveOtherInfo,
    saveDocuments,
    saveDeclaration,
    submitApplication,
    processPayment,
    isLoading: 
      isCreating ||
      isSavingPersonalInfo || 
      isSavingChoiceOfStudy || 
      isSavingEducation || 
      isSavingAchievements || 
      isSavingOtherInfo || 
      isSavingDocuments || 
      isSavingDeclaration || 
      isSubmitting || 
      isProcessingPayment
  };
};

// Hook to get application data with caching
export const useApplicationData = (applicationId: string | undefined) => {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationId ? applicationService.getApplicationById(applicationId) : null,
    enabled: !!applicationId,
    staleTime: 60000,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) return false;
      return failureCount < 3;
    },
    onError: (error: any) => {
      if (error?.response?.status !== 404) {
        toast.error('Failed to fetch application data');
      }
    }
  });
};