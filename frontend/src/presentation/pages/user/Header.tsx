import { useState } from 'react';
import { FaBell, FaBookOpen, FaSearch, FaBars, FaTimes, FaCog, FaQuestionCircle, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleDropdownAction = (action: DropdownAction) => {
    if (action === 'logout') {
      onLogout();
    } else if (action === 'settings') {
      navigate('/settings');
    }
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="relative z-[9998] bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-2xl border-b border-amber-200/50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-8 right-16 w-16 h-16 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-gradient-to-br from-orange-200/25 to-amber-200/25 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-100/95 via-orange-50/95 to-amber-100/95 backdrop-blur-md"></div>
      
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaBookOpen className="text-white relative z-10" size={20} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                University Portal
              </h1>
              <div className="h-0.5 w-0 bg-gradient-to-r from-orange-400 to-amber-500 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full blur opacity-25 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/50">
                <div className="flex items-center space-x-3">
                  <FaSearch className="text-orange-500 group-hover:text-orange-600 transition-colors duration-200" size={18} />
                  <input 
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none w-64 font-medium"
                    aria-label="Search"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Icons & User Section */}
          <div className="flex items-center space-x-5">
            {/* Enhanced Notification Bell */}
            <div className="relative group">
              <button className="relative p-3 rounded-xl bg-white/60 backdrop-blur-md hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" aria-label="Notifications">
                <FaBell className="text-orange-500 group-hover:text-orange-600 transition-colors duration-200" size={20} />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg animate-pulse">
                  3
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/0 to-amber-500/0 group-hover:from-orange-400/10 group-hover:to-amber-500/10 transition-all duration-300"></div>
              </button>
            </div>

            {/* Enhanced Profile Section */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="hidden md:flex items-center space-x-3 bg-white/70 backdrop-blur-xl rounded-2xl px-4 py-2 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl group border border-white/50"
                aria-label="User Profile"
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                    {profilePicture ? (
                      <img src={profilePicture} alt="User" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <FaUserAlt className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="text-gray-800 font-medium group-hover:text-gray-900 transition-colors duration-200">{userName || 'John Doe'}</span>
                <div className="w-2 h-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>

              {/* Enhanced Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 border border-white/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50"></div>
                  <div className="relative z-10">
                    <div className="px-4 py-3 border-b border-orange-100/50">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="font-medium text-gray-800">{userName || 'John Doe'}</p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <button
                          onClick={() => handleDropdownAction('settings')}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange-50/70 transition-all duration-200 group"
                        >
                          <div className="p-1.5 rounded-lg bg-orange-100/50 group-hover:bg-orange-200/50 transition-colors duration-200">
                            <FaCog className="text-orange-500" size={14} />
                          </div>
                          <span className="font-medium">Settings</span>
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDropdownAction('help')}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange-50/70 transition-all duration-200 group"
                        >
                          <div className="p-1.5 rounded-lg bg-orange-100/50 group-hover:bg-orange-200/50 transition-colors duration-200">
                            <FaQuestionCircle className="text-orange-500" size={14} />
                          </div>
                          <span className="font-medium">Help & Support</span>
                        </button>
                      </li>
                      <li className="border-t border-orange-100/50 mt-2 pt-2">
                        <button
                          onClick={() => handleDropdownAction('logout')}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <div className="p-1.5 rounded-lg bg-red-100/50 group-hover:bg-red-200/50 transition-colors duration-200">
                            <FaSignOutAlt className="text-red-500" size={14} />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 rounded-xl bg-white/60 backdrop-blur-md hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen 
                ? <FaTimes className="text-orange-500" size={20} /> 
                : <FaBars className="text-orange-500" size={20} />}
            </button>
          </div>
        </div>

        {/* Enhanced Desktop Navigation */}
        <nav className="hidden md:block mt-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-100/30 to-transparent rounded-2xl blur-sm"></div>
            <ul className="relative flex space-x-8 bg-white/40 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-white/50">
              {tabs.map((tab) => (
                <li key={tab} className="relative">
                  <button 
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab 
                        ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg transform scale-105' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    {activeTab === tab && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl blur opacity-75"></div>
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Enhanced Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl shadow-2xl z-[9999] border-t border-orange-100/50">
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
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-700 hover:bg-orange-50/70 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                
                <div className="border-t border-orange-100/50 pt-4 mt-4 space-y-2">
                  <button
                    onClick={() => handleDropdownAction('settings')}
                    className="w-full text-left px-5 py-3 rounded-xl text-gray-700 hover:bg-orange-50/70 transition-all duration-300 font-medium"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleDropdownAction('help')}
                    className="w-full text-left px-5 py-3 rounded-xl text-gray-700 hover:bg-orange-50/70 transition-all duration-300 font-medium"
                  >
                    Help & Support
                  </button>
                  <button
                    onClick={() => handleDropdownAction('logout')}
                    className="w-full text-left px-5 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 font-medium"
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