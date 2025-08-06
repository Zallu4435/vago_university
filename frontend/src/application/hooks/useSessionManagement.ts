import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService, CreateVideoSessionPayload, UpdateVideoSessionPayload, Attendee } from '../services/session.service';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const backendStatus = filterStatus === 'completed' ? 'Ended' : filterStatus;
  const { data: sessions, isLoading: isLoadingSessions, error: sessionsError } = useQuery({
    queryKey: ['sessions', debouncedSearchTerm, backendStatus, filterCourse],
    queryFn: () => sessionService.getSessions({
      search: debouncedSearchTerm,
      status: backendStatus,
      course: filterCourse,
    }),
  });

  const createSessionMutation = useMutation({
    mutationFn: sessionService.createVideoSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, data }: UpdateVideoSessionPayload) => sessionService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => sessionService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });

  const markSessionAsOverMutation = useMutation({
    mutationFn: (id: string) => sessionService.updateSessionStatus(id, 'Ended'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });

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

  const markSessionAsOver = useCallback(async (id: string) => {
    try {
      await markSessionAsOverMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      console.error('Error marking session as over:', error);
      return { success: false, error: 'Failed to mark session as over' };
    }
  }, [markSessionAsOverMutation]);

  const attendanceJoin = useCallback(async (sessionId: string) => {
    try {
      await sessionService.attendanceJoin(sessionId);
      return { success: true };
    } catch (error) {
      console.error('Error joining attendance:', error);
      return { success: false, error: 'Failed to join attendance' };
    }
  }, []);

  const attendanceLeave = useCallback(async (sessionId: string) => {
    try {
      await sessionService.attendanceLeave(sessionId);
      return { success: true };
    } catch (error) {
      console.error('Error leaving attendance:', error);
      return { success: false, error: 'Failed to leave attendance' };
    }
  }, []);

  // Fetch session attendance
  const useSessionAttendance = (sessionId: string, filters: any = {}) => {
    return useQuery({
      queryKey: ['sessionAttendance', sessionId, filters],
      queryFn: () => sessionService.getSessionAttendance(sessionId, filters),
      enabled: !!sessionId
    });
  };

  // Fetch session attendance (pattern: function, not hook)
  const getSessionAttendance = useCallback(async (sessionId: string) => {
    try {
      return await sessionService.getSessionAttendance(sessionId);
    } catch (error) {
      console.error('Error fetching session attendance:', error);
      return null;
    }
  }, []);

  // Update attendance status
  const updateAttendanceStatus = useCallback(async (sessionId: string, userId: string, status: string, name: string) => {
    try {
      await sessionService.updateAttendanceStatus(sessionId, userId, status, name);
      return { success: true };
    } catch (error) {
      console.error('Error updating attendance status:', error);
      return { success: false, error: 'Failed to update attendance status' };
    }
  }, []);

  return {
    sessions: sessions || [],
    isLoading: isLoadingSessions,
    error: sessionsError,
    selectedSession,
    setSelectedSession,
    handleCreateSession,
    handleUpdateSession,
    handleDeleteSession,
    markSessionAsOver,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
    isMarkingAsOver: markSessionAsOverMutation.isPending,
    attendanceJoin,
    attendanceLeave,
    useSessionAttendance,
    getSessionAttendance,
    updateAttendanceStatus,
    // Add filter state and setters
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterCourse,
    setFilterCourse,
  };
}; 