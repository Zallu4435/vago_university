import { useOutletContext } from 'react-router-dom';
import { usePreferences } from '../../../application/context/PreferencesContext';
import DiplomaCoursesSection from './diploma/DiplomaCoursesSection';
import AssignmentsSection from './assignments/AssignmentsSection';
import StudyMaterialsPage from './materials/StudyMaterialsPage';
import UniversitySessionsDashboard from './sessions/UniversitySessionsDashboard';
import VideoClassPage from './sessions/UniversitySessionsDashboard';
import { ChatComponent } from './chat/ChatComponent';
import StudentDashboard from '../user/Dashboard/StudentDashboard';

export default function StudentCanvas() {
  const [activeTab, setActiveTab] = useOutletContext<[string, (tab: string) => void]>();
  const { styles } = usePreferences();

  
  const renderContent = () => {
    switch (activeTab) {  
      case 'Dashboard':
        return <StudentDashboard />;
      case 'Diploma Course':
        return <DiplomaCoursesSection />;
      case 'Chat':
        return <ChatComponent />;
      case 'Video Class':
        return <VideoClassPage />;
      case 'Materials':
        return <StudyMaterialsPage />;
      case 'Assignments':
        return <AssignmentsSection />;
      case 'Sessions':
        return <UniversitySessionsDashboard />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={`min-h-screen ${styles.background}`}>
      {renderContent()}
    </div>
  );
}