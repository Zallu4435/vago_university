export interface AcademicsTabsProps {
    activeSubTab: string;
    setActiveSubTab: (tab: string) => void;
}

export interface StudentInfo {
    credits: number;
    pendingCredits: number;
}

export interface Course {
    id: string;
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

export interface CourseRegistrationProps {
    studentInfo: StudentInfo;
    courses: Course[];
    enrolledCredits: number;
    waitlistedCredits: number;
}

export interface CourseDetails {
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

export interface CourseDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (enrollmentData: { reason: string }) => void;
    course: CourseDetails;
    isEnrolling: boolean;
} 

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

export interface EnrollmentData {
  courseId: string;
  term: string;
  section: string;
  reason: string;
} 