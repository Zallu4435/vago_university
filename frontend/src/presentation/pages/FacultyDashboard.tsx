import { useState } from 'react';
import { 
  LuCalendar, 
  LuUsers, 
  LuClock, 
  LuBookOpen, 
  LuList, 
  LuBell, 
  LuSettings, 
  LuLogOut 
} from 'react-icons/lu';

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Sample faculty data
  const facultyName = "Prof. Johnson";
  const currentDate = "Thursday, May 16, 2025";
  
  const stats = [
    { title: "Total Sessions", value: "24" },
    { title: "Upcoming Sessions", value: "3" },
    { title: "Total Students", value: "87" }
  ];
  
  const upcomingSessions = [
    { 
      title: "Advanced Database Systems", 
      time: "Today, 2:00 PM - 3:30 PM", 
      room: "Room 302" 
    },
    { 
      title: "Computer Networks", 
      time: "Tomorrow, 10:00 AM - 11:30 AM", 
      room: "Room 201" 
    },
    { 
      title: "Data Structures", 
      time: "May 18, 1:00 PM - 2:30 PM", 
      room: "Room 105" 
    }
  ];
  
  const navItems = [
    { title: "Dashboard", icon: <LuList size={20} /> },
    { title: "My Sessions", icon: <LuClock size={20} /> },
    { title: "Attendance", icon: <LuCalendar size={20} /> },
    { title: "Students", icon: <LuUsers size={20} /> },
    { title: "Attendance Summary", icon: <LuBookOpen size={20} /> },
    { title: "Settings", icon: <LuSettings size={20} /> }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Header - Top bar */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-700 flex justify-between items-center px-6 py-3 h-16 z-10">
        <h1 className="text-xl font-medium text-white">Faculty Dashboard</h1>
        <div className="flex items-center">
          {/* Notification Bell */}
          <div className="relative mr-6">
            <button className="text-white hover:text-indigo-200 transition">
              <LuBell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          
          {/* Profile Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 bg-white/10 rounded-full pl-2 pr-4 py-1 hover:bg-white/20 transition"
            >
              <div className="bg-purple-300 h-8 w-8 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                PJ
              </div>
              <span className="text-white text-sm">Prof. Johnson</span>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">My Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Account Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center">
                  <LuLogOut size={16} className="mr-2" /> Log Out
                </a>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 pt-6 shadow-md">
        <nav>
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => setActiveTab(item.title)}
                  className={`flex items-center w-full text-left px-6 py-3 hover:bg-indigo-50 transition-colors ${
                    activeTab === item.title 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-purple-500 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className={`mr-3 ${activeTab === item.title ? 'text-purple-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="ml-64 pt-16 flex-grow">
        <div className="p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-indigo-800">Welcome, {facultyName}</h2>
            <p className="text-purple-500 mt-1">{currentDate}</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border-b-4 border-indigo-500 hover:shadow-lg transition-shadow">
                <h3 className="text-purple-600 font-medium mb-2">{stat.title}</h3>
                <p className="text-4xl font-bold text-indigo-700">{stat.value}</p>
              </div>
            ))}
          </div>
          
          {/* Upcoming Sessions Section */}
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-6 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-indigo-800 mb-1">{session.title}</h3>
                    <p className="text-purple-600">
                      {session.time} <span className="text-gray-500">•</span> <span className="text-gray-600">{session.room}</span>
                    </p>
                  </div>
                  <button className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-5 py-2 rounded-full transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Access Cards */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3">Take Attendance</h3>
                <p className="text-indigo-100 text-sm">Quickly record attendance for your classes</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3">Upload Resources</h3>
                <p className="text-purple-100 text-sm">Share study materials with your students</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3">Create Assignment</h3>
                <p className="text-pink-100 text-sm">Create and publish new assignments</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-3">View Reports</h3>
                <p className="text-indigo-100 text-sm">Access detailed class performance reports</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}