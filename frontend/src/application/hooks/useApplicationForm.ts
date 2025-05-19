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

export const useApplicationForm = (token: string | null) => {
  const queryClient = useQueryClient();

  // Create new application
  const { mutateAsync: createApplication, isLoading: isCreating } = useMutation({
    mutationFn: async (userId: string) => {
      if (!token) throw new Error('Authentication token is missing');
      if (!userId) throw new Error('User ID is missing');
      console.log('useApplicationForm: Creating application with userId:', userId);
      return await applicationService.createApplication(userId, token);
    },
    onSuccess: (data, userId) => {
      console.log('useApplicationForm: Application created successfully', data);
      queryClient.invalidateQueries({ queryKey: ['application', userId] });
      toast.success('Application initialized');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error creating application:', error);
      toast.error(error.message || 'Failed to initialize application');
    }
  });

  // Save personal info section
  const { mutateAsync: savePersonalInfo, isLoading: isSavingPersonalInfo } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: PersonalInfo }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.savePersonalInfo(applicationId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Personal information saved');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error saving personal info:', error);
      toast.error(error.message || 'Failed to save personal information');
    }
  });

  // Save choice of study section
  const { mutateAsync: saveChoiceOfStudy, isLoading: isSavingChoiceOfStudy } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: ProgrammeChoice[] }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.saveChoiceOfStudy(applicationId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Choice of study saved');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error saving choice of study:', error);
      toast.error(error.message || 'Failed to save choice of study');
    }
  });

  // Save education section
  const { mutateAsync: saveEducation, isLoading: isSavingEducation } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: EducationData }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.saveEducation(applicationId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Education information saved');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error saving education:', error);
      toast.error(error.message || 'Failed to save education information');
    }
  });

  // Save achievements section
  const { mutateAsync: saveAchievements, isLoading: isSavingAchievements } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: AchievementSection }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.saveAchievements(applicationId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Achievements saved');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error saving achievements:', error);
      toast.error(error.message || 'Failed to save achievements');
    }
  });

  // Save other information section
  const { mutateAsync: saveOtherInfo, isLoading: isSavingOtherInfo } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: OtherInformationSection }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.saveOtherInfo(applicationId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Other information saved');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error saving other info:', error);
      toast.error(error.message || 'Failed to save other information');
    }
  });

  // Save documents section
  const { mutateAsync: saveDocuments, isLoading: isSavingDocuments } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: DocumentUploadSection }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.saveDocuments(applicationId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Documents uploaded successfully');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error saving documents:', error);
      toast.error(error.message || 'Failed to upload documents');
    }
  });

  // Save declaration section
  const { mutateAsync: saveDeclaration, isLoading: isSavingDeclaration } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: DeclarationSection }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.saveDeclaration(applicationId, data, token);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application', variables.applicationId] });
      toast.success('Declaration saved');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error saving declaration:', error);
      toast.error(error.message || 'Failed to save declaration');
    }
  });

  // Process payment
  const { mutateAsync: processPayment, isLoading: isProcessingPayment } = useMutation({
    mutationFn: async ({ applicationId, paymentDetails }: { applicationId: string, paymentDetails: any }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.processPayment(applicationId, paymentDetails, token);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Payment processed successfully!');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error processing payment:', error);
      toast.error(error.message || 'Payment processing failed');
    }
  });

  // Submit application after payment
  const { mutateAsync: submitApplication, isLoading: isSubmitting } = useMutation({
    mutationFn: async ({ applicationId, paymentId }: { applicationId: string, paymentId: string }) => {
      if (!token) throw new Error('Authentication token is missing');
      return await applicationService.submitApplication(applicationId, paymentId, token);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Application submitted successfully!');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
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
    processPayment,
    submitApplication,
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
export const useApplicationData = (userId: string | undefined, token: string | null) => {
  return useQuery({
    queryKey: ['application', userId],
    queryFn: async () => {
      if (!userId || !token) {
        console.warn('useApplicationData: Missing userId or token', { userId, token });
        throw new Error('User ID or token is missing');
      }
      console.log('useApplicationData: Fetching application for userId:', userId);
      return await applicationService.getApplicationById(userId, token);
    },
    enabled: !!userId && !!token,
    staleTime: 60000,
    retry: (failureCount, error: any) => {
      if (error?.message === 'User ID or token is missing' || error?.response?.status === 401 || error?.response?.status === 404) {
        console.warn('useApplicationData: Stopping retry due to auth or not found error', { failureCount, error });
        return false;
      }
      return failureCount < 3;
    },
    onError: (error: any) => {
      console.error('useApplicationData: Error fetching application data:', error);
      if (error?.response?.status !== 404) {
        toast.error(error.message || 'Failed to fetch application data');
      }
    }
  });
};