import React, { useState } from 'react';
import { FiBell, FiLogOut, FiUser, FiChevronDown, FiSettings, FiHelpCircle } from 'react-icons/fi';

interface AdminHeaderProps {
  adminName?: string;
  adminRole?: string;
  notificationCount?: number;
  onLogout?: () => void;
  collapsed?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminName = 'Admin User',
  adminRole = 'System Administrator',
  notificationCount = 3,
  onLogout = () => console.log('Logout clicked'),
  collapsed = false,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-900 to-blue-900 shadow-lg border-b border-purple-600/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-purple-100 text-shadow-sm">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Badge */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-purple-900/30 transition-colors relative"
                aria-label="Notifications"
              >
                <FiBell className="text-purple-300 w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Admin Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-purple-900/30 transition-colors border border-transparent hover:border-purple-600/20"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center border border-purple-600/50 shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                  <FiUser className="text-purple-100 w-4 h-4" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-purple-100">{adminName}</p>
                  <p className="text-xs text-purple-300">{adminRole}</p>
                </div>
                <FiChevronDown className="text-purple-300 w-4 h-4" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 rounded-lg shadow-2xl border border-purple-600/30 backdrop-blur-lg z-50">
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-purple-200 hover:bg-purple-900/30 hover:text-purple-100 transition-colors">
                      <FiSettings className="mr-2 text-purple-400" />
                      Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-purple-200 hover:bg-purple-900/30 hover:text-purple-100 transition-colors">
                      <FiHelpCircle className="mr-2 text-purple-400" />
                      Help
                    </button>
                    <div className="border-t border-purple-600/20 my-1" />
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-purple-200 hover:bg-purple-900/30 hover:text-purple-100 transition-colors"
                    >
                      <FiLogOut className="mr-2 text-purple-400" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/40 blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatingMist ${3 + Math.random() * 4}s ease-in-out infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .text-shadow-sm {
          text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
        }
        @keyframes floatingMist {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.6;
          }
        }
      `}</style>
    </header>
  );
};

export default AdminHeader;