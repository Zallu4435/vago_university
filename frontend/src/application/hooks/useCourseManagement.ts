// src/application/hooks/useCourseManagement.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { courseService } from '../services/course.service';
import { Course, CourseApiResponse, CourseDetails, EnrollmentRequest } from '../../domain/types/course';

interface Filters {
  specialization: string;
  faculty: string;
  term: string;
}

interface RequestFilters {
  status: string;
}

interface EnrollmentRequest {
  id: string;
  studentName: string;
  courseTitle: string;
  requestedAt: string;
  status: string;
  specialization: string;
}

interface EnrollmentResponse {
  enrollments: EnrollmentRequest[];
  totalPages: number;
  totalEnrollments: number;
  currentPage: number;
}

export const useCourseManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    specialization: 'all',
    faculty: 'all',
    term: 'all',
  });
  const [requestFilters, setRequestFilters] = useState<RequestFilters>({
    status: 'all',
  });
  const [activeTab, setActiveTab] = useState<'courses' | 'requests'>('courses');
  const limit = 10;

  const { data: coursesData, isLoading, error } = useQuery<CourseApiResponse, Error>({
    queryKey: ['courses', page, filters, limit],
    queryFn: () =>
      courseService.getCourses(
        page,
        limit,
        filters.specialization !== 'all' ? filters.specialization : undefined,
        filters.faculty !== 'all' ? filters.faculty : undefined,
        filters.term !== 'all' ? filters.term : undefined
      ),
  });

  const { data: enrollmentRequestsData, isLoading: isLoadingRequests } = useQuery<EnrollmentResponse, Error>({
    queryKey: ['course-enrollments', page, requestFilters, limit],
    queryFn: () =>
      courseService.getEnrollmentRequests(
        page,
        limit,
        requestFilters.status !== 'all' ? requestFilters.status : undefined
      ),
    enabled: activeTab === 'requests',
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

  const { mutateAsync: approveEnrollmentRequest } = useMutation({
    mutationFn: (requestId: string) => courseService.approveEnrollmentRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
      toast.success('Enrollment request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve enrollment request');
    },
  });

  const { mutateAsync: rejectEnrollmentRequest } = useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) =>
      courseService.rejectEnrollmentRequest(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
      toast.success('Enrollment request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject enrollment request');
    },
  });

  const { mutateAsync: getEnrollmentRequestDetails } = useMutation({
    mutationFn: (requestId: string) => courseService.getEnrollmentRequestDetails(requestId),
    onError: (error: any) => {
      toast.error(error.message || 'Failed to fetch enrollment request details');
    },
  });

  console.log(enrollmentRequestsData, 'enrollmentRequestsData');
  return {
    courses: coursesData?.courses || [],
    totalPages: coursesData?.totalPages || 0,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollmentRequests: enrollmentRequestsData?.enrollments || [],
    enrollmentRequestsTotalPages: enrollmentRequestsData?.totalPages || 0,
    isLoadingRequests,
    approveEnrollmentRequest,
    rejectEnrollmentRequest,
    getEnrollmentRequestDetails,
    requestFilters,
    setRequestFilters,
    activeTab,
    setActiveTab,
  };
};