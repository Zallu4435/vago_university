import httpClient from "../../frameworks/api/httpClient";
import type { StudentInfo, GradeInfo, AcademicHistory, ProgramInfo, ProgressInfo, RequirementsInfo, EnrollmentData, Course } from '../../domain/types/user/academics';

export const academicService = {
  // Get student information
  getStudentInfo: async (): Promise<StudentInfo> => {
    const response = await httpClient.get('/academic/student-info');
    return response.data.data;
  },

  // Get grade information
  getGradeInfo: async (): Promise<GradeInfo> => {
    const response = await httpClient.get('/academic/grade-info');
    return response.data?.data;
  },

  // Get available courses with optional search query
  getCourses: async (query?: string): Promise<Course[]> => {
    const params = query ? { search: query } : {};
    const response = await httpClient.get('/academic/courses', { params });
    return response.data?.data.courses || [];
  },

  // Get academic history
  getAcademicHistory: async (): Promise<AcademicHistory[]> => {
    const response = await httpClient.get('/academic/history');
    return response.data?.data;
  },

  // Get program information
  getProgramInfo: async (): Promise<ProgramInfo> => {
    const response = await httpClient.get('/academic/program-info');
    return response.data?.data;
  },

  // Get progress information
  getProgressInfo: async (): Promise<ProgressInfo> => {
    const response = await httpClient.get('/academic/progress-info');
    return response.data?.data;
  },

  // Get requirements information
  getRequirementsInfo: async (): Promise<RequirementsInfo> => {
    const response = await httpClient.get('/academic/requirements-info');
    return response.data?.data;
  },

  // Register for a course
  registerForCourse: async (data: EnrollmentData): Promise<void> => {
    await httpClient.post(`/academic/register/${data.courseId}`, {
      term: data.term,
      section: data.section,
      reason: data.reason
    });
  },

  // Drop a course
  dropCourse: async (courseId: string): Promise<void> => {
    await httpClient.delete(`/academic/register/${courseId}`);
  },

  // Request official transcript
  requestTranscript: async (): Promise<void> => {
    await httpClient.post('/academic/request-transcript');
  },

  // Schedule advisor meeting
  scheduleAdvisorMeeting: async (date: string, reason: string): Promise<void> => {
    await httpClient.post('/academic/schedule-meeting', { date, reason });
  }
}; 