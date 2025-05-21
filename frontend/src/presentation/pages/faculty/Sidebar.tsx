import PropTypes from 'prop-types';
import { LuList, LuClock, LuCalendar, LuUsers, LuBookOpen, LuSettings, LuLogOut, LuGraduationCap, LuChevronRight } from 'react-icons/lu';

export default function Sidebar({ activeTab, setActiveTab, facultyName, department }) {
  const navItems = [
    { title: 'Dashboard', icon: <LuList size={20} /> },
    { title: 'My Sessions', icon: <LuClock size={20} /> },
    { title: 'Attendance', icon: <LuCalendar size={20} /> },
    { title: 'Students', icon: <LuUsers size={20} /> },
    { title: 'Attendance Summary', icon: <LuBookOpen size={20} /> },
    { title: 'Settings', icon: <LuSettings size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-indigo-900 to-purple-900 shadow-xl z-20">
      <div className="flex items-center justify-center py-6 px-4 border-b border-indigo-800">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-10 w-10 rounded-md flex items-center justify-center">
              <LuGraduationCap size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">EduDashboard</h1>
            <p className="text-indigo-200 text-xs">Faculty Portal</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-6">
        <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              PJ
            </div>
            <div>
              <h3 className="text-white font-medium">{facultyName}</h3>
              <p className="text-indigo-200 text-sm">{department}</p>
            </div>
          </div>
        </div>
        <p className="text-indigo-300 text-xs uppercase font-medium tracking-wider mb-2 px-3">Main Menu</p>
        <nav>
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveTab(item.title)}
                  className={`flex items-center w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.title
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg shadow-indigo-900/30'
                      : 'text-indigo-100 hover:bg-white/10'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.title}
                  {activeTab === item.title && (
                    <span className="ml-auto">
                      <LuChevronRight size={16} />
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-6 border-t border-indigo-800 mt-6">
          <button className="flex items-center w-full text-left px-4 py-3 rounded-xl text-indigo-100 hover:bg-white/10 transition-all duration-200">
            <span className="mr-3">
              <LuLogOut size={20} />
            </span>
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  facultyName: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
};