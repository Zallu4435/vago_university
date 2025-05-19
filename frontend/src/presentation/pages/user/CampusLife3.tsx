import { useState } from 'react';
import { Search, Info, Users, Calendar } from 'lucide-react';

export default function UniversityPortal() {
  const [activeTab, setActiveTab] = useState('Clubs');
  
  // Clubs data
  const clubs = [
    {
      id: 1,
      name: 'Computer Science Society',
      type: 'Academic & Professional Organization',
      members: '87 Members',
      icon: 'CS',
      color: 'bg-green-500',
      status: 'Active',
      role: 'Member',
      nextMeeting: 'Next Meeting: May 2, 5:00 PM',
      about: 'The Computer Science Society is a student-led organization dedicated to expanding technical knowledge, professional development, and networking opportunities for students interested in computer science and technology.',
      upcomingEvents: [
        { date: 'May 2', description: 'Technical Workshop - "Introduction to AI" - Tech Lab 103, 5:00 PM' },
        { date: 'May 15', description: 'Industry Panel - "Careers in Tech" - Student Center, 6:30 PM' },
        { date: 'May 22', description: 'End of Year Social - Off-campus, 7:00 PM' }
      ]
    },
    {
      id: 2,
      name: 'Drama & Theater Club',
      type: 'Arts & Culture',
      members: '45 Members',
      icon: 'DT',
      color: 'bg-orange-500',
      role: 'Member',
      nextMeeting: 'Next Event: May 10, 7:00 PM'
    },
    {
      id: 3,
      name: 'Volunteer Corps',
      type: 'Community Service',
      members: '120 Members',
      icon: 'VC',
      color: 'bg-purple-500',
      role: 'Officer',
      nextMeeting: 'Next Project: May 5, 9:00 AM'
    }
  ];

  const [selectedClub, setSelectedClub] = useState(clubs[0]);

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">University Portal</h1>
        <div className="flex items-center space-x-2">
          <span>John Smith</span>
          <div className="w-8 h-8 rounded-full bg-white text-blue-800 flex items-center justify-center">
            JS
          </div>
          <div className="w-8 h-8 rounded-full bg-white text-blue-800 flex items-center justify-center">
            <Info size={16} />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-800 text-white p-2 border-t border-blue-700">
        <ul className="flex space-x-6">
          <li className="hover:bg-blue-700 px-3 py-1 rounded">Dashboard</li>
          <li className="hover:bg-blue-700 px-3 py-1 rounded">Academics</li>
          <li className="hover:bg-blue-700 px-3 py-1 rounded">Financial</li>
          <li className="hover:bg-blue-700 px-3 py-1 rounded">Communication</li>
          <li className="bg-blue-700 px-3 py-1 rounded">Campus Life</li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4">
        {/* Page Title */}
        <div className="bg-orange-100 rounded-lg p-4 mb-4 shadow-md">
          <h2 className="text-xl font-bold text-orange-800">Campus Life</h2>
          <p className="text-orange-700">5 Upcoming Events | Spring Semptember 2025 | Club: 3 Memberships</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-100 rounded-lg mb-4 shadow-md">
          <div className="flex border-b">
            {['Events', 'Clubs', 'Athletics'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 ${activeTab === tab ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-300 hover:text-white'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Student Organizations Section */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg p-4 mb-4 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Student Organizations</h3>
            <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Sidebar - Clubs List */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-3 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="absolute left-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              {/* My Clubs Section */}
              <div className="bg-gray-200 px-4 py-2 font-medium text-gray-700">
                MY CLUBS
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className={`p-3 border-b hover:bg-orange-50 cursor-pointer ${selectedClub.id === club.id ? 'bg-orange-100' : ''}`}
                    onClick={() => setSelectedClub(club)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${club.color} text-white flex items-center justify-center font-bold`}>
                        {club.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-orange-800">{club.name}</h4>
                        <div className="text-sm text-gray-600">
                          {club.role} • {club.nextMeeting}
                        </div>
                      </div>
                      {selectedClub.id === club.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Club Details */}
          <div className="w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-4 border-b">
              <div className={`w-12 h-12 rounded-full ${selectedClub.color} text-white flex items-center justify-center font-bold mr-4`}>
                {selectedClub.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-orange-800">{selectedClub.name}</h3>
                <p className="text-gray-600">{selectedClub.type} • {selectedClub.members}</p>
              </div>
              {selectedClub.status && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedClub.status}
                </div>
              )}
            </div>

            <div className="p-6">
              <h4 className="text-lg font-bold text-orange-700 mb-2">About</h4>
              
              <p className="text-gray-700 mb-6">
                {selectedClub.about}
              </p>
              
              {selectedClub.upcomingEvents && (
                <>
                  <h4 className="text-lg font-bold text-orange-700 mb-2">Upcoming Events</h4>
                  <ul className="bg-amber-50 p-4 rounded-lg mb-4">
                    {selectedClub.upcomingEvents.map((event, index) => (
                      <li key={index} className="mb-3 flex">
                        <span className="text-orange-700 mr-2">•</span>
                        <span>{event.date}: {event.description}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-3 mt-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                      Get Tickets
                    </button>
                    <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded">
                      View Calendar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}