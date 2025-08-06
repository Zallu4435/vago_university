import httpClient from "../../frameworks/api/httpClient";
import type { StudentInfo, GradeInfo, AcademicHistory, ProgramInfo, ProgressInfo, RequirementsInfo, EnrollmentData, Course } from '../../domain/types/user/academics';

export const academicService = {
  getStudentInfo: async (): Promise<StudentInfo> => {
    const response = await httpClient.get('/academic/student-info');
    return response.data.data;
  },

  getGradeInfo: async (): Promise<GradeInfo> => {
    const response = await httpClient.get('/academic/grade-info');
    return response.data?.data;
  },

  getCourses: async (query?: string): Promise<Course[]> => {
    const params = query ? { search: query } : {};
    const response = await httpClient.get('/academic/courses', { params });
    return response.data?.data.courses || [];
  },

  getAcademicHistory: async (): Promise<AcademicHistory[]> => {
    const response = await httpClient.get('/academic/history');
    return response.data?.data;
  },

  getProgramInfo: async (): Promise<ProgramInfo> => {
    const response = await httpClient.get('/academic/program-info');
    return response.data?.data;
  },

  getProgressInfo: async (): Promise<ProgressInfo> => {
    const response = await httpClient.get('/academic/progress-info');
    return response.data?.data;
  },

  getRequirementsInfo: async (): Promise<RequirementsInfo> => {
    const response = await httpClient.get('/academic/requirements-info');
    return response.data?.data;
  },

  registerForCourse: async (data: EnrollmentData): Promise<void> => {
    await httpClient.post(`/academic/register/${data.courseId}`, {
      term: data.term,
      section: data.section,
      reason: data.reason
    });
  },

  dropCourse: async (courseId: string): Promise<void> => {
    await httpClient.delete(`/academic/register/${courseId}`);
  },

  requestTranscript: async (): Promise<void> => {
    await httpClient.post('/academic/request-transcript');
  },

  scheduleAdvisorMeeting: async (date: string, reason: string): Promise<void> => {
    await httpClient.post('/academic/schedule-meeting', { date, reason });
  }
}; 