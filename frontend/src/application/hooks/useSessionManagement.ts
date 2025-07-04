import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService, CreateVideoSessionPayload, UpdateVideoSessionPayload, Attendee } from '../services/session.service';

// Placeholder types for session, update, and delete. Adjust as needed.
export interface Session {
  id: string;
  title: string;
  hostId: string;
  startTime: string;
  endTime?: string;
  status: string;
  description?: string;
  instructor?: string;
  course?: string;
  duration?: number;
  maxAttendees?: number;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isLive?: boolean;
  hasRecording?: boolean;
  recordingUrl?: string;
  attendees?: number;
  attendeeList?: Attendee[];
}

export type { UpdateVideoSessionPayload };

export const useSessionManagement = () => {
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Fetch all sessions
  const { data: sessions, isLoading: isLoadingSessions, error: sessionsError } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionService.getSessions
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: sessionService.createVideoSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: ({ id, data }: UpdateVideoSessionPayload) => sessionService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => sessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });

  // Handlers
  const handleCreateSession = useCallback(async (data: CreateVideoSessionPayload) => {
    try {
      await createSessionMutation.mutateAsync(data);
      return { success: true };
    } catch (error) {
      console.error('Error creating session:', error);
      return { success: false, error: 'Failed to create session' };
    }
  }, [createSessionMutation]);

  const handleUpdateSession = useCallback(async (id: string, data: Partial<Session>) => {
    try {
      await updateSessionMutation.mutateAsync({ id, data });
      return { success: true };
    } catch (error) {
      console.error('Error updating session:', error);
      return { success: false, error: 'Failed to update session' };
    }
  }, [updateSessionMutation]);

  const handleDeleteSession = useCallback(async (id: string) => {
    try {
      await deleteSessionMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      console.error('Error deleting session:', error);
      return { success: false, error: 'Failed to delete session' };
    }
  }, [deleteSessionMutation]);

  return {
    sessions: sessions || [],
    isLoading: isLoadingSessions,
    error: sessionsError,
    selectedSession,
    setSelectedSession,
    handleCreateSession,
    handleUpdateSession,
    handleDeleteSession,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
  };
}; 