import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiMenu, FiX } from 'react-icons/fi';
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
  MdHelpCenter,
  MdLogout
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

// Group sidebar items into categories for better organization
const groupedItems = [
  {
    category: "Main",
    items: [sidebarItems[0]] // Dashboard
  },
  {
    category: "People",
    items: [sidebarItems[1], sidebarItems[2]] // User, Faculty
  },
  {
    category: "Content",
    items: [sidebarItems[3], sidebarItems[14], sidebarItems[13]] // Poster, Content, Material
  },
  {
    category: "Education",
    items: [sidebarItems[4], sidebarItems[6], sidebarItems[11]] // Diploma Courses, Diploma Completers, Course Management
  },
  {
    category: "Activities",
    items: [sidebarItems[5], sidebarItems[7], sidebarItems[8]] // Events, Clubs, Sports
  },
  {
    category: "Communication",
    items: [sidebarItems[9], sidebarItems[10], sidebarItems[12], sidebarItems[15]] // Assignment Submission, Communication Tool, Notification System, Enquiry
  }
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(
    groupedItems.map(group => group.category) // All categories expanded by default
  );

  // Handle window resize
  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    // Expand all categories when uncollapsing
    if (collapsed) {
      setExpandedCategories(groupedItems.map(group => group.category));
    }
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Function to generate a gradient based on category
  const getCategoryGradient = (category) => {
    const gradients = {
      "Main": "from-purple-500 to-purple-700",
      "People": "from-indigo-500 to-indigo-700",
      "Content": "from-fuchsia-500 to-fuchsia-700",
      "Education": "from-violet-500 to-violet-700",
      "Activities": "from-blue-500 to-blue-700",
      "Communication": "from-cyan-500 to-cyan-700"
    };
    return gradients[category] || "from-purple-500 to-purple-700";
  };

  return (
    <>
      {/* Mobile Menu Button with ghost effect */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button 
          onClick={toggleMobileSidebar} 
          className="p-3 rounded-full bg-gray-800/80 backdrop-blur-sm text-purple-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:text-purple-100 transition-all duration-300 border border-purple-500/30"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile with blur effect */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Ghost-themed Sidebar with ethereal effects */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-gray-900/80 backdrop-blur-md border-r border-purple-500/20 shadow-xl transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-72'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with ethereal ghost effect */}
          <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 text-white flex items-center justify-between h-20 px-4 relative overflow-hidden border-b border-purple-500/20">
            {/* Animated particle effects */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-purple-300/40 rounded-full blur-sm"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationName: 'floatingMist',
                    animationDuration: `${3 + Math.random() * 4}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
              
              {/* Background glow effect */}
              <div className="absolute -bottom-10 left-1/2 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl transform -translate-x-1/2"></div>
            </div>
            
            {!collapsed && (
              <div className="relative z-10 flex items-center">
                <div className="h-10 w-10 rounded-md bg-purple-500/30 flex items-center justify-center shadow-inner shadow-purple-300/10 border border-purple-400/20">
                  <MdDashboard size={24} className="text-purple-100" />
                </div>
                <h2 className="text-xl font-bold tracking-tight ml-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-100">Admin Portal</h2>
              </div>
            )}
            
            {/* {collapsed && (
              <div className="w-full flex justify-center relative z-10">
                <div className="h-10 w-10 rounded-md bg-purple-500/30 flex items-center justify-center shadow-inner shadow-purple-300/10 border border-purple-400/20">
                  <MdDashboard size={24} className="text-purple-100" />
                </div>
              </div>
            )} */}
            
            <button 
              onClick={toggleSidebar}
              className="relative z-10 p-2 rounded-full bg-purple-500/30 text-purple-100 hover:bg-purple-500/40 focus:outline-none hidden lg:flex items-center justify-center transition-all duration-200 border border-purple-400/20"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            </button>
          </div>

          {/* Search Box with ghost theme */}
          {!collapsed && (
            <div className="px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 pl-10 pr-4 rounded-xl bg-gray-800/50 border border-purple-500/30 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-sm text-gray-300 placeholder-gray-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-purple-400/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}

          {/* Sidebar Content with ethereal effects */}
          <div className="flex-1 overflow-y-auto py-2 px-2 scroll-smooth custom-scrollbar">
            <nav className="space-y-1">
              {groupedItems.map((group) => (
                <div key={group.category} className="mb-4">
                  {!collapsed && (
                    <div 
                      className={`flex items-center justify-between px-4 py-2 text-xs font-semibold cursor-pointer group mb-2`}
                      onClick={() => toggleCategory(group.category)}
                    >
                      <span className={`bg-gradient-to-r ${getCategoryGradient(group.category)} bg-clip-text text-transparent uppercase tracking-wider`}>
                        {group.category}
                      </span>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 bg-gray-800/80 border border-purple-500/20
                        ${expandedCategories.includes(group.category) ? 'bg-purple-800/30' : 'bg-gray-800/50'}
                      `}>
                        <svg 
                          className={`h-3.5 w-3.5 text-purple-300 transition-transform ${expandedCategories.includes(group.category) ? 'rotate-180' : ''}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Category divider in collapsed mode */}
                  {collapsed && (
                    <div className="my-3 border-t border-purple-500/20 mx-2"></div>
                  )}
                  
                  <div className={`space-y-1 ${!collapsed && !expandedCategories.includes(group.category) ? 'hidden' : ''}`}>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl transition-all duration-300 relative
                          ${isActive 
                            ? 'bg-gradient-to-r from-purple-900/50 to-purple-800/30 text-purple-100 font-medium border border-purple-500/30 shadow-lg shadow-purple-500/10' 
                            : 'text-gray-300 border border-transparent hover:border-purple-500/20 hover:bg-purple-900/20'}`
                        }
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setMobileOpen(false);
                          }
                        }}
                      >
                        <div className={`flex items-center ${!collapsed ? 'w-full' : ''}`}>
                          <div className={`
                            relative flex-shrink-0 p-1.5 rounded-lg transition-all duration-300
                            ${hoveredItem === item.name ? 'text-purple-200 transform scale-110' : 'text-gray-400'}
                            ${({ isActive }) => isActive ? 'text-purple-200' : ''}`
                          }>
                            {/* Glow effect behind icon when active or hovered */}
                            {(hoveredItem === item.name || (({ isActive }) => isActive)) && (
                              <span className="absolute inset-0 bg-purple-600/20 rounded-lg blur-md"></span>
                            )}
                            <span className="relative z-10">{item.icon}</span>
                          </div>
                          
                          {!collapsed && (
                            <span className={`ml-3 text-sm transition-all duration-200 ${hoveredItem === item.name ? 'font-medium' : ''}`}>
                              {item.name}
                            </span>
                          )}
                        </div>
                        
                        {!collapsed && (({ isActive }) => 
                          isActive && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-purple-400"></span>
                          )
                        )}
                        
                        {/* Animated particle effects around active item */}
                        <NavLink to={item.path} className={({ isActive }) => 
                          isActive ? "absolute" : "hidden"
                        }>
                          {({ isActive }) => isActive && [...Array(3)].map((_, i) => (
                            <span 
                              key={i} 
                              className="absolute h-1 w-1 rounded-full bg-purple-400/60 blur-sm" 
                              style={{
                                left: `${3 + (i * 3)}px`,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                animationName: 'pulse',
                                animationDuration: `${1 + i * 0.5}s`,
                                animationTimingFunction: 'ease-in-out',
                                animationIterationCount: 'infinite',
                                animationDirection: 'alternate',
                                animationDelay: `${i * 0.3}s`
                              }}
                            />
                          ))}
                        </NavLink>
                        
                        {/* Left glow indicator for active state */}
                        <NavLink to={item.path} className={({ isActive }) => 
                          isActive 
                            ? "absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-md transform -translate-y-1/2 shadow-[0_0_8px_rgba(168,85,247,0.6)]" 
                            : "hidden"
                        } />
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer with ghost theme */}
          <div className="p-4 border-t border-purple-500/20 bg-gradient-to-b from-gray-900/0 to-purple-900/30 relative overflow-hidden">
            {/* Footer background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 left-1/2 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl transform -translate-x-1/2"></div>
            </div>
            
            <div className={`flex ${collapsed ? 'flex-col items-center' : 'items-center justify-between'} relative z-10`}>
              <div className={`flex items-center ${collapsed ? 'flex-col' : ''}`}>
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-2 ring-purple-500/30">
                    <span className="text-sm font-bold text-white">JD</span>
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-gray-900"></div>
                </div>
                
                {!collapsed && (
                  <div className="ml-3">
                    <p className="font-medium text-gray-200">John Doe</p>
                    <p className="text-xs text-gray-400">admin@example.com</p>
                  </div>
                )}
              </div>
              
              {!collapsed && (
                <button className="p-2 rounded-lg text-gray-400 hover:bg-purple-900/30 hover:text-purple-300 transition-colors border border-transparent hover:border-purple-500/20">
                  <MdLogout size={20} />
                </button>
              )}
              
              {collapsed && (
                <button className="mt-2 p-2 rounded-lg text-gray-400 hover:bg-purple-900/30 hover:text-purple-300 transition-colors border border-transparent hover:border-purple-500/20">
                  <MdLogout size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Your main content goes here */}
      </div>

      {/* Custom styles for animations and scrollbar */}
      <style jsx>{`
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
        
        @keyframes pulse {
          0% {
            opacity: 0.3;
            transform: translateY(-50%) scale(0.8);
          }
          100% {
            opacity: 0.7;
            transform: translateY(-50%) scale(1.2);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </>
  );
};

export default Sidebar;