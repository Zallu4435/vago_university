import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAssignmentService } from '../services/userAssignmentService';
import { SelectedFile, SortOption, FilterStatus } from '../../../../../domain/types/canvas/assignment';

export const useUserAssignments = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<SelectedFile>({});
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['userAssignments', { search: searchTerm, status: filterStatus, sortBy, page: currentPage, limit: itemsPerPage }],
    queryFn: async () => {
      const result = await userAssignmentService.getAssignments({
        search: searchTerm,
        status: filterStatus,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });
      return result.assignments;
    }
  });

  const submitAssignmentMutation = useMutation({
    mutationFn: ({ assignmentId, file }: { assignmentId: string; file: File }) => {
      return userAssignmentService.submitAssignment(assignmentId, file);
    },
    onSuccess: (variables) => {
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
    const file = selectedFile[assignmentId];
    if (!file) {
      setError('Please select a file to submit');
      return;
    }

    try {
      await submitAssignmentMutation.mutateAsync({ assignmentId, file });
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

    // Handlers for UI
    handleFileSelect,
    handleSubmit,
    getAssignmentStatus,
    getAssignmentFeedback,

    // Filter/search/sort/page state and setters
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    itemsPerPage,

    // Mutations
    isSubmitting: submitAssignmentMutation.isPending
  };
}; 