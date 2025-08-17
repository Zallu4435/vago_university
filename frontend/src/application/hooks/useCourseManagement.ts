import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { courseService } from "../services/course.service";
import {
  Course,
  CourseApiResponse,
  CourseDetails,
  EnrollmentRequest,
} from "../../domain/types/course";

interface Filters {
  specialization: string;
  faculty: string;
  term: string;
}

interface RequestFilters {
  status: string;
  specialization: string;
  term: string;
}

export const useCourseManagement = (searchQuery: string = "") => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<Filters>({
    specialization: "All Specializations",
    faculty: "All Faculties",
    term: "All Terms",
  });
  const [requestFilters, setRequestFilters] = useState<RequestFilters>({
    status: "All",
    specialization: "All Specializations",
    term: "All Terms",
  });
  const [activeTab, setActiveTab] = useState<"courses" | "requests">("courses");
  const limit = 10;

  const {
    data: coursesData,
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useQuery<CourseApiResponse, Error>({
    queryKey: ["courses", page, filters, limit, searchQuery],
    queryFn: () =>
      courseService.getCourses(
        page,
        limit,
        filters.specialization !== "All Specializations"
          ? filters.specialization
          : undefined,
        filters.faculty !== "All Faculties" ? filters.faculty : undefined,
        filters.term !== "All Terms" ? filters.term : undefined,
        searchQuery && searchQuery.trim() !== "" ? searchQuery : undefined
      ),
    enabled: activeTab === 'courses'
  });

  const {
    data: enrollmentRequestsData,
    isLoading: isLoadingRequests,
    error: requestsError,
  } = useQuery<{ data: EnrollmentRequest[]; totalPages: number }, Error>({
    queryKey: ["course-enrollments", page, requestFilters, limit],
    queryFn: () =>
      courseService.getEnrollmentRequests(
        page,
        limit,
        requestFilters.status !== "All" ? requestFilters.status : undefined,
        requestFilters.specialization !== "All Specializations"
          ? requestFilters.specialization
          : undefined,
        requestFilters.term !== "All Terms" ? requestFilters.term : undefined
      ),
    enabled: activeTab === 'requests'
  });

  const { data: courseDetails, isLoading: isLoadingCourseDetails } = useQuery<
    { course: CourseDetails },
    Error
  >({
    queryKey: ["course-details", selectedCourseId],
    queryFn: () => courseService.getCourseDetails(selectedCourseId!),
    enabled: !!selectedCourseId,
  });

  const { data: requestDetails, isLoading: isLoadingRequestDetails } = useQuery<
    { courseRequest: EnrollmentRequest },
    Error
  >({
    queryKey: ["enrollment-request-details", selectedRequestId],
    queryFn: () =>
      courseService.getEnrollmentRequestDetails(selectedRequestId!),
    enabled: !!selectedRequestId,
  });

  const { mutateAsync: createCourse } = useMutation({
    mutationFn: (data: Omit<Course, "id" | "currentEnrollment">) =>
      courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create course");
    },
  });

  const { mutateAsync: updateCourse } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course");
    },
  });

  const { mutateAsync: deleteCourse } = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete course");
    },
  });

  const { mutateAsync: approveEnrollmentRequest } = useMutation({
    mutationFn: (requestId: string) =>
      courseService.approveEnrollmentRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-enrollments"] });
      toast.success("Enrollment request approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve enrollment request");
    },
  });

  const { mutateAsync: rejectEnrollmentRequest } = useMutation({
    mutationFn: ({
      requestId,
      reason,
    }: {
      requestId: string;
      reason: string;
    }) => courseService.rejectEnrollmentRequest(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-enrollments"] });
      toast.success("Enrollment request rejected successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject enrollment request");
    },
  });

  const handleTabChange = (tab: "courses" | "requests") => {
    setActiveTab(tab);
    setPage(1);
    setFilters({
      specialization: "All Specializations",
      faculty: "All Faculties",
      term: "All Terms",
    });
    setRequestFilters({
      status: "All",
      specialization: "All Specializations",
      term: "All Terms",
    });
    queryClient.invalidateQueries({
      queryKey: tab === "courses" ? ["courses"] : ["course-enrollments"],
    });
  };

  const handleViewCourse = (courseId: string) => {
    console.log("Viewing course:", courseId);
    setSelectedCourseId(courseId);
  };

  const handleEditCourse = (courseId: string) => {
    console.log("Editing course:", courseId);
    setSelectedCourseId(courseId);
  };

  const handleViewRequest = (requestId: string) => {
    console.log("Viewing request:", requestId);
    setSelectedRequestId(requestId);
  };


  return {
    courses: coursesData?.data || [],
    totalPages: coursesData?.totalPages || 0,
    totalItems: coursesData?.totalItems || 0,
    currentPage: coursesData?.currentPage || 1,
    page,
    setPage,
    filters,
    setFilters,
    isLoading: isLoadingCourses,
    error: coursesError || requestsError,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollmentRequests: enrollmentRequestsData?.data || [],
    enrollmentRequestsTotalPages: enrollmentRequestsData?.totalPages || 0,
    isLoadingRequests,
    approveEnrollmentRequest,
    rejectEnrollmentRequest,
    requestFilters,
    setRequestFilters,
    activeTab,
    handleTabChange,
    courseDetails: courseDetails?.course || null,
    isLoadingCourseDetails,
    handleViewCourse,
    handleEditCourse,
    requestDetails: requestDetails?.courseRequest || null,
    isLoadingRequestDetails,
    handleViewRequest,
  };
};
