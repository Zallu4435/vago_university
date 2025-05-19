import { useState } from 'react';
import { Calendar, Clock, Search, Info, MapPin, Users } from 'lucide-react';

export default function UniversityPortal() {
  const [activeTab, setActiveTab] = useState('Events');
  
  // Event data
  const events = [
    {
      id: 1,
      title: 'Spring Concert',
      date: 'May 3, 2025',
      time: '7:00 PM',
      location: 'Main Quad',
      organizer: 'Student Activities Board',
      timeframe: '3 days',
      icon: 'SC',
      color: 'bg-orange-500',
      description: 'This year\'s headliner is indie rock band "The Campus Echoes" with special guests "Quantum Theory" and local favorite "The Professors."',
      fullTime: '7:00 PM - 11:00 PM',
      additionalInfo: 'Food trucks and refreshments will be available starting at 5:30 PM.',
      requirements: 'Student ID required for entry. Each student may bring one guest.'
    },
    {
      id: 2,
      title: 'Career Fair',
      date: 'May 7, 2025',
      time: '10:00 AM',
      location: 'Student Center',
      organizer: 'Career Services',
      timeframe: '1 week',
      icon: 'CF',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Grad Week Kickoff',
      date: 'May 15, 2025',
      time: '4:00 PM',
      location: 'Alumni Hall',
      organizer: 'Alumni Association',
      timeframe: '2 weeks',
      icon: 'GW',
      color: 'bg-amber-500'
    },
    {
      id: 4,
      title: 'Film Festival',
      date: 'May 20, 2025',
      time: '6:00 PM',
      location: 'Media Center',
      organizer: 'Film Club',
      timeframe: '3 weeks',
      icon: 'FF',
      color: 'bg-purple-500'
    }
  ];

  const [selectedEvent, setSelectedEvent] = useState(events[0]);

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

        {/* Events Section */}
        <div className="bg-gradient-to-br from-orange-600 to-amber-500 rounded-lg p-4 mb-4 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Campus Events</h3>
            <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Sidebar - Event List */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-3 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="absolute left-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 border-b hover:bg-orange-50 cursor-pointer ${selectedEvent.id === event.id ? 'bg-orange-100' : ''}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${event.color} text-white flex items-center justify-center font-bold`}>
                        {event.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-orange-800">{event.title}</h4>
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin size={12} className="mr-1" /> {event.location} - {event.date}, {event.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="bg-amber-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                          {event.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Event Details */}
          <div className="w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-4 border-b">
              <div className={`w-12 h-12 rounded-full ${selectedEvent.color} text-white flex items-center justify-center font-bold mr-4`}>
                {selectedEvent.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-800">{selectedEvent.title}</h3>
                <p className="text-gray-600">Organized by {selectedEvent.organizer}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-gray-700 font-medium">{selectedEvent.date}</div>
                <div className="text-amber-600">{selectedEvent.time}</div>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-lg font-bold text-orange-700 mb-4">Annual {selectedEvent.title}</h4>
              
              <p className="text-gray-700 mb-4">
                Join us for the biggest campus event of the spring semester!
              </p>
              
              {selectedEvent.description && (
                <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
              )}
              
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <MapPin className="text-orange-600 mr-2" size={18} />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{selectedEvent.location} {selectedEvent.id === 1 && '(Rain location: Indoor Arena)'}</span>
                </div>
                
                <div className="flex items-center mb-2">
                  <Clock className="text-orange-600 mr-2" size={18} />
                  <span className="font-medium">Time:</span>
                  <span className="ml-2">{selectedEvent.fullTime || selectedEvent.time}</span>
                </div>
                
                {selectedEvent.additionalInfo && (
                  <div className="mt-3 pt-3 border-t border-orange-200 text-gray-700">
                    {selectedEvent.additionalInfo}
                  </div>
                )}
              </div>
              
              {selectedEvent.requirements && (
                <div className="bg-amber-100 p-3 rounded-lg text-sm text-orange-800">
                  {selectedEvent.requirements}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}