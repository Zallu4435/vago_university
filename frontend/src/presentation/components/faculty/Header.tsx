import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LuBell, LuLogOut, LuSearch, LuMoon, LuSun, LuUser } from 'react-icons/lu';
import NotificationModal from '../common/NotificationModal';
import { useNotificationManagement } from '../../../application/hooks/useNotificationManagement';

interface HeaderProps {
  currentDate: string;
  facultyName: string;
  onLogout: () => void;
}

export default function Header({ currentDate, facultyName, onLogout }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  
  // Get notifications data
  const { notifications } = useNotificationManagement();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl h-20 px-8 flex justify-between items-center shadow-lg shadow-indigo-100/50 fixed top-0 left-72 w-[calc(100%-18rem)] z-50 border-b border-white/20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-60"></div>
      
      <div className="relative z-10 flex items-center space-x-6">
        <div className="relative">
          <div className="relative">
            <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
              <img src="/images/university-logo.png" alt="VAGO Logo" className="w-8 h-8 object-contain" />
              VAGO Faculty
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-indigo-600 font-medium">{currentDate}</p>
              <div className="h-4 w-px bg-gradient-to-b from-indigo-300 to-purple-300"></div>
              <p className="text-sm text-gray-600 font-mono">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="bg-white/90 backdrop-blur-sm rounded-full pl-12 pr-6 py-3 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-lg border border-white/50"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <LuSearch size={18} className={`transition-colors duration-200 ${searchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
            </div>
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4">
                <p className="text-sm text-gray-500">Popular searches</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Students', 'Attendance', 'Grades', 'Assignments'].map((term) => (
                    <span key={term} className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-sm text-indigo-700 cursor-pointer hover:from-indigo-200 hover:to-purple-200 transition-colors">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg border border-white/50"
          >
            {isDarkMode ? (
              <LuSun size={20} className="text-yellow-500" />
            ) : (
              <LuMoon size={20} className="text-indigo-600" />
            )}
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-200 shadow-lg border border-white/50"
          >
            <LuBell size={20} className="text-pink-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                {unreadCount}
              </span>
            )}
          </button>
          
          <NotificationModal 
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full pl-2 pr-6 py-2 hover:bg-white transition-all duration-200 shadow-lg border border-white/50"
          >
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {getInitials(facultyName)}
              </div>
            </div>
            <div className="text-left">
              <span className="text-gray-800 font-semibold block">{facultyName}</span>
              <span className="text-xs text-gray-500">Faculty</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-12 w-12 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(facultyName)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{facultyName}</p>
                    <p className="text-sm text-gray-500">Faculty Member</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                {[
                  { icon: <LuUser size={16} />, label: 'My Profile', color: 'text-indigo-600', action: () => navigate('/faculty/settings') },
                  // { icon: <LuSettings size={16} />, label: 'Account Settings', color: 'text-purple-600', action: () => navigate('/faculty/settings') },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-200"
                  >
                    <span className={`${item.color}`}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button 
                    onClick={onLogout}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <LuLogOut size={16} />
                    <span className="font-medium">Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  currentDate: PropTypes.string.isRequired,
  facultyName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};