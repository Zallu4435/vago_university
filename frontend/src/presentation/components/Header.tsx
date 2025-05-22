import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { FaUserGraduate, FaUserCircle } from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "",
  onLogout,
  isAuthenticated = false
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-4 bg-gradient-to-r from-cyan-700 via-blue-600 to-cyan-400 shadow-lg border-b-4 border-cyan-300">
      <div className="flex items-center">
        <div className="w-14 h-14 mr-4 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-cyan-300">
          <SiGooglescholar className="w-8 h-8 text-cyan-600" />
        </div>
        <span className="text-white text-3xl font-extrabold tracking-widest drop-shadow-lg">ACADEMIA</span>
      </div>
      <div className="flex gap-4 items-center">
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

        {isAuthenticated ? (
          // Profile dropdown for authenticated users
          <div className="relative ml-4">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center bg-white/30 px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/40 transition shadow"
            >
              <FaUserCircle className="w-5 h-5 mr-2" />
              {userName || "User"}
              <IoMdArrowDropdown className="w-5 h-5 ml-1" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Login button for non-authenticated users
          <Link
            to="/login"
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