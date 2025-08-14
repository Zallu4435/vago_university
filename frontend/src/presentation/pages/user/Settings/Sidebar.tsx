import {
    FaUser,
    FaGraduationCap,
    FaUserAlt,
    FaCog,
  } from 'react-icons/fa';
  import {
    FiLogOut,
  } from 'react-icons/fi';

export default function Sidebar({ activeTab, setActiveTab, onLogout, onLogoutAll, user }: { activeTab: string, setActiveTab: (tab: string) => void, onLogout: () => void, onLogoutAll: () => void, user: any }) {
    const sidebarItems = [ 
        { id: 'profile', icon: FaUser, label: 'Profile', active: true },
        { id: 'preferences', icon: FaCog, label: 'Preferences' }
      ];
    

  return (
    <div className="w-72 p-6 bg-slate-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
        <div className="p-6 text-center border-b border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-sky-500 flex items-center justify-center shadow-sm">
            <FaGraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">EduPortal</h2>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 transition-colors duration-200 ${
                      isActive ? 'text-sky-600' : 'text-slate-500 group-hover:text-slate-600'
                    }`} />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && (
                      <div className="absolute right-3 w-2 h-2 bg-sky-500 rounded-full"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center mb-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center mr-3 shadow-sm">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="User" className="w-full h-full rounded-lg object-cover" />
              ) : (
                <FaUserAlt className="w-5 h-5 text-sky-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
          >
            <FiLogOut className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <button
            onClick={onLogoutAll}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 rounded-lg transition-all duration-200 border border-orange-200 hover:border-orange-300 mt-2"
          >
            <FiLogOut className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Logout All Devices</span>
          </button>
        </div>
      </div>
    </div>
  );
};