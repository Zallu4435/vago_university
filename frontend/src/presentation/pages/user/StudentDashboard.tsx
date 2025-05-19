import { useState } from 'react';
import { 
  LuBell, 
  LuCalendar, 
  LuBook, 
  LuDollarSign, 
  LuMessageSquare, 
  LuLayoutDashboard, 
  LuHome, 
  LuChevronRight, 
  LuMapPin 
} from 'react-icons/lu';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Sample data
  const announcements = [
    { title: 'Library Hours Extended', date: 'Apr 24, 2025' },
    { title: 'Registration Deadline Approaching', date: 'Apr 28, 2025' },
    { title: 'Campus Event: Spring Festival', date: 'May 2, 2025' }
  ];
  
  const deadlines = [
    { title: 'CS301 Assignment Due', date: 'Tomorrow', urgent: true },
    { title: 'BIO220 Project Submission', date: 'May 5' },
    { title: 'MATH154 Midterm Exam', date: 'May 10' },
    { title: 'Course Registration for Fall 2025', date: 'May 15' }
  ];
  
  const classes = [
    { code: 'CS301', name: 'Data Structures', time: '09:00-10:30AM', room: 'Room D201', status: 'Live' },
    { code: 'MATH154', name: 'Linear Algebra', time: '11:00-12:30PM', room: 'Room A103', status: 'Next' }
  ];
  
  const onlineTopics = [
    { title: 'Advanced Database Design', votes: 24, voted: true },
    { title: 'Machine Learning Fundamentals', votes: 18, voted: false },
    { title: 'Web Development with React', votes: 12, voted: false },
    { title: 'Research Paper Writing Workshop', votes: 8, voted: false }
  ];
  
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const specialDates = {
    10: { type: 'exam' },
    15: { type: 'deadline' },
    3: { type: 'event' }
  };
  
  const handleVote = (index) => {
    // In a real application, this would call an API to register the vote
    console.log(`Voted for ${onlineTopics[index].title}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">University Portal</h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-yellow-400 transition">
                <LuBell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center font-medium">JS</div>
                <span>John Smith</span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-4">
            <ul className="flex space-x-6">
              {['Dashboard', 'Academics', 'Financial', 'Communication', 'Campus Life'].map(tab => (
                <li key={tab}>
                  <button 
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 transition-all ${activeTab === tab ? 'border-b-2 border-white font-medium' : 'text-yellow-100 hover:text-white'}`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      {/* Welcome Banner */}
      <div className="bg-blue-50 border-l-4 border-yellow-500">
        <div className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Welcome back, John!</h2>
          <p className="text-gray-600">Current Semester: Spring 2025 | GPA: 3.7 | Credits: 85/120 | Registration Status: Confirmed</p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Important Announcements */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-yellow-500 text-white px-4 py-3 font-medium">
              Important Announcements
            </div>
            <div className="p-4">
              {announcements.map((item, index) => (
                <div key={index} className={`py-3 ${index < announcements.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              ))}
              <button className="mt-3 text-sm text-orange-500 hover:text-orange-600 flex items-center">
                View all announcements <LuChevronRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-500 text-white px-4 py-3 font-medium">
              Upcoming Deadlines
            </div>
            <div className="p-4">
              {deadlines.map((item, index) => (
                <div key={index} className={`py-3 ${index < deadlines.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <p className={`text-sm ${item.urgent ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{item.date}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-yellow-500 text-white px-4 py-3 font-medium">
              Quick Links
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2">
                {[
                  { icon: <LuBook size={18} />, text: 'Course Registration' },
                  { icon: <LuCalendar size={18} />, text: 'Timetable' },
                  { icon: <LuDollarSign size={18} />, text: 'Fee Payment' },
                  { icon: <LuLayoutDashboard size={18} />, text: 'Learning Portal' }
                ].map((link, index) => (
                  <button key={index} className="flex items-center p-3 bg-gray-50 hover:bg-yellow-50 rounded-md text-gray-700 transition-all">
                    <span className="text-orange-500 mr-3">{link.icon}</span>
                    <span>{link.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Scheduled Classes */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-500 text-white px-4 py-3 font-medium">
              Scheduled Classes
            </div>
            <div className="p-4">
              {classes.map((cls, index) => (
                <div key={index} className={`py-3 flex justify-between items-center ${index < classes.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div>
                    <h3 className="font-medium text-gray-800">{cls.code}: {cls.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <span className="mr-2">{cls.time}</span>
                      <LuMapPin size={14} className="inline mr-1" />
                      <span>{cls.room}</span>
                    </p>
                  </div>
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${cls.status === 'Live' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {cls.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Online Session Topics */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-yellow-500 text-white px-4 py-3 font-medium">
              Online Session Topics - Vote Now!
            </div>
            <div className="p-4">
              {onlineTopics.map((topic, index) => (
                <div key={index} className={`py-3 flex justify-between items-center ${index < onlineTopics.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <div>
                    <h3 className="font-medium text-gray-800">{topic.title}</h3>
                    <p className="text-sm text-gray-500">{topic.votes} votes</p>
                  </div>
                  <button 
                    onClick={() => handleVote(index)}
                    className={`px-3 py-1 rounded-md text-sm ${topic.voted 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
                  >
                    {topic.voted ? 'Voted' : 'Vote'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-500 text-white px-4 py-3 font-medium flex justify-between items-center">
              <span>Calendar</span>
              <span className="text-sm">May 2025</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="py-1 font-medium text-gray-600">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map(day => {
                  const special = specialDates[day];
                  let bgClass = '';
                  let textClass = 'text-gray-700';
                  
                  if (special) {
                    if (special.type === 'exam') {
                      bgClass = 'bg-red-100';
                      textClass = 'text-red-600';
                    } else if (special.type === 'deadline') {
                      bgClass = 'bg-orange-100';
                      textClass = 'text-orange-600';
                    } else if (special.type === 'event') {
                      bgClass = 'bg-blue-100';
                      textClass = 'text-blue-600';
                    }
                  }
                  
                  return (
                    <div 
                      key={day} 
                      className={`py-1 rounded-md ${bgClass} ${day === 12 ? 'border-2 border-yellow-400' : ''}`}
                    >
                      <span className={`${textClass} ${day === 12 ? 'font-bold' : ''}`}>{day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 inline-block bg-red-100 rounded-full mr-1"></span>
                  <span className="text-gray-600">Exam</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 inline-block bg-orange-100 rounded-full mr-1"></span>
                  <span className="text-gray-600">Deadline</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 inline-block bg-blue-100 rounded-full mr-1"></span>
                  <span className="text-gray-600">Event</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 University Portal. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-yellow-300">Help</a>
            <a href="#" className="hover:text-yellow-300">Privacy Policy</a>
            <a href="#" className="hover:text-yellow-300">Terms of Service</a>
            <a href="#" className="hover:text-yellow-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}