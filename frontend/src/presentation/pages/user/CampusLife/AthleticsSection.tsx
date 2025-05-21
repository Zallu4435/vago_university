import { useState } from 'react';
import { FaSearch, FaTrophy } from 'react-icons/fa';
import PropTypes from 'prop-types';

export default function AthleticsSection({ sports }) {
  const [selectedSport, setSelectedSport] = useState(sports[0]);

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">University Athletics</h3>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sports List */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 border-b border-amber-200">
              <div className="relative">
                <FaSearch className="absolute left-2 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search sports..."
                  className="w-full pl-8 pr-4 py-2 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="bg-amber-100 px-4 py-2 font-medium text-gray-700">VARSITY SPORTS</div>
            {sports
              .filter((sport) => sport.type === 'VARSITY SPORTS')
              .map((sport) => (
                <div
                  key={sport.id}
                  className={`p-3 border-b border-amber-200 hover:bg-amber-50 cursor-pointer ${
                    selectedSport.id === sport.id ? 'bg-amber-100' : ''
                  }`}
                  onClick={() => setSelectedSport(sport)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${sport.color} text-white flex items-center justify-center font-bold`}>
                      {sport.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{sport.title}</h4>
                      <div className="text-sm text-gray-600">{sport.teams}</div>
                    </div>
                    {selectedSport.id === sport.id && (
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    )}
                  </div>
                </div>
              ))}
            <div className="bg-amber-100 px-4 py-2 font-medium text-gray-700">INTRAMURAL SPORTS</div>
            {sports
              .filter((sport) => sport.type === 'INTRAMURAL SPORTS')
              .map((sport) => (
                <div
                  key={sport.id}
                  className={`p-3 border-b border-amber-200 hover:bg-amber-50 cursor-pointer ${
                    selectedSport.id === sport.id ? 'bg-amber-100' : ''
                  }`}
                  onClick={() => setSelectedSport(sport)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${sport.color} text-white flex items-center justify-center font-bold`}>
                      {sport.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{sport.title}</h4>
                      <div className="text-sm text-gray-600">{sport.teams}</div>
                    </div>
                    {selectedSport.id === sport.id && (
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* Sport Details */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center p-4 border-b border-amber-200">
            <div className={`w-12 h-12 rounded-full ${selectedSport.color} text-white flex items-center justify-center font-bold mr-4`}>
              {selectedSport.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">{selectedSport.title}</h3>
              <p className="text-gray-600">{selectedSport.division}</p>
            </div>
            {selectedSport.id === 1 && (
              <div className="bg-amber-300 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                <FaTrophy className="inline mr-1" size={14} /> Season!
              </div>
            )}
          </div>
          <div className="p-6">
            <h4 className="text-lg font-bold text-orange-700 mb-4">Team Information</h4>
            <div className="bg-amber-50 p-4 rounded-lg mb-4">
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
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded">
                    Get Tickets
                  </button>
                  <button className="border border-orange-500 text-orange-500 hover:bg-amber-50 py-2 px-4 rounded">
                    Team Roster
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

AthleticsSection.propTypes = {
  sports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      teams: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      division: PropTypes.string,
      headCoach: PropTypes.string,
      homeGames: PropTypes.string,
      record: PropTypes.string,
      upcomingGames: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};