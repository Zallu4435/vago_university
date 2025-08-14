import { Routes, Route, Navigate } from 'react-router-dom';
import { usePreferences } from '../../../application/context/PreferencesContext';
import { DiplomaCoursesSection } from './diploma/DiplomaCoursesSection';
import AssignmentsSection from './assignments/AssignmentsSection';
import StudyMaterialsPage from './materials/StudyMaterialsPage';
import UniversitySessionsDashboard from './sessions/UniversitySessionsDashboard';
import VideoClassPage from './sessions/UniversitySessionsDashboard';
import { ChatComponent } from './chat/ChatComponent';
import StudentDashboard from '../user/Dashboard/StudentDashboard';

export default function StudentCanvas() {
  const { styles } = usePreferences();

  return (
    <div className={`min-h-screen ${styles.background}`}>
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="diploma-course" element={<DiplomaCoursesSection />} />
        <Route path="chat" element={<ChatComponent />} />
        <Route path="video-class" element={<VideoClassPage />} />
        <Route path="materials" element={<StudyMaterialsPage />} />
        <Route path="assignments" element={<AssignmentsSection />} />
        <Route path="sessions" element={<UniversitySessionsDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}