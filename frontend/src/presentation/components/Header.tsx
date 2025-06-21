import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { IoSchool } from 'react-icons/io5';
import { FaUserGraduate, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import { FiLogOut, FiLogIn } from 'react-icons/fi';
import { IoMdArrowDropdown } from 'react-icons/io';

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
  isAuthenticated?: boolean;
  layoutType?: 'public' | 'ug' | 'department';
  hideNavLinks?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userName = '',
  onLogout,
  isAuthenticated = false,
  layoutType = 'public',
  hideNavLinks = false,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine the login route based on layoutType
  const loginRoute = layoutType === 'ug' ? '/ug/login' : layoutType === 'department' ? `/departments/computer-science/login` : '/login';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-4 bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 shadow-lg border-b-4 border-cyan-300">
      <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
        <div className="w-14 h-14 mr-4 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-300">
          <SiGooglescholar className="w-8 h-8 text-cyan-600" />
        </div>
        <span className="text-white text-3xl font-extrabold tracking-widest drop-shadow-lg">ACADEMIA</span>
      </Link>
      <div className="flex gap-4 items-center">
        {!hideNavLinks && (
          <>
            <Link
              to="/dashboard"
              className="flex items-center bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition shadow"
            >
              <MdDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/canvas"
              className="flex items-center bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition shadow"
            >
              <IoSchool className="w-5 h-5 mr-2" />
              Canvas
            </Link>
            <Link
              to="/faculty"
              className="flex items-center bg-white/20 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/30 transition shadow"
            >
              <FaUserGraduate className="w-5 h-5 mr-2" />
              Faculty
            </Link>
          </>
        )}
        {isAuthenticated ? (
          <div className="relative ml-4" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center bg-white/30 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/40 transition shadow"
            >
              <FaUserCircle className="w-5 h-5 mr-2" />
              {userName || 'User'}
              <IoMdArrowDropdown className="w-5 h-5 ml-1" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-gradient-to-br from-cyan-700 to-blue-600 rounded-xl shadow-2xl py-2 z-50 border border-cyan-300/30 backdrop-blur-sm">
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 text-white hover:bg-white/20 transition-colors"
                >
                  <FaCog className="w-5 h-5 mr-3 text-cyan-200" />
                  <span className="font-medium">Settings</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center w-full px-4 py-3 text-white hover:bg-white/20 transition-colors"
                >
                  <FaSignOutAlt className="w-5 h-5 mr-3 text-cyan-200" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to={loginRoute}
            state={{ fromLayout: layoutType }} // Pass the layoutType as state
            className="flex items-center bg-white/30 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/40 transition shadow ml-4"
          >
            <FiLogIn className="w-5 h-5 mr-2" />
            Login
          </Link>
        )}
      </div>
    </header>
  );
};