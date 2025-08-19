import { useState, useEffect } from 'react';
import { FaCog, FaBell, FaGlobe, FaPalette, FaClock, FaLanguage } from 'react-icons/fa';
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi';

export default function FacultyPreferenceSettings() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    assignmentAlerts: true,
    classReminders: true,
    gradeDeadlines: true,
    systemAnnouncements: false,
    
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    officeHours: '9:00 AM - 5:00 PM',
    consultationMode: 'email',
    autoAttendance: true,
    gradeVisibility: 'immediate',
    
    profileVisibility: 'department',
    contactVisibility: 'students',
    availabilityStatus: true
  });

  const [toast, setToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showSuccessToast = (message = 'Preferences updated') => {
    setToast({ message });
  };

  const handleToggle = (key: string) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: !prev[key as keyof typeof prev] };
      return next;
    });
    showSuccessToast();
  };

  const handleSelect = (key: string, value: string) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: value };
      return next;
    });
    showSuccessToast();
  };

  return (
    <div className="flex-1 p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-slate-50 p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-sm">
              <FaCog className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Preferences</h1>
              <p className="text-slate-600">Customize your faculty portal experience</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <FaBell className="w-3 h-3 text-white" />
              </div>
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.emailNotifications ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Push Notifications</p>
                  <p className="text-sm text-slate-500">Receive real-time browser notifications</p>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.pushNotifications ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Assignment Alerts</p>
                  <p className="text-sm text-slate-500">Get notified when students submit assignments</p>
                </div>
                <button
                  onClick={() => handleToggle('assignmentAlerts')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.assignmentAlerts ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Class Reminders</p>
                  <p className="text-sm text-slate-500">Reminders for upcoming classes</p>
                </div>
                <button
                  onClick={() => handleToggle('classReminders')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.classReminders ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Grade Submission Deadlines</p>
                  <p className="text-sm text-slate-500">Reminders for grade submission deadlines</p>
                </div>
                <button
                  onClick={() => handleToggle('gradeDeadlines')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.gradeDeadlines ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">System Announcements</p>
                  <p className="text-sm text-slate-500">Receive system-wide announcements</p>
                </div>
                <button
                  onClick={() => handleToggle('systemAnnouncements')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.systemAnnouncements ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <FaPalette className="w-3 h-3 text-white" />
              </div>
              Display Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaPalette className="w-4 h-4 mr-2 text-slate-500" />
                  Theme
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handleSelect('theme', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaLanguage className="w-4 h-4 mr-2 text-slate-500" />
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handleSelect('language', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaGlobe className="w-4 h-4 mr-2 text-slate-500" />
                  Timezone
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handleSelect('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="MST">Mountain Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaClock className="w-4 h-4 mr-2 text-slate-500" />
                  Time Format
                </label>
                <select
                  value={preferences.timeFormat}
                  onChange={(e) => handleSelect('timeFormat', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <FaCog className="w-3 h-3 text-white" />
              </div>
              Teaching Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaClock className="w-4 h-4 mr-2 text-slate-500" />
                  Office Hours
                </label>
                <input
                  type="text"
                  value={preferences.officeHours}
                  onChange={(e) => handleSelect('officeHours', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaCog className="w-4 h-4 mr-2 text-slate-500" />
                  Consultation Mode
                </label>
                <select
                  value={preferences.consultationMode}
                  onChange={(e) => handleSelect('consultationMode', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="email">Email</option>
                  <option value="chat">Chat</option>
                  <option value="video">Video Call</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Auto Attendance</p>
                  <p className="text-sm text-slate-500">Automatically track student attendance</p>
                </div>
                <button
                  onClick={() => handleToggle('autoAttendance')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.autoAttendance ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaCog className="w-4 h-4 mr-2 text-slate-500" />
                  Grade Visibility
                </label>
                <select
                  value={preferences.gradeVisibility}
                  onChange={(e) => handleSelect('gradeVisibility', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="immediate">Immediate</option>
                  <option value="after_deadline">After Deadline</option>
                  <option value="manual">Manual Release</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <FaCog className="w-3 h-3 text-white" />
              </div>
              Privacy Preferences
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaCog className="w-4 h-4 mr-2 text-slate-500" />
                  Profile Visibility
                </label>
                <select
                  value={preferences.profileVisibility}
                  onChange={(e) => handleSelect('profileVisibility', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="public">Public</option>
                  <option value="department">Department Only</option>
                  <option value="students">Students Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium flex items-center">
                  <FaCog className="w-4 h-4 mr-2 text-slate-500" />
                  Contact Information Visibility
                </label>
                <select
                  value={preferences.contactVisibility}
                  onChange={(e) => handleSelect('contactVisibility', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="public">Public</option>
                  <option value="students">Students Only</option>
                  <option value="department">Department Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Show Availability Status</p>
                  <p className="text-sm text-slate-500">Display your online/offline status to students</p>
                </div>
                <button
                  onClick={() => handleToggle('availabilityStatus')}
                  className="text-2xl text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {preferences.availabilityStatus ? <FiToggleRight /> : <FiToggleLeft />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 p-4 rounded-lg border shadow-lg z-50 bg-green-50 border-green-200 text-green-800">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-4 text-green-700 hover:text-green-900">✕</button>
          </div>
        </div>
      )}
    </div>
  );
} 