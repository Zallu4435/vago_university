import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';


const AdminLayout = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const handleLogout = () => {
    console.log("Logging out...");
    dispatch(logout());
    navigate('/login')
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main layout content wrapper */}
      <div className="flex flex-col flex-1">
        {/* Fixed header should be outside of scrollable/main content */}
        <div className="fixed top-0 left-[287px] right-0 z-50">
          <AdminHeader 
            adminName={fullName}
            adminRole="System Administrator"
            notificationCount={5}
            onLogout={handleLogout}
          />
        </div>

        {/* Scrollable main content */}
        <main className="flex-1 mt-[72px]"> {/* Adjust mt to match header height */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;







import React, { useState } from 'react';
import { 
  FiBell, 
  FiLogOut, 
  FiUser, 
  FiChevronDown, 
  FiSettings, 
  FiHelpCircle
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { RootState } from '../redux/store';

const AdminHeader = ({ 
  adminName = "Admin User",
  adminRole = "System Administrator",
  notificationCount = 3,
  onLogout = () => console.log("Logout clicked")
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  return (
    <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-md border-b border-purple-800/30">
      <div className="container mx-auto px-4 py-4.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white text-shadow-sm">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Simple Notification Badge */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-purple-800/30 transition-colors relative"
                aria-label="Notifications"
              >
                <FiBell className="text-purple-200 w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center z-[9990]">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Admin Profile */}
            <div className="relative">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-purple-800/30 transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600/40 flex items-center justify-center border border-purple-500/50 shadow-sm">
                  <FiUser className="text-purple-200 w-4 h-4" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{adminName}</p>
                  <p className="text-xs text-purple-300">{adminRole}</p>
                </div>
                <FiChevronDown className="text-purple-300 w-4 h-4" />
              </button>
              
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-purple-500/30 backdrop-blur-sm z-50">
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-purple-800/30 transition-colors">
                      <FiSettings className="mr-2 text-purple-400" />
                      Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-purple-800/30 transition-colors">
                      <FiHelpCircle className="mr-2 text-purple-400" />
                      Help
                    </button>
                    <div className="border-t border-purple-500/20 my-1"></div>
                    <button 
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-purple-800/30 transition-colors"
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
      
      <style jsx>{`
        .text-shadow-sm {
          text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </header>
  );
};

