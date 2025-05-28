import httpClient from "../../frameworks/api/httpClient";

export interface StudentInfo {
  name: string;
  id: string;
  major: string;
  academicStanding: string;
  advisor: string;
}

export interface GradeInfo {
  cumulativeGPA: string;
  termGPA: string;
  termName: string;
  creditsEarned: string;
  creditsInProgress: string;
}

export interface Course {
  id: number;
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  prerequisites?: string[];
}

export interface AcademicHistory {
  term: string;
  credits: string;
  gpa: string;
  id: number;
}

export interface ProgramInfo {
  degree: string;
  catalogYear: string;
}

export interface ProgressInfo {
  overallProgress: number;
  totalCredits: number;
  completedCredits: number;
  remainingCredits: number;
  estimatedGraduation: string;
}

export interface RequirementsInfo {
  core: { percentage: number; completed: number; total: number };
  elective: { percentage: number; completed: number; total: number };
  general: { percentage: number; completed: number; total: number };
}

interface EnrollmentData {
  courseId: number;
  term: string;
  section: string;
  reason: string;
}

export const academicService = {
  // Get student information
  getStudentInfo: async (): Promise<StudentInfo> => {
    const response = await httpClient.get('/academic/student-info');
    return response.data;
  },

  // Get grade information
  getGradeInfo: async (): Promise<GradeInfo> => {
    const response = await httpClient.get('/academic/grade-info');
    return response.data;
  },

  // Get available courses
  getCourses: async (): Promise<Course[]> => {
    const response = await httpClient.get('/academic/courses');
    return response.data;
  },

  // Get academic history
  getAcademicHistory: async (): Promise<AcademicHistory[]> => {
    const response = await httpClient.get('/academic/history');
    return response.data;
  },

  // Get program information
  getProgramInfo: async (): Promise<ProgramInfo> => {
    const response = await httpClient.get('/academic/program-info');
    return response.data;
  },

  // Get progress information
  getProgressInfo: async (): Promise<ProgressInfo> => {
    const response = await httpClient.get('/academic/progress-info');
    return response.data;
  },

  // Get requirements information
  getRequirementsInfo: async (): Promise<RequirementsInfo> => {
    const response = await httpClient.get('/academic/requirements-info');
    return response.data;
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
  dropCourse: async (courseId: number): Promise<void> => {
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