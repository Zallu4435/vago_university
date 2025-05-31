import { useState } from 'react';
import AcademicInfo from './AcademicInfo';
import AcademicsTabs from './AcademicsTabs';
import CourseRegistration from './CourseRegistration';
import AcademicRecords from './AcademicRecords';
import DegreeAudit from './DegreeAudit';
import { useStudentInfo, useGradeInfo, useCourses, useAcademicHistory, useProgramInfo, useProgressInfo, useRequirementsInfo } from '../../../../application/hooks/useAcademic';

export default function Academics() {
  const [activeSubTab, setActiveSubTab] = useState('Course Registration');

  // Fetch data
  const { data: studentInfo, isLoading: isLoadingStudentInfo } = useStudentInfo({});
  const { data: courses, isLoading: isLoadingCourses } = useCourses({
    enabled: activeSubTab === 'Course Registration',
  });
  const { data: gradeInfo, isLoading: isLoadingGradeInfo } = useGradeInfo({
    enabled: activeSubTab === 'Academic Records',
  });
  const { data: academicHistory, isLoading: isLoadingHistory } = useAcademicHistory({
    enabled: activeSubTab === 'Academic Records',
  });
  const { data: programInfo, isLoading: isLoadingProgram } = useProgramInfo({
    enabled: activeSubTab === 'Degree Audit',
  });
  const { data: progressInfo, isLoading: isLoadingProgress } = useProgressInfo({
    enabled: activeSubTab === 'Degree Audit',
  });
  const { data: requirementsInfo, isLoading: isLoadingRequirements } = useRequirementsInfo({
    enabled: activeSubTab === 'Degree Audit',
  });

  // Loading states
  const isLoadingCourseRegistration = isLoadingStudentInfo || isLoadingCourses;
  const isLoadingAcademicRecords = isLoadingStudentInfo || isLoadingGradeInfo || isLoadingHistory;
  const isLoadingDegreeAudit = isLoadingStudentInfo || isLoadingProgram || isLoadingProgress || isLoadingRequirements;

  // Fallback data
  const fallbackStudentInfo = {
    name: 'John Smith',
    id: '123456789',
    major: 'Computer Science',
    academicStanding: 'Good',
    advisor: 'Dr. Emma Wilson',
  };
  const fallbackCourses = [
    { code: 'CS401', title: 'Advanced Algorithms', credits: 3, instructor: 'Dr. P. Garcia', schedule: 'MWF 10:00-11:45', id: 1 },
    { code: 'MATH302', title: 'Differential Equations', credits: 4, instructor: 'Dr. L. Chen', schedule: 'TTh 1:00-3:00', id: 2 },
    { code: 'PHYS201', title: 'Modern Physics', credits: 4, instructor: 'Dr. R. Smith', schedule: 'MWF 2:00-3:30', id: 3 },
  ];
  const fallbackGradeInfo = {
    cumulativeGPA: '3.75',
    termGPA: '3.82',
    termName: 'Spring 2025',
    creditsEarned: '75',
    creditsInProgress: '0',
  };
  const fallbackAcademicHistory = [
    { term: 'Spring 2025', credits: '15', gpa: '3.82', id: 1 },
    { term: 'Fall 2024', credits: '18', gpa: '3.70', id: 2 },
    { term: 'Spring 2024', credits: '15', gpa: '3.75', id: 3 },
  ];
  const fallbackProgramInfo = {
    degree: 'Bachelor of Science in Computer Science',
    catalogYear: '2023-2024',
  };
  const fallbackProgressInfo = {
    overallProgress: 70,
    totalCredits: 120,
    completedCredits: 85,
    remainingCredits: 35,
    estimatedGraduation: 'May 2026',
  };
  const fallbackRequirementsInfo = {
    core: { percentage: 80, completed: 48, total: 60 },
    elective: { percentage: 50, completed: 15, total: 30 },
    general: { percentage: 73, completed: 22, total: 30 },
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white/90">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 to-white/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <AcademicInfo
          major={studentInfo?.major || fallbackStudentInfo.major}
          academicStanding={studentInfo?.academicStanding || fallbackStudentInfo.academicStanding}
          advisor={studentInfo?.advisor || fallbackStudentInfo.advisor}
        />
        <AcademicsTabs activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {activeSubTab === 'Course Registration' && (
            isLoadingCourseRegistration ? (
              <LoadingSpinner />
            ) : (
              <CourseRegistration
                studentInfo={studentInfo || fallbackStudentInfo}
                courses={courses?.courses || fallbackCourses}
                enrolledCredits={0}
                waitlistedCredits={0}
              />
            )
          )}
          {activeSubTab === 'Academic Records' && (
            isLoadingAcademicRecords ? (
              <LoadingSpinner />
            ) : (
              <AcademicRecords
                studentInfo={studentInfo || fallbackStudentInfo}
                gradeInfo={gradeInfo || fallbackGradeInfo}
                academicHistory={academicHistory?.history || fallbackAcademicHistory}
              />
            )
          )}
          {activeSubTab === 'Degree Audit' && (
            isLoadingDegreeAudit ? (
              <LoadingSpinner />
            ) : (
              <DegreeAudit
                studentInfo={studentInfo || fallbackStudentInfo}
                programInfo={programInfo || fallbackProgramInfo}
                progressInfo={progressInfo || fallbackProgressInfo}
                requirementsInfo={requirementsInfo || fallbackRequirementsInfo}
              />
            )
          )}
        </main>
      </div>
    </div>
  );
}
