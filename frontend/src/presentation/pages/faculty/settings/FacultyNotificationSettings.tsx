import { useState } from 'react';
import { FaBell, FaCog, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { useNotificationManagement } from '../../../../application/hooks/useNotificationManagement';
import { usePreferences } from '../../../context/PreferencesContext';

export default function FacultyNotificationSettings() {
  const { styles } = usePreferences();
  const { notifications, markAsRead, markAllAsRead } = useNotificationManagement();
  const [activeTab, setActiveTab] = useState<'preferences' | 'notifications'>('preferences');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentAlerts: true,
    classReminders: true,
    gradeDeadlines: true,
    systemAnnouncements: false,
    studentSubmissions: true,
    attendanceAlerts: true,
    meetingReminders: true,
    deadlineWarnings: true
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatRelativeTime = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'assignment':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-slate-50 p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm">
              <FaBell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Notification Settings</h1>
              <p className="text-slate-600">Manage your notification preferences and view notifications</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'preferences'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FaCog className="inline mr-2" />
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center ${
                activeTab === 'notifications'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FaBell className="inline mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'preferences' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Email Notifications</p>
                      <p className="text-sm text-slate-500">Receive notifications via email</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.emailNotifications ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Push Notifications</p>
                      <p className="text-sm text-slate-500">Receive real-time browser notifications</p>
                    </div>
                    <button
                      onClick={() => handleToggle('pushNotifications')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.pushNotifications ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Academic Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Assignment Alerts</p>
                      <p className="text-sm text-slate-500">Get notified when students submit assignments</p>
                    </div>
                    <button
                      onClick={() => handleToggle('assignmentAlerts')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.assignmentAlerts ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.assignmentAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Class Reminders</p>
                      <p className="text-sm text-slate-500">Reminders for upcoming classes</p>
                    </div>
                    <button
                      onClick={() => handleToggle('classReminders')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.classReminders ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.classReminders ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Grade Submission Deadlines</p>
                      <p className="text-sm text-slate-500">Reminders for grade submission deadlines</p>
                    </div>
                    <button
                      onClick={() => handleToggle('gradeDeadlines')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.gradeDeadlines ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.gradeDeadlines ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Student Submissions</p>
                      <p className="text-sm text-slate-500">Notifications for new student submissions</p>
                    </div>
                    <button
                      onClick={() => handleToggle('studentSubmissions')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.studentSubmissions ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.studentSubmissions ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Attendance Alerts</p>
                      <p className="text-sm text-slate-500">Notifications about attendance issues</p>
                    </div>
                    <button
                      onClick={() => handleToggle('attendanceAlerts')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.attendanceAlerts ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.attendanceAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">System Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">System Announcements</p>
                      <p className="text-sm text-slate-500">Important system-wide announcements</p>
                    </div>
                    <button
                      onClick={() => handleToggle('systemAnnouncements')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.systemAnnouncements ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.systemAnnouncements ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Meeting Reminders</p>
                      <p className="text-sm text-slate-500">Reminders for scheduled meetings</p>
                    </div>
                    <button
                      onClick={() => handleToggle('meetingReminders')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.meetingReminders ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.meetingReminders ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Deadline Warnings</p>
                      <p className="text-sm text-slate-500">Warnings for approaching deadlines</p>
                    </div>
                    <button
                      onClick={() => handleToggle('deadlineWarnings')}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        preferences.deadlineWarnings ? 'bg-purple-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        preferences.deadlineWarnings ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Notifications Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Recent Notifications</h3>
                  <p className="text-sm text-slate-500">{notifications.length} total notifications</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                  >
                    Mark All as Read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBell className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No notifications yet</p>
                    <p className="text-sm text-slate-400">You'll see notifications here when they arrive</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        !notification.isRead
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${
                          !notification.isRead ? 'bg-purple-100' : 'bg-slate-100'
                        } flex items-center justify-center`}>
                          <div className={!notification.isRead ? 'text-purple-600' : 'text-slate-500'}>
                            {getNotificationIcon(notification.type || 'default')}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`font-medium ${!notification.isRead ? 'text-slate-800' : 'text-slate-600'}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-slate-500 mt-1">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-2">
                                {formatRelativeTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="ml-2 p-1 text-purple-600 hover:bg-purple-100 rounded transition-colors"
                                title="Mark as read"
                              >
                                <FaCheck className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 