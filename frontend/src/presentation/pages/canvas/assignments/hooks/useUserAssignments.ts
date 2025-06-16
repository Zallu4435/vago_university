import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAssignmentService } from '../services/userAssignmentService';
import { Assignment, SelectedFile } from '../types/AssignmentTypes';

export const useUserAssignments = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<SelectedFile>({});
  const [error, setError] = useState<string | null>(null);

  // Fetch all assignments with initial query parameters
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['userAssignments', { status: 'all', page: 1, limit: 10, subject: 'all' }],
    queryFn: async () => {
      console.log('Fetching assignments...');
      const result = await userAssignmentService.getAssignments({
        status: 'all',
        page: 1,
        limit: 10,
        subject: 'all'
      });
      console.log('Assignments fetched:', result);
      return result.assignments;
    }
  });

  // Submit assignment mutation
  const submitAssignmentMutation = useMutation({
    mutationFn: ({ assignmentId, file }: { assignmentId: string; file: File }) => {
      console.log('Mutation: Starting submission for assignment:', assignmentId);
      return userAssignmentService.submitAssignment(assignmentId, file);
    },
    onSuccess: (data, variables) => {
      console.log('Mutation: Submission successful:', data);
      queryClient.invalidateQueries({ queryKey: ['userAssignments'] });
      setSelectedFile(prev => {
        const updated = { ...prev };
        delete updated[variables.assignmentId];
        return updated;
      });
    },
    onError: (error: any) => {
      console.error('Mutation: Submission error:', error);
      setError(error.message || 'Failed to submit assignment');
    }
  });

  // Handle file selection
  const handleFileSelect = useCallback((assignmentId: string, file: File) => {
    setSelectedFile(prev => ({ ...prev, [assignmentId]: file }));
  }, []);

  // Handle assignment submission
  const handleSubmit = useCallback(async (assignmentId: string) => {
    console.log('Hook: Starting submission for assignment:', assignmentId);
    const file = selectedFile[assignmentId];
    if (!file) {
      console.log('Hook: No file selected for assignment:', assignmentId);
      setError('Please select a file to submit');
      return;
    }

    console.log('Hook: File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      console.log('Hook: Calling mutation with:', { assignmentId, file });
      await submitAssignmentMutation.mutateAsync({ assignmentId, file });
      console.log('Hook: Submission successful');
    } catch (error) {
      console.error('Hook: Submission error:', error);
    }
  }, [selectedFile, submitAssignmentMutation]);

  // Get assignment status
  const getAssignmentStatus = useCallback(async (assignmentId: string) => {
    try {
      const status = await userAssignmentService.getAssignmentStatus(assignmentId);
      return status;
    } catch (error) {
      console.error('Error fetching assignment status:', error);
      return null;
    }
  }, []);

  // Get assignment feedback
  const getAssignmentFeedback = useCallback(async (assignmentId: string) => {
    try {
      const feedback = await userAssignmentService.getAssignmentFeedback(assignmentId);
      return feedback;
    } catch (error) {
      console.error('Error fetching assignment feedback:', error);
      return null;
    }
  }, []);

  return {
    // State
    assignments: assignments || [],
    selectedFile,
    error,
    isLoading: isLoadingAssignments || submitAssignmentMutation.isPending,

    // Handlers
    handleFileSelect,
    handleSubmit,
    getAssignmentStatus,
    getAssignmentFeedback,

    // Mutations
    isSubmitting: submitAssignmentMutation.isPending
  };
}; 