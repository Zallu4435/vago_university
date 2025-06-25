import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../services/assignmentService';
import { Assignment, NewAssignment, Submission } from '../types';

export const useAssignmentManagement = () => {
    const queryClient = useQueryClient();
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [showAnalytics, setShowAnalytics] = useState(false);

    // Queries
    const { data: assignments, isLoading: isLoadingAssignments, error: assignmentsError } = useQuery({
        queryKey: ['assignments'],
        queryFn: assignmentService.getAssignments
    });

    const { data: submissions, isLoading: isLoadingSubmissions } = useQuery({
        queryKey: ['submissions', selectedAssignment?._id],
        queryFn: () => selectedAssignment ? assignmentService.getSubmissions(selectedAssignment._id) : Promise.resolve([]),
        enabled: !!selectedAssignment
    });

    const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
        queryKey: ['analytics', selectedAssignment?._id],
        queryFn: () => selectedAssignment
            ? assignmentService.getAssignmentAnalytics(selectedAssignment._id)
            : assignmentService.getAllAnalytics(),
        enabled: showAnalytics
    });

    // Mutations
    const createAssignmentMutation = useMutation({
        mutationFn: assignmentService.createAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
        }
    });

    const updateAssignmentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Assignment> }) =>
            assignmentService.updateAssignment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
        }
    });

    const deleteAssignmentMutation = useMutation({
        mutationFn: (id: string) => assignmentService.deleteAssignment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
        }
    });

    const reviewSubmissionMutation = useMutation({
        mutationFn: ({ assignmentId, submissionId, reviewData }: {
            assignmentId: string;
            submissionId: string;
            reviewData: {
                marks: number;
                feedback: string;
                status: 'reviewed' | 'pending' | 'needs_correction';
                isLate: boolean;
            };
        }) => assignmentService.reviewSubmission(assignmentId, submissionId, reviewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        }
    });

    // Handlers
    const handleCreateAssignment = useCallback(async (data: NewAssignment) => {
        try {
            await createAssignmentMutation.mutateAsync(data);
            return { success: true };
        } catch (error) {
            console.error('Error creating assignment:', error);
            return { success: false, error: 'Failed to create assignment' };
        }
    }, [createAssignmentMutation]);

    const handleUpdateAssignment = useCallback(async (id: string, data: Partial<Assignment>) => {
        try {
            await updateAssignmentMutation.mutateAsync({ id, data });
            return { success: true };
        } catch (error) {
            console.error('Error updating assignment:', error);
            return { success: false, error: 'Failed to update assignment' };
        }
    }, [updateAssignmentMutation]);

    const handleDeleteAssignment = useCallback(async (id: string) => {
        try {
            await deleteAssignmentMutation.mutateAsync(id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting assignment:', error);
            return { success: false, error: 'Failed to delete assignment' };
        }
    }, [deleteAssignmentMutation]);

    const handleReviewSubmission = useCallback(async (assignmentId: string, submissionId: string, reviewData: { marks: number; feedback: string; status: 'reviewed' | 'pending' | 'needs_correction'; isLate: boolean }) => {
        try {
            await reviewSubmissionMutation.mutateAsync({ assignmentId, submissionId, reviewData });
            return { success: true };
        } catch (error) {
            console.error('Error reviewing submission:', error);
            return { success: false, error: 'Failed to review submission' };
        }
    }, [reviewSubmissionMutation]);

    const handleDownloadSubmission = useCallback((assignmentId: string, submissionId: string) => {
        // Open the backend download route directly in a new tab/window
        window.open(`/api/assignments/${assignmentId}/submissions/${submissionId}/download`, '_blank');
        return { success: true };
    }, []);

    return {
        // State
        assignments: assignments?.assignments || [],
        submissions: submissions?.submissions || [],
        analytics,
        selectedAssignment,
        selectedSubmission,
        showAnalytics,
        isLoading: isLoadingAssignments || isLoadingSubmissions || (showAnalytics && isLoadingAnalytics),
        error: assignmentsError,

        // Setters
        setSelectedAssignment,
        setSelectedSubmission,
        setShowAnalytics,

        // Handlers
        handleCreateAssignment,
        handleUpdateAssignment,
        handleDeleteAssignment,
        handleReviewSubmission,
        handleDownloadSubmission,

        // Mutations state
        isCreating: createAssignmentMutation.isPending,
        isUpdating: updateAssignmentMutation.isPending,
        isDeleting: deleteAssignmentMutation.isPending,
        isReviewing: reviewSubmissionMutation.isPending
    };
}; 