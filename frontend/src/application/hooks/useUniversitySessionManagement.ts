import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { universitySessionService, UniversitySession } from '../services/universitySession.service';

export const useUniversitySessionManagement = () => {
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState<UniversitySession | null>(null);

  // Fetch all sessions
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['universitySessions'],
    queryFn: universitySessionService.getSessions
  });

  // Join session mutation
  const joinSessionMutation = useMutation({
    mutationFn: ({ sessionId, userId }: { sessionId: string, userId: string }) => universitySessionService.joinSession(sessionId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universitySessions'] });
    }
  });

  // Handler
  const handleJoinSession = useCallback(async (sessionId: string, userId: string) => {
    try {
      await joinSessionMutation.mutateAsync({ sessionId, userId });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to join session' };
    }
  }, [joinSessionMutation]);

  return {
    sessions: sessions || [],
    isLoading,
    error,
    selectedSession,
    setSelectedSession,
    handleJoinSession,
    isJoining: joinSessionMutation.isPending,
  };
}; 