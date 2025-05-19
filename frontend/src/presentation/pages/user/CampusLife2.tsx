import { useState } from 'react';
import { Calendar, Clock, Search, Info, MapPin, Users, Trophy, Award } from 'lucide-react';

export default function UniversityPortal() {
  const [activeTab, setActiveTab] = useState('Athletics');
  
  // Sports data
  const sports = [
    {
      id: 1,
      title: 'Basketball',
      type: 'VARSITY SPORTS',
      teams: 'Men\'s & Women\'s Teams',
      icon: 'BB',
      color: 'bg-red-500',
      division: 'Division I • Conference Champions 2024',
      headCoach: 'Michael Reynolds (Men\'s), Sarah Johnson (Women\'s)',
      homeGames: 'University Arena (Capacity: 10,000)',
      record: 'Men\'s 18-7, Women\'s 21-4',
      upcomingGames: [
        { date: 'May 3', description: 'Women\'s vs. State University - Home, 2:00 PM' },
        { date: 'May 5', description: 'Men\'s vs. Tech Institute - Away, 7:00 PM' },
        { date: 'May 12', description: 'Women\'s Conference Finals - TBD, 5:00 PM' }
      ]
    },
    {
      id: 2,
      title: 'Soccer',
      type: 'VARSITY SPORTS',
      teams: 'Men\'s & Women\'s Teams',
      icon: 'SC',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Volleyball',
      type: 'INTRAMURAL SPORTS',
      teams: 'Co-ed Leagues Available',
      icon: 'VB',
      color: 'bg-yellow-500'
    }
  ];

  const [selectedSport, setSelectedSport] = useState(sports[0]);

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

        {/* Athletics Section */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-lg p-4 mb-4 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">University Athletics</h3>
            <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Sidebar - Sports List */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-3 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sports..."
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="absolute left-2 top-3 text-gray-400" size={16} />
                </div>
              </div>
              
              {/* Varsity Sports Section */}
              <div className="bg-gray-200 px-4 py-2 font-medium text-gray-700">
                VARSITY SPORTS
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {sports.filter(sport => sport.type === 'VARSITY SPORTS').map((sport) => (
                  <div
                    key={sport.id}
                    className={`p-3 border-b hover:bg-orange-50 cursor-pointer ${selectedSport.id === sport.id ? 'bg-orange-100' : ''}`}
                    onClick={() => setSelectedSport(sport)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${sport.color} text-white flex items-center justify-center font-bold`}>
                        {sport.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-orange-800">{sport.title}</h4>
                        <div className="text-sm text-gray-600">
                          {sport.teams}
                        </div>
                      </div>
                      {selectedSport.id === sport.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Intramural Sports Section */}
                <div className="bg-gray-200 px-4 py-2 font-medium text-gray-700">
                  INTRAMURAL SPORTS
                </div>
                
                {sports.filter(sport => sport.type === 'INTRAMURAL SPORTS').map((sport) => (
                  <div
                    key={sport.id}
                    className={`p-3 border-b hover:bg-orange-50 cursor-pointer ${selectedSport.id === sport.id ? 'bg-orange-100' : ''}`}
                    onClick={() => setSelectedSport(sport)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${sport.color} text-white flex items-center justify-center font-bold`}>
                        {sport.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-orange-800">{sport.title}</h4>
                        <div className="text-sm text-gray-600">
                          {sport.teams}
                        </div>
                      </div>
                      {selectedSport.id === sport.id && (
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Sport Details */}
          <div className="w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex items-center p-4 border-b">
              <div className={`w-12 h-12 rounded-full ${selectedSport.color} text-white flex items-center justify-center font-bold mr-4`}>
                {selectedSport.icon}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-orange-800">{selectedSport.title}</h3>
                <p className="text-gray-600">{selectedSport.division}</p>
              </div>
              {selectedSport.id === 1 && (
                <div className="bg-amber-300 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  <Trophy size={14} className="inline mr-1" /> Season!
                </div>
              )}
            </div>

            <div className="p-6">
              <h4 className="text-lg font-bold text-orange-700 mb-4">Team Information</h4>
              
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                {selectedSport.headCoach && (
                  <div className="mb-2">
                    <span className="font-medium">Head Coach:</span>
                    <span className="ml-2">{selectedSport.headCoach}</span>
                  </div>
                )}
                
                {selectedSport.homeGames && (
                  <div className="mb-2">
                    <span className="font-medium">Home Games:</span>
                    <span className="ml-2">{selectedSport.homeGames}</span>
                  </div>
                )}
                
                {selectedSport.record && (
                  <div className="mb-2">
                    <span className="font-medium">Current Record:</span>
                    <span className="ml-2">{selectedSport.record}</span>
                  </div>
                )}
              </div>
              
              {selectedSport.upcomingGames && (
                <>
                  <h4 className="text-lg font-bold text-orange-700 mb-2">Upcoming Games</h4>
                  <ul className="bg-amber-50 p-4 rounded-lg mb-4">
                    {selectedSport.upcomingGames.map((game, index) => (
                      <li key={index} className="mb-2 flex">
                        <span className="text-orange-700 mr-2">•</span>
                        <span>{game.date}: {game.description}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-3 mt-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                      Get Tickets
                    </button>
                    <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded">
                      Team Roster
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