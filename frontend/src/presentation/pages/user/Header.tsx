import { useState, useEffect } from 'react';
import { FaBell, FaBookOpen, FaSearch, FaBars, FaTimes, FaCog, FaQuestionCircle, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import { useNotificationManagement } from '../../../application/hooks/useNotificationManagement';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
  userName?: string;
  profilePicture?: string;
}

type DropdownAction = 'settings' | 'help' | 'logout';

export default function Header({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, onLogout, userName, profilePicture }: HeaderProps) {
  const tabs = ['Dashboard', 'Academics', 'Financial', 'Communication', 'Campus Life'];
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const { styles, theme } = usePreferences();
  const { notifications, markAsRead, getNotificationDetails } = useNotificationManagement();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleDropdownAction = (action: DropdownAction) => {
    if (action === 'logout') {
      onLogout();
    } else if (action === 'settings') {
      navigate('/settings');
    } else if (action === 'help') {
      navigate('/help');
    }
    setIsProfileDropdownOpen(false);
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const details = await getNotificationDetails(notificationId);
      if (details) {
        // Navigate to the appropriate page based on notification type
        if (details.type === 'course') {
          navigate(`/courses/${details.courseId}`);
        } else if (details.type === 'assignment') {
          navigate(`/assignments/${details.assignmentId}`);
        }
        // Mark as read after viewing
        await markAsRead(notificationId);
        setIsNotificationOpen(false);
      }
    } catch (error) {
      console.error('Error handling notification:', error);
      toast.error('Failed to open notification');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;


  return (
    <header className={`relative z-[9998] ${styles.backgroundSecondary} shadow-2xl border-b ${styles.borderSecondary}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br ${styles.orb.secondary} rounded-full blur-xl animate-pulse`}></div>
        <div className={`absolute top-8 right-16 w-16 h-16 bg-gradient-to-br ${styles.orb.primary} rounded-full blur-lg animate-pulse delay-700`}></div>
        <div className={`absolute bottom-4 left-1/3 w-20 h-20 bg-gradient-to-br ${styles.orb.secondary} rounded-full blur-xl animate-pulse delay-1000`}></div>
      </div>
      
      {/* Main gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${styles.accent} opacity-20 backdrop-blur-md`}></div>
      
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-all duration-300`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaBookOpen className="text-white relative z-10" size={20} />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div className="hidden md:block">
              <h1 className={`text-2xl font-bold ${theme == 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                University Portal
              </h1>
              <div className={`h-0.5 w-0 bg-gradient-to-r ${styles.accent} group-hover:w-full transition-all duration-500`}></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${styles.orb.primary} rounded-full blur opacity-25 group-hover:opacity-75 transition-opacity duration-300`}></div>
              <div className={`relative ${styles.card.background} backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border ${styles.border}`}>
                <div className="flex items-center space-x-3">
                  <FaSearch className={`${styles.icon.primary} group-hover:scale-110 transition-transform duration-200`} size={18} />
                  <input 
                    type="text"
                    placeholder="Search anything..."
                    className={`bg-transparent ${styles.textPrimary} placeholder-${styles.textSecondary.replace('text-', '')} focus:outline-none w-64 font-medium`}
                    aria-label="Search"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Icons & User Section */}
          <div className="flex items-center space-x-5">
            {/* Notification Bell */}
            <div className="relative group">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-3 rounded-xl ${styles.card.background} backdrop-blur-md ${styles.card.hover} transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`} 
                aria-label="Notifications"
              >
                <FaBell className={`${styles.icon.primary} group-hover:scale-110 transition-transform duration-200`} size={20} />
                {unreadCount > 0 && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br ${styles.status.error} rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg animate-pulse`}>
                    {unreadCount}
                  </div>
                )}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${styles.orb.primary} opacity-0 group-hover:opacity-10 transition-all duration-300`}></div>
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className={`absolute right-0 mt-3 w-96 ${styles.card.background} backdrop-blur-xl rounded-2xl shadow-2xl z-50 border ${styles.border}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundSecondary} opacity-50`}></div>
                  <div className="relative z-10">
                    <div className={`px-4 py-3 border-b ${styles.borderSecondary} flex justify-between items-center`}>
                      <h3 className={`font-medium ${styles.textPrimary}`}>Notifications</h3>
                      <span className={`text-sm ${styles.textSecondary}`}>{notifications.length} total</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className={`px-4 py-6 text-center ${styles.textSecondary}`}>
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification._id)}
                            className={`w-full text-left px-4 py-3 hover:bg-opacity-50 transition-all duration-200 ${
                              !notification.isRead ? `${styles.card.background} bg-opacity-50` : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                                !notification.isRead ? `${styles.status.primary}` : `${styles.textSecondary}`
                              }`} />
                              <div className="flex-1">
                                <p className={`font-medium ${styles.textPrimary}`}>
                                  {notification.title}
                                </p>
                                <p className={`text-sm ${styles.textSecondary} mt-1`}>
                                  {notification.message}
                                </p>
                                <p className={`text-xs ${styles.textSecondary} mt-2`}>
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className={`hidden md:flex items-center space-x-3 ${styles.card.background} backdrop-blur-xl rounded-2xl px-4 py-2 ${styles.card.hover} transition-all duration-300 shadow-lg hover:shadow-xl group border ${styles.border}`}
                aria-label="User Profile"
              >
                <div className="relative">
                  <div className={`bg-gradient-to-br ${styles.accent} rounded-full w-10 h-10 flex items-center justify-center shadow-lg`}>
                    {profilePicture ? (
                      <img src={profilePicture} alt="User" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUserAlt className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${styles.orb.primary} rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
                <span className={`${styles.textPrimary} font-medium group-hover:scale-105 transition-transform duration-200`}>{userName || 'John Doe'}</span>
                <div className={`w-2 h-2 bg-gradient-to-br ${styles.accent} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200`}></div>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className={`absolute right-0 mt-3 w-56 ${styles.card.background} backdrop-blur-xl rounded-2xl shadow-2xl z-50 border ${styles.border}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundSecondary} opacity-50`}></div>
                  <div className="relative z-10">
                    <div className={`px-4 py-3 border-b ${styles.borderSecondary}`}>
                      <p className={`text-sm ${styles.textSecondary}`}>Signed in as</p>
                      <p className={`font-medium ${styles.textPrimary}`}>{userName || 'John Doe'}</p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <button
                          onClick={() => handleDropdownAction('settings')}
                          className={`w-full flex items-center space-x-3 px-4 py-3 ${styles.textPrimary} ${styles.card.hover} transition-all duration-200 group`}
                        >
                          <div className={`p-1.5 rounded-lg ${styles.button.secondary}`}>
                            <FaCog className={`${styles.icon.primary}`} size={14} />
                          </div>
                          <span className="font-medium">Settings</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDropdownAction('help')}
                          className={`w-full flex items-center space-x-3 px-4 py-3 ${styles.textPrimary} ${styles.card.hover} transition-all duration-200 group`}
                        >
                          <div className={`p-1.5 rounded-lg ${styles.button.secondary}`}>
                            <FaQuestionCircle className={`${styles.icon.primary}`} size={14} />
                          </div>
                          <span className="font-medium">Help & Support</span>
                        </button>
                      </li>
                      <li className={`border-t ${styles.borderSecondary} mt-2 pt-2`}>
                        <button
                          onClick={() => handleDropdownAction('logout')}
                          className={`w-full flex items-center space-x-3 px-4 py-3 ${styles.status.error} ${styles.card.hover} transition-all duration-200 group`}
                        >
                          <div className={`p-1.5 rounded-lg bg-opacity-10`} style={{ backgroundColor: styles.status.error.replace('text-', 'bg-') + '/10' }}>
                            <FaSignOutAlt className={`${styles.status.error}`} size={14} />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-3 rounded-xl ${styles.card.background} backdrop-blur-md ${styles.card.hover} transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen 
                ? <FaTimes className={`${styles.icon.primary}`} size={20} /> 
                : <FaBars className={`${styles.icon.primary}`} size={20} />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block mt-6">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${styles.accent} opacity-20 rounded-2xl blur-sm`}></div>
            <ul className={`relative flex space-x-8 ${styles.card.background} backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border ${styles.border}`}>
              {tabs.map((tab) => (
                <li key={tab} className="relative">
                  <button 
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab 
                        ? `${styles.button.primary} shadow-lg transform scale-105` 
                        : `${styles.textPrimary} ${styles.card.hover}`
                    }`}
                  >
                    {activeTab === tab && (
                      <div className={`absolute -inset-1 bg-gradient-to-r ${styles.orb.primary} rounded-xl blur opacity-75`}></div>
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full ${styles.card.background} backdrop-blur-xl shadow-2xl z-[9999] border-t ${styles.borderSecondary}`}>
            <div className="p-6">
              <div className="space-y-3">
                {tabs.map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? `${styles.button.primary} shadow-lg transform scale-105`
                        : `${styles.textPrimary} ${styles.card.hover}`
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                
                <div className={`border-t ${styles.borderSecondary} pt-4 mt-4 space-y-2`}>
                  <button
                    onClick={() => handleDropdownAction('settings')}
                    className={`w-full text-left px-5 py-3 rounded-xl ${styles.textPrimary} ${styles.card.hover} transition-all duration-300 font-medium`}
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleDropdownAction('help')}
                    className={`w-full text-left px-5 py-3 rounded-xl ${styles.textPrimary} ${styles.card.hover} transition-all duration-300 font-medium`}
                  >
                    Help & Support
                  </button>
                  <button
                    onClick={() => handleDropdownAction('logout')}
                    className={`w-full text-left px-5 py-3 rounded-xl ${styles.status.error} ${styles.card.hover} transition-all duration-300 font-medium`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}