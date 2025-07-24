import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { universitySessionService, UniversitySession } from '../services/universitySession.service';

export const useUniversitySessionManagement = (initialFilters = { status: 'all', instructor: 'all' }, initialSearchTerm = '') => {
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState<UniversitySession | null>(null);
  const [filters, setFilters] = useState<{ status: string; instructor: string }>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['universitySessions', { status: filters.status, instructor: filters.instructor, search: debouncedSearchTerm }],
    queryFn: () => universitySessionService.getSessions({ status: filters.status, instructor: filters.instructor, search: debouncedSearchTerm })
  });

  const joinSessionMutation = useMutation({
    mutationFn: ({ sessionId, userId }: { sessionId: string, userId: string }) => universitySessionService.joinSession(sessionId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universitySessions'] });
    }
  });

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
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
  };
}; 