import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useOutletContext();

  // Sample data from provided code
  const announcements = [
    { title: 'Library Hours Extended', date: 'Apr 24, 2025' },
    { title: 'Registration Deadline Approaching', date: 'Apr 28, 2025' },
    { title: 'Campus Event: Spring Festival', date: 'May 2, 2025' }
  ];

  const deadlines = [
    { title: 'CS301 Assignment Due', date: 'Tomorrow', urgent: true },
    { title: 'BIO220 Project Submission', date: 'May 5' },
  ];

  const classes = [
    { code: 'CS301', name: 'Data Structures', time: '09:00-10:30AM', room: 'Room D201', status: 'Live' },
    { code: 'MATH154', name: 'Linear Algebra', time: '11:00-12:30PM', room: 'Room A103', status: 'Next' }
  ];

  const onlineTopics = [
    { title: 'Advanced Database Design', votes: 24, voted: true },
    { title: 'Machine Learning Fundamentals', votes: 18, voted: false },
    { title: 'Web Development with React', votes: 12, voted: false },
    { title: 'Research Paper Writing Workshop', votes: 8, voted: false }
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const specialDates = {
    10: { type: 'exam' },
    15: { type: 'deadline' },
    3: { type: 'event' }
  };

  const handleVote = (index) => {
    console.log(`Voted for ${onlineTopics[index].title}`);
  };

  return (
    <>
      {activeTab === 'Dashboard' && (
        <>
          <WelcomeBanner />
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              <Announcements announcements={announcements} />
              <Deadlines deadlines={deadlines} />
              <QuickLinks />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 h-full">
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
    </>
  );
}