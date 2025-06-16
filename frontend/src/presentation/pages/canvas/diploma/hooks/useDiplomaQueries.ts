import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diplomaService } from '../services/diploma.service';

export const diplomaKeys = {
  all: ['diploma'] as const,
  courses: () => [...diplomaKeys.all, 'courses'] as const,
  course: (id: string) => [...diplomaKeys.courses(), id] as const,
  chapter: (courseId: string, chapterId: string) => 
    [...diplomaKeys.course(courseId), 'chapters', chapterId] as const,
  completedChapters: (courseId: string) => 
    [...diplomaKeys.course(courseId), 'completed'] as const,
  bookmarkedChapters: (courseId: string) => 
    [...diplomaKeys.course(courseId), 'bookmarked'] as const,
};

export const useDiplomaCourses = () => {
  return useQuery({
    queryKey: diplomaKeys.courses(),
    queryFn: diplomaService.getAllCourses,
  });
};

export const useDiplomaCourse = (courseId: string) => {
  return useQuery({
    queryKey: diplomaKeys.course(courseId),
    queryFn: () => diplomaService.getCourseById(courseId),
    enabled: !!courseId,
  });
};

export const useDiplomaChapter = (courseId: string, chapterId: string) => {
  return useQuery({
    queryKey: diplomaKeys.chapter(courseId, chapterId),
    queryFn: () => diplomaService.getChapterById(courseId, chapterId),
    enabled: !!courseId && !!chapterId,
  });
};

export const useCompletedChapters = (courseId: string) => {
  return useQuery({
    queryKey: diplomaKeys.completedChapters(courseId),
    queryFn: () => diplomaService.getCompletedChapters(courseId),
    enabled: !!courseId,
  });
};

export const useBookmarkedChapters = (courseId: string) => {
  return useQuery({
    queryKey: diplomaKeys.bookmarkedChapters(courseId),
    queryFn: () => diplomaService.getBookmarkedChapters(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateVideoProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, chapterId, progress }: { courseId: string; chapterId: string; progress: number }) =>
      diplomaService.updateVideoProgress(courseId, chapterId, progress),
    onSuccess: (_, { courseId, chapterId }) => {
      queryClient.invalidateQueries({ queryKey: diplomaKeys.chapter(courseId, chapterId) });
    },
  });
};

export const useMarkChapterComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, chapterId }: { courseId: string; chapterId: string }) =>
      diplomaService.markChapterComplete(courseId, chapterId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: diplomaKeys.completedChapters(courseId) });
      queryClient.invalidateQueries({ queryKey: diplomaKeys.course(courseId) });
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, chapterId }: { courseId: string; chapterId: string }) =>
      diplomaService.toggleBookmark(courseId, chapterId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: diplomaKeys.bookmarkedChapters(courseId) });
    },
  });
}; 