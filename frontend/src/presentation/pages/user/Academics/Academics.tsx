import { useState } from 'react';
import AcademicInfo from './AcademicInfo';
import AcademicsTabs from './AcademicsTabs';
import CourseRegistration from './CourseRegistration';
import AcademicRecords from './AcademicRecords';
import DegreeAudit from './DegreeAudit';

export default function Academics() {
  const [activeSubTab, setActiveSubTab] = useState('Course Registration');

  const studentInfo = {
    name: "John Smith",
    id: "123456789",
    major: "Computer Science",
    academicStanding: "Good",
    advisor: "Dr. Emma Wilson"
  };

  const courses = [
    { code: 'CS401', title: 'Advanced Algorithms', credits: 3, instructor: 'Dr. P. Garcia', schedule: 'MWF 10:00-11:45', id: 1 },
    { code: 'MATH302', title: 'Differential Equations', credits: 4, instructor: 'Dr. L. Chen', schedule: 'TTh 1:00-3:00', id: 2 },
    { code: 'PHYS201', title: 'Modern Physics', credits: 4, instructor: 'Dr. R. Smith', schedule: 'MWF 2:00-3:30', id: 3 }
  ];

  const gradeInfo = {
    cumulativeGPA: "3.75",
    termGPA: "3.82",
    termName: "Spring 2025",
    creditsEarned: "75",
    creditsInProgress: "0"
  };

  const academicHistory = [
    { term: "Spring 2025", credits: "15", gpa: "3.82", id: 1 },
    { term: "Fall 2024", credits: "18", gpa: "3.70", id: 2 },
    { term: "Spring 2024", credits: "15", gpa: "3.75", id: 3 }
  ];

  const programInfo = {
    degree: "Bachelor of Science in Computer Science",
    catalogYear: "2023-2024"
  };

  const progressInfo = {
    overallProgress: 70,
    totalCredits: 120,
    completedCredits: 85,
    remainingCredits: 35,
    estimatedGraduation: "May 2026"
  };

  const requirementsInfo = {
    core: { percentage: 80, completed: 48, total: 60 },
    elective: { percentage: 50, completed: 15, total: 30 },
    general: { percentage: 73, completed: 22, total: 30 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <AcademicInfo
        major={studentInfo.major}
        academicStanding={studentInfo.academicStanding}
        advisor={studentInfo.advisor}
      />
      <AcademicsTabs activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />
      <main className="flex-grow pb-8">
        {activeSubTab === 'Course Registration' && (
          <CourseRegistration
            courses={courses}
            enrolledCredits={0}
            waitlistedCredits={0}
          />
        )}
        {activeSubTab === 'Academic Records' && (
          <AcademicRecords
            studentInfo={studentInfo}
            gradeInfo={gradeInfo}
            academicHistory={academicHistory}
          />
        )}
        {activeSubTab === 'Degree Audit' && (
          <DegreeAudit
            studentInfo={studentInfo}
            programInfo={programInfo}
            progressInfo={progressInfo}
            requirementsInfo={requirementsInfo}
          />
        )}
      </main>
    </div>
  );
}