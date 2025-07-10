import { useOutletContext } from 'react-router-dom';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import WelcomeBanner from './WelcomeBanner';
import Announcements from './Announcements';
import Deadlines from './Deadlines';
import QuickLinks from './QuickLinks';
import ScheduledClasses from './ScheduledClasses';
import OnlineSessionTopics from './OnlineSessionTopics';
import Calendar from './Calendar';
import Academics from '../Academics/Academics';
import CampusLife from '../CampusLife/CampusLife';
import Communication from '../Communication/Communication';
import Financial from '../Financial/Financial';
import { useStudentDashboard } from '../../../../application/hooks/useStudentDashboard';

// Type for special dates
type SpecialDateType = {
  type: 'exam' | 'deadline' | 'event';
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useOutletContext() as [string, (tab: string) => void];
  const { styles } = usePreferences();

  const {
    announcements,
    deadlines,
    classes,
    onlineTopics,
    calendarDays,
    specialDates,
    isLoading,
    hasError,
    dashboardError
  } = useStudentDashboard();

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error: {dashboardError ? String(dashboardError) : 'Failed to load dashboard data.'}</div>;

  const handleVote = (index: number) => {
    if (onlineTopics && onlineTopics[index]) {
      console.log(`Voted for ${onlineTopics[index].title}`);
    }
  };

  return (
    <div className={`flex flex-col ${styles.textPrimary}`}>
      {activeTab === 'Dashboard' && (
        <>
          <WelcomeBanner />
          <div className="px-2 sm:px-4 md:px-4 py-4 sm:py-6 md:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-4 md:gap-6 h-full">
              <Announcements announcements={announcements} />
              <Deadlines deadlines={deadlines} />
              <QuickLinks />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-4 md:gap-6 mt-8 sm:mt-4 md:mt-6 h-full">
              <ScheduledClasses classes={classes} />
              <OnlineSessionTopics onlineTopics={onlineTopics} handleVote={handleVote} />
              <Calendar calendarDays={calendarDays} specialDates={specialDates} />
            </div>
          </div>
        </>
      )}
      {activeTab === 'Academics' && <Academics />}
      {activeTab === 'Financial' && <Financial />}
      {activeTab === 'Communication' && <Communication />}
      {activeTab === 'Campus Life' && <CampusLife />}
    </div>
  );
}