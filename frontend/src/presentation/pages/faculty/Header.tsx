import { useState } from 'react';
import PropTypes from 'prop-types';
import { LuBell, LuLogOut } from 'react-icons/lu';

export default function Header({ currentDate, facultyName }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white h-20 px-8 flex justify-between items-center shadow-sm fixed top-0 left-72 w-[calc(100%-18rem)] z-10 box-border">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-purple-500">{currentDate}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 text-gray-400"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="relative">
          <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors relative">
            <LuBell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 bg-gray-100 rounded-full pl-2 pr-4 py-1 hover:bg-gray-200 transition-colors"
          >
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold">
              PJ
            </div>
            <span className="text-gray-700 text-sm font-medium">{facultyName}</span>
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                My Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                Account Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center"
              >
                <LuLogOut size={16} className="mr-2" /> Log Out
              </a>
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
};