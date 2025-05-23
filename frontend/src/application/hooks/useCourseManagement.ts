// src/application/hooks/useCourseManagement.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { courseService } from '../services/course.service';
import { Course, CourseApiResponse, CourseDetails } from '../../domain/types/course';

interface Filters {
  specialization: string;
  faculty: string;
  term: string;
}

export const useCourseManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    specialization: 'all',
    faculty: 'all',
    term: 'all',
  });
  const limit = 10;

  const { data, isLoading, error } = useQuery<CourseApiResponse, Error>({
    queryKey: ['courses', page, filters, limit],
    queryFn: () =>
      courseService.getCourses(
        page,
        limit,
        filters.specialization !== 'all' ? filters.specialization : undefined,
        filters.faculty !== 'all' ? filters.faculty : undefined,
        filters.term !== 'all' ? filters.term : undefined
      ),
    keepPreviousData: true,
  });

  const { mutateAsync: getCourseDetails } = useMutation({
    mutationFn: (id: string) => courseService.getCourseDetails(id),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch course details');
    },
  });

  const { mutateAsync: createCourse } = useMutation({
    mutationFn: (data: Omit<Course, 'id' | 'currentEnrollment'>) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create course');
    },
  });

  const { mutateAsync: updateCourse } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => 
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update course');
    },
  });

  const { mutateAsync: deleteCourse } = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete course');
    },
  });

  const { mutateAsync: approveEnrollment } = useMutation({
    mutationFn: ({ courseId, enrollmentId }: { courseId: string; enrollmentId: string }) =>
      courseService.approveEnrollment(courseId, enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Enrollment approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve enrollment');
    },
  });

  const { mutateAsync: rejectEnrollment } = useMutation({
    mutationFn: ({ courseId, enrollmentId, reason }: { courseId: string; enrollmentId: string; reason: string }) =>
      courseService.rejectEnrollment(courseId, enrollmentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Enrollment rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject enrollment');
    },
  });

  return {
    courses: data?.courses || [],
    totalPages: data?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    getCourseDetails,
    createCourse,
    updateCourse,
    deleteCourse,
    approveEnrollment,
    rejectEnrollment,
  };
};