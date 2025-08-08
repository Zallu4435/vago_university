import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { applicationService } from '../services/applicationService';
import {
  PersonalInfo,
  ProgrammeChoice,
  EducationData,
  AchievementSection,
  OtherInformationSection,
  DocumentUploadSection,
  DeclarationSection
} from '../../domain/types/application';

export const useApplicationForm = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createApplication, isPending: isCreating } = useMutation({
    mutationFn: async (userId: string) => {
      if (!userId) throw new Error('User ID is missing');
      return await applicationService.createApplication(userId);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['application', userId] });
      toast.success('Application initialized');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error creating application:', error);
      toast.error(error.message || 'Failed to initialize application');
    }
  });

  const { mutateAsync: savePersonalInfo, isPending: isSavingPersonalInfo } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: PersonalInfo }) => {
      return await applicationService.savePersonalInfo(applicationId, data);
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

  const { mutateAsync: saveChoiceOfStudy, isPending: isSavingChoiceOfStudy } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: ProgrammeChoice[] }) => {
      return await applicationService.saveChoiceOfStudy(applicationId, data);
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

  const { mutateAsync: saveEducation, isPending: isSavingEducation } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: EducationData }) => {
      return await applicationService.saveEducation(applicationId, data);
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

  const { mutateAsync: saveAchievements, isPending: isSavingAchievements } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: AchievementSection }) => {
      return await applicationService.saveAchievements(applicationId, data);
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

  const { mutateAsync: saveOtherInfo, isPending: isSavingOtherInfo } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: OtherInformationSection }) => {
      return await applicationService.saveOtherInfo(applicationId, data);
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

  const { mutateAsync: saveDocuments, isPending: isSavingDocuments } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: DocumentUploadSection }) => {
      return await applicationService.saveDocuments(applicationId, data);
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

  const { mutateAsync: saveDeclaration, isPending: isSavingDeclaration } = useMutation({
    mutationFn: async ({ applicationId, data }: { applicationId: string, data: DeclarationSection }) => {
      return await applicationService.saveDeclaration(applicationId, data);
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

  const { mutateAsync: processPayment, isPending: isProcessingPayment } = useMutation({
    mutationFn: async ({ applicationId, paymentDetails }: { applicationId: string, paymentDetails: any }) => {
      try {
        return await applicationService.processPayment(applicationId, paymentDetails);
      } catch (error: any) {
        if (error.message.includes('token') || error.response?.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Payment processed successfully!');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error processing payment:', error);
      toast.error(error.message || 'Payment processing failed');
    }
  });

  const { mutateAsync: submitApplication, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ applicationId, paymentId }: { applicationId: string, paymentId: string }) => {
      return await applicationService.submitApplication(applicationId, paymentId);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Application submitted successfully!');
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application');
    }
  });

  const { mutateAsync: confirmPayment, isPending: isConfirmingPayment } = useMutation({
    mutationFn: async ({ paymentId, stripePaymentIntentId }: { paymentId: string, stripePaymentIntentId: string }) => {
      return await applicationService.confirmPayment(paymentId, stripePaymentIntentId);
    },
    onSuccess: (data) => {
      console.log('Payment confirmed successfully:', data);
    },
    onError: (error: any) => {
      console.error('useApplicationForm: Error confirming payment:', error);
      toast.error(error.message || 'Failed to confirm payment');
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
    confirmPayment,
    isLoading: isCreating || isSavingPersonalInfo || isSavingChoiceOfStudy || isSavingEducation || isSavingAchievements || isSavingOtherInfo || isSavingDocuments || isSavingDeclaration || isProcessingPayment || isSubmitting || isConfirmingPayment,
  };
};

export const useApplicationData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['application', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      return await applicationService.getApplicationById(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error.message.includes('401') || error.message.includes('403')) {
        return false; // Don't retry auth errors
      }
      return failureCount < 3;
    },
  });
};