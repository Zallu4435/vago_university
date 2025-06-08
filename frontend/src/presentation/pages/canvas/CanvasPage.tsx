import { useOutletContext } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import ChatComponent from './chat/ChatComponent';
import DiplomaCoursesSection from './diploma/DiplomaCoursesSection';
import AssignmentsSection from './assignment/AssignmentsSection';
import StudyMaterialsPage from './materials/StudyMaterialsPage';
import UniversitySessionsDashboard from './sessions/UniversitySessionsDashboard';
import VideoClassPage from './sessions/UniversitySessionsDashboard';
import UniversityDashboard from './UniversityDashboard';

export default function StudentCanvas() {
  const [activeTab, setActiveTab] = useOutletContext<[string, (tab: string) => void]>();
  const { styles } = usePreferences();

  const navItems = [
    'Canvas Dashboard',
    'Diploma Course',
    'Chat',
    'Video Class',
    'Materials',
    'Assignments',
    'Sessions'
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <UniversityDashboard />;
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