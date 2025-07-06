import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicService, StudentInfo, GradeInfo, Course, AcademicHistory, ProgramInfo, ProgressInfo, RequirementsInfo } from '../services/academicService';

interface QueryOptions {
  enabled?: boolean;
}

export const useStudentInfo = (options?: QueryOptions) => {
  return useQuery<StudentInfo>({
    queryKey: ['studentInfo'],
    queryFn: academicService.getStudentInfo,
    enabled: options?.enabled ?? true
  });
};

export const useGradeInfo = (options?: QueryOptions) => {
  return useQuery<GradeInfo>({
    queryKey: ['gradeInfo'],
    queryFn: academicService.getGradeInfo,
    enabled: options?.enabled ?? true
  });
};

export const useCourses = (options?: QueryOptions) => {
  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => academicService.getCourses(),
    enabled: options?.enabled ?? true
  });
};

export const useCourseSearch = (searchQuery: string, debounceMs: number = 500) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  return useQuery<Course[]>({
    queryKey: ['courses', debouncedQuery],
    queryFn: () => academicService.getCourses(debouncedQuery),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAcademicHistory = (options?: QueryOptions) => {
  return useQuery<AcademicHistory[]>({
    queryKey: ['academicHistory'],
    queryFn: academicService.getAcademicHistory,
    enabled: options?.enabled ?? true
  });
};

export const useProgramInfo = (options?: QueryOptions) => {
  return useQuery<ProgramInfo>({
    queryKey: ['programInfo'],
    queryFn: academicService.getProgramInfo,
    enabled: options?.enabled ?? true
  });
};

export const useProgressInfo = (options?: QueryOptions) => {
  return useQuery<ProgressInfo>({
    queryKey: ['progressInfo'],
    queryFn: academicService.getProgressInfo,
    enabled: options?.enabled ?? true
  });
};

export const useRequirementsInfo = (options?: QueryOptions) => {
  return useQuery<RequirementsInfo>({
    queryKey: ['requirementsInfo'],
    queryFn: academicService.getRequirementsInfo,
    enabled: options?.enabled ?? true
  });
};

interface EnrollmentData {
  courseId: string;
  term: string;
  section: string;
  reason: string;
}

export const useCourseRegistration = () => {
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: (data: EnrollmentData) => academicService.registerForCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  const dropMutation = useMutation({
    mutationFn: academicService.dropCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  return {
    registerForCourse: registerMutation.mutate,
    dropCourse: dropMutation.mutate,
    isRegistering: registerMutation.isPending,
    isDropping: dropMutation.isPending
  };
};

export const useTranscriptRequest = () => {
  const mutation = useMutation({
    mutationFn: academicService.requestTranscript
  });

  return {
    requestTranscript: mutation.mutate,
    isRequesting: mutation.isPending
  };
};

export const useAdvisorMeeting = () => {
  const mutation = useMutation({
    mutationFn: ({ date, reason }: { date: string; reason: string }) =>
      academicService.scheduleAdvisorMeeting(date, reason)
  });

  return {
    scheduleMeeting: mutation.mutate,
    isScheduling: mutation.isPending
  };
}; 