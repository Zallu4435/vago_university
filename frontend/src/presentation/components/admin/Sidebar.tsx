import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { 
  MdDashboard, 
  MdPeople, 
  MdImage, 
  MdSchool,
  MdEvent, 
  MdMilitaryTech, 
  MdGroups,
  MdSportsSoccer,
  MdAssignment,
  MdMessage,
  MdBook,
  MdNotifications,
  MdFolder,
  MdArticle,
  MdHelpCenter
} from 'react-icons/md';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin', icon: <MdDashboard size={20} /> },
  { name: 'User', path: '/admin/user', icon: <MdPeople size={20} /> },
  { name: 'Faculty', path: '/admin/faculty', icon: <MdSchool size={20} /> },
  { name: 'Poster', path: '/admin/poster', icon: <MdImage size={20} /> },
  { name: 'Diploma Courses', path: '/admin/diploma-courses', icon: <MdSchool size={20} /> },
  { name: 'Events', path: '/admin/events', icon: <MdEvent size={20} /> },
  { name: 'Diploma Completers', path: '/admin/diploma-completers', icon: <MdMilitaryTech size={20} /> },
  { name: 'Clubs', path: '/admin/clubs', icon: <MdGroups size={20} /> },
  { name: 'Sports', path: '/admin/sports', icon: <MdSportsSoccer size={20} /> },
  { name: 'Assignment Submission', path: '/admin/assignments', icon: <MdAssignment size={20} /> },
  { name: 'Communication Tool', path: '/admin/communication', icon: <MdMessage size={20} /> },
  { name: 'Course Management', path: '/admin/course-management', icon: <MdBook size={20} /> },
  { name: 'Notification System', path: '/admin/notifications', icon: <MdNotifications size={20} /> },
  { name: 'Material', path: '/admin/material', icon: <MdFolder size={20} /> },
  { name: 'Content', path: '/admin/content', icon: <MdArticle size={20} /> },
  { name: 'Enquiry', path: '/admin/enquiry', icon: <MdHelpCenter size={20} /> },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileSidebar} 
          className="p-2 rounded-md bg-blue-600 text-white shadow-md"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {!collapsed && (
              <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none hidden lg:block"
            >
              {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 text-gray-500">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className={`flex ${collapsed ? 'justify-center' : 'justify-start'} items-center text-gray-500`}>
              <MdPeople size={20} />
              {!collapsed && <span className="ml-3">Admin User</span>}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content wrapper to push content when sidebar is expanded */}
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar;