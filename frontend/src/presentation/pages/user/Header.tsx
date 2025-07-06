import { useState, useEffect, useRef } from 'react';
import { FaBell, FaBookOpen, FaSearch, FaBars, FaTimes, FaCog, FaQuestionCircle, FaSignOutAlt, FaUserAlt, FaExchangeAlt, FaChalkboardTeacher, FaTachometerAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePreferences } from '../../context/PreferencesContext';
import { useNotificationManagement } from '../../../application/hooks/useNotificationManagement';
import NotificationModal from '../../components/NotificationModal';

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
  const dashboardTabs = ['Dashboard', 'Academics', 'Financial', 'Communication', 'Campus Life'];
  const canvasTabs = ['Dashboard', 'Diploma Course', 'Chat', 'Video Class', 'Materials', 'Assignments'];
  const location = useLocation();
  const navigate = useNavigate();
  const { styles, theme } = usePreferences();
  const { notifications } = useNotificationManagement();
  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Determine which tabs to show based on URL
  const isCanvas = location.pathname.includes('/canvas');
  const tabs = isCanvas ? canvasTabs : dashboardTabs;
  const portalName = isCanvas ? 'Student Canvas' : 'University Portal';

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



  const handlePortalToggle = () => {
    if (isCanvas) {
      navigate('/dashboard');
    } else {
      navigate('/canvas');
    }
  };

  const unreadCount = notifications.filter(n => !(n as any).isRead).length;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Close profile dropdown if clicking outside
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }



      // Close mobile menu if clicking outside
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [mobileMenuOpen]);

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

      <div className="container mx-auto py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-3 group">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-all duration-300`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaBookOpen className="text-white relative z-10" size={20} />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div className="hidden md:block">
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                {portalName}
              </h1>
              <div className={`h-0.5 w-0 bg-gradient-to-r ${styles.accent} group-hover:w-full transition-all duration-500`}></div>
            </div>
          </div>

          {/* Mobile Menu Button - Left Side */}
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-3 rounded-xl ${styles.card.background} backdrop-blur-md ${styles.card.hover} transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen
              ? <FaTimes className={`${styles.icon.primary}`} size={20} />
              : <FaBars className={`${styles.icon.primary}`} size={20} />}
          </button>

          {/* Mobile Portal Toggle - Between Menu and Notifications */}
          <div className="relative group md:hidden flex-1 mx-2">
            <button
              onClick={handlePortalToggle}
              className={`relative w-full px-4 py-3 rounded-xl ${styles.card.background} backdrop-blur-md ${styles.card.hover} transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2`}
              aria-label={`Switch to ${isCanvas ? 'Dashboard' : 'Canvas'}`}
            >
              <div className={`p-1.5 rounded-xl bg-gradient-to-br ${isCanvas ? 'from-purple-500 to-blue-500' : 'from-blue-500 to-indigo-500'} shadow-lg`}>
                {isCanvas ? (
                  <FaTachometerAlt className="text-white w-4 h-4" />
                ) : (
                  <FaChalkboardTeacher className="text-white w-4 h-4" />
                )}
              </div>
              <span className={`text-sm font-medium ${styles.textPrimary}`}>
                {isCanvas ? 'Dashboard' : 'Canvas'}
              </span>
            </button>
          </div>

          {/* Center Section - Search Bar & Portal Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
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

            {/* Portal Toggle Button */}
            <div className="relative group">
              <div className={`absolute -inset-1 bg-gradient-to-r ${isCanvas ? 'from-purple-400 to-blue-400' : 'from-blue-400 to-indigo-400'} rounded-2xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-300`}></div>
              <button
                onClick={handlePortalToggle}
                className={`relative ${styles.card.background} backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg border ${styles.border} ${styles.card.hover} transition-all duration-300 hover:shadow-xl transform hover:scale-105 group`}
                aria-label={`Switch to ${isCanvas ? 'Dashboard' : 'Canvas'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${isCanvas ? 'from-purple-500 to-blue-500' : 'from-blue-500 to-indigo-500'} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    {isCanvas ? (
                      <FaTachometerAlt className="text-white w-4 h-4" />
                    ) : (
                      <FaChalkboardTeacher className="text-white w-4 h-4" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${styles.textPrimary} group-hover:scale-105 transition-transform duration-200`}>
                      {isCanvas ? 'Go to Dashboard' : 'Go to Canvas'}
                    </span>
                    <FaExchangeAlt className={`${styles.icon.primary} w-3 h-3 group-hover:rotate-180 transition-transform duration-300`} />
                  </div>
                </div>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${isCanvas ? 'from-purple-500/10 to-blue-500/10' : 'from-blue-500/10 to-indigo-500/10'} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
              </button>
            </div>
          </div>

          {/* Icons & User Section */}
          <div className="flex items-center space-x-3 md:space-x-5">
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

              {/* Notification Modal */}
              <NotificationModal 
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                styles={styles}
              />
            </div>

            {/* Mobile Profile Icon */}
            <div className="relative md:hidden">
              <button
                onClick={toggleProfileDropdown}
                className={`relative p-3 rounded-xl ${styles.card.background} backdrop-blur-md ${styles.card.hover} transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}
                aria-label="User Profile"
              >
                <div className="relative">
                  <div className={`bg-gradient-to-br ${styles.accent} rounded-full w-6 h-6 flex items-center justify-center shadow-lg`}>
                    {profilePicture ? (
                      <img src={profilePicture} alt="User" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUserAlt className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${styles.orb.primary} rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </button>

              {/* Mobile Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div ref={profileDropdownRef} className={`absolute right-0 mt-3 w-64 ${styles.card.background} backdrop-blur-xl rounded-2xl shadow-2xl z-50 border ${styles.border}`}>
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

            {/* Profile Section - Desktop Only */}
            <div className="relative hidden md:block">
              <button
                onClick={toggleProfileDropdown}
                className={`flex items-center space-x-3 ${styles.card.background} backdrop-blur-xl rounded-2xl px-4 py-2 ${styles.card.hover} transition-all duration-300 shadow-lg hover:shadow-xl group border ${styles.border}`}
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
                <div ref={profileDropdownRef} className={`absolute right-0 mt-3 w-56 ${styles.card.background} backdrop-blur-xl rounded-2xl shadow-2xl z-50 border ${styles.border}`}>
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
          <div ref={mobileMenuRef} className={`md:hidden absolute top-full left-0 w-full ${styles.card.background} backdrop-blur-xl rounded-2xl shadow-2xl z-[9999] border ${styles.border} mt-3`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundSecondary} opacity-50`}></div>
            <div className="relative z-10 p-6">
              {/* Mobile Search Bar */}
              <div className="mb-6">
                <div className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${styles.orb.primary} rounded-full blur opacity-25 group-hover:opacity-75 transition-opacity duration-300`}></div>
                  <div className={`relative ${styles.card.background} backdrop-blur-xl rounded-full px-4 py-3 shadow-lg border ${styles.border}`}>
                    <div className="flex items-center space-x-3">
                      <FaSearch className={`${styles.icon.primary} group-hover:scale-110 transition-transform duration-200`} size={18} />
                      <input
                        type="text"
                        placeholder="Search anything..."
                        className={`bg-transparent ${styles.textPrimary} placeholder-${styles.textSecondary.replace('text-', '')} focus:outline-none w-full font-medium`}
                        aria-label="Search"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}