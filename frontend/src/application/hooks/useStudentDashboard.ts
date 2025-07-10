import { useQuery, useQueryClient } from '@tanstack/react-query';
import { studentDashboardService } from '../services/studentDashboardService';

// Dummy data
const dummyData = {
  announcements: [
    {
      id: '1',
      title: 'Welcome to Spring Semester 2024',
      content: 'We hope you have a great learning experience!',
      date: new Date().toISOString(),
      sender: 'Admin',
      hasAttachments: false
    },
    {
      id: '2',
      title: 'Library Hours Extended',
      content: 'Library will now be open until 11 PM',
      date: new Date().toISOString(),
      sender: 'Library Staff',
      hasAttachments: false
    }
  ],
  deadlines: [
    {
      id: '1',
      title: 'Assignment 1 Due',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      urgent: true
    },
    {
      id: '2',
      title: 'Mid-term Exam',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      urgent: false
    }
  ],
  classes: [
    {
      id: '1',
      code: 'WD101',
      name: 'Web Development',
      instructor: 'Dr. Smith',
      time: '09:00 AM - 10:30 AM',
      room: 'Room 101',
      building: 'Tech Building',
      status: 'scheduled'
    },
    {
      id: '2',
      code: 'DB201',
      name: 'Database Management',
      instructor: 'Prof. Johnson',
      time: '11:00 AM - 12:30 PM',
      room: 'Room 203',
      building: 'Science Center',
      status: 'scheduled'
    }
  ],
  onlineTopics: [
    {
      id: '1',
      title: 'React Hooks Deep Dive',
      votes: 15,
      voted: false
    },
    {
      id: '2',
      title: 'MongoDB Best Practices',
      votes: 12,
      voted: false
    }
  ],
  calendarDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  specialDates: {
    14: { type: 'exam' as const },
    7: { type: 'deadline' as const },
    10: { type: 'event' as const }
  }
};

export const useStudentDashboard = () => {
  // Return dummy data directly
  return {
    // Data
    announcements: dummyData.announcements,
    deadlines: dummyData.deadlines,
    classes: dummyData.classes,
    onlineTopics: dummyData.onlineTopics,
    calendarDays: dummyData.calendarDays,
    specialDates: dummyData.specialDates,

    // Loading states
    isLoading: false,
    isLoadingAnnouncements: false,
    isLoadingDeadlines: false,
    isLoadingClasses: false,
    isLoadingOnlineTopics: false,
    isLoadingCalendarDays: false,
    isLoadingSpecialDates: false,

    // Error states
    hasError: false,
    dashboardError: null,
    announcementsError: null,
    deadlinesError: null,
    classesError: null,
    onlineTopicsError: null,
    calendarDaysError: null,
    specialDatesError: null,

    // Utilities
    refetchDashboard: () => Promise.resolve(),
    refetchAnnouncements: () => Promise.resolve(),
    refetchDeadlines: () => Promise.resolve(),
    refetchClasses: () => Promise.resolve(),
    refetchOnlineTopics: () => Promise.resolve(),
    refetchCalendarDays: () => Promise.resolve(),
    refetchSpecialDates: () => Promise.resolve(),
  };
}; 