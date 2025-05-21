import StatsSection from './StatsSection';
import UpcomingSessions from './UpcomingSessions';
import RecentActivities from './RecentActivities';
import QuickAccess from './QuickAccess';
import { LuCalendar, LuUsers, LuClock, LuSquareCheck, LuFileText, LuUserPlus, LuClipboard, LuGraduationCap, LuChartBar } from 'react-icons/lu';

export default function FacultyDashboard() {
  const stats = [
    { title: 'Total Sessions', value: 24, icon: <LuClock className="text-indigo-400" size={24} /> },
    { title: 'Upcoming Sessions', value: 3, icon: <LuCalendar className="text-purple-400" size={24} /> },
    { title: 'Total Students', value: 87, icon: <LuUsers className="text-pink-400" size={24} /> },
  ];

  const upcomingSessions = [
    {
      title: 'Advanced Database Systems',
      time: 'Today, 2:00 PM - 3:30 PM',
      room: 'Room 302',
      students: 28,
      progress: 65,
    },
    {
      title: 'Computer Networks',
      time: 'Tomorrow, 10:00 AM - 11:30 AM',
      room: 'Room 201',
      students: 32,
      progress: 42,
    },
    {
      title: 'Data Structures',
      time: 'May 18, 1:00 PM - 2:30 PM',
      room: 'Room 105',
      students: 27,
      progress: 78,
    },
  ];

  const recentActivities = [
    { action: 'Posted new assignment', course: 'Advanced Database Systems', time: '2 hours ago' },
    { action: 'Updated course materials', course: 'Computer Networks', time: 'Yesterday' },
    { action: 'Graded submissions', course: 'Data Structures', time: '2 days ago' },
  ];

  const quickAccessItems = [
    {
      title: 'Take Attendance',
      description: 'Record attendance for your classes',
      icon: <LuSquareCheck size={24} />,
      color: 'from-indigo-500 to-indigo-700',
    },
    {
      title: 'Upload Resources',
      description: 'Share study materials with students',
      icon: <LuFileText size={24} />,
      color: 'from-purple-500 to-purple-700',
    },
    {
      title: 'Create Assignment',
      description: 'Publish new assignments',
      icon: <LuClipboard size={24} />,
      color: 'from-pink-500 to-pink-700',
    },
    {
      title: 'Add Students',
      description: 'Enroll new students to courses',
      icon: <LuUserPlus size={24} />,
      color: 'from-teal-500 to-teal-700',
    },
    {
      title: 'View Reports',
      description: 'Access performance analytics',
      icon: <LuChartBar size={24} />,
      color: 'from-blue-500 to-blue-700',
    },
    {
      title: 'Grade Submissions',
      description: 'Review student submissions',
      icon: <LuGraduationCap size={24} />,
      color: 'from-amber-500 to-amber-700',
    },
  ];

  return (
    <div className="px-8 pt-6 pb-12">
      <StatsSection stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
        <UpcomingSessions sessions={upcomingSessions} />
        <RecentActivities activities={recentActivities} />
      </div>
      <QuickAccess items={quickAccessItems} />
    </div>
  );
}