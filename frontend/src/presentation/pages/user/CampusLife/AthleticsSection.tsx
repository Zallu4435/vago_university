import { useState, useMemo } from 'react';
import { FaSearch, FaTrophy } from 'react-icons/fa';
import PropTypes from 'prop-types';

interface Sport {
  _id: string;
  title: string;
  type: string;
  icon: string;
  color: string;
  division: string;
  headCoach: string;
  homeGames: number;
  record: string;
  upcomingGames: { date: string; description: string }[];
  participants: number;
  createdAt: string;
  updatedAt: string;
}

interface AthleticsSectionProps {
  sports: {
    data: Sport[];
    total: number;
  };
}

export default function AthleticsSection({ sports }: AthleticsSectionProps) {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(sports.data[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize and filter sports
  const normalizedSports = useMemo(() => {
    return sports.data
      .map((sport) => ({
        _id: sport._id,
        title: sport.title || 'Unknown Team',
        type: sport.type || 'Unknown',
        icon: sport.icon || '⚽',
        color: sport.color || '#8B5CF6',
        division: sport.division || 'Unknown',
        headCoach: sport.headCoach || 'TBD',
        homeGames: sport.homeGames || 0,
        record: sport.record || '0-0-0',
        upcomingGames: sport.upcomingGames || [],
        participants: sport.participants || 0,
        createdAt: sport.createdAt || new Date().toISOString(),
        updatedAt: sport.updatedAt || new Date().toISOString(),
      }))
      .filter((sport) =>
        sport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [sports.data, searchTerm]);

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">University Athletics</h3>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
        </div>
      </div>
      {sports.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">No Sports Available</h4>
          <p className="text-gray-600">No sports teams found for the current season.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sports List (Sidebar) */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md">
            <div className="p-3 border-b border-amber-200">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search sports..."
                  className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="bg-amber-100 px-4 py-2 font-medium text-gray-700 sticky top-0 z-10">ALL SPORTS</div>
              {normalizedSports.length > 0 ? (
                normalizedSports.map((sport) => (
                  <div
                    key={sport._id}
                    className={`p-3 border-b border-amber-200 hover:bg-amber-50 cursor-pointer ${
                      selectedSport?._id === sport._id ? 'bg-amber-100' : ''
                    }`}
                    onClick={() => setSelectedSport(sport)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold"
                        style={{ backgroundColor: sport.color }}
                      >
                        {sport.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{sport.title}</h4>
                        <div className="text-sm text-gray-600">{sport.participants} players</div>
                      </div>
                      {selectedSport?._id === sport._id && (
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-gray-600 text-sm">No sports found.</div>
              )}
            </div>
          </div>
          {/* Sport Details */}
          <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
            {selectedSport ? (
              <>
                <div className="flex items-center p-4 border-b border-amber-200">
                  <div
                    className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold mr-4"
                    style={{ backgroundColor: selectedSport.color }}
                  >
                    {selectedSport.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800">{selectedSport.title}</h3>
                    <p className="text-gray-600">{selectedSport.division}</p>
                  </div>
                  {selectedSport.type === 'Basketball' && (
                    <div className="bg-amber-300 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      <FaTrophy className="inline mr-1" size={14} /> Season!
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-orange-700 mb-4">Team Information</h4>
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <div className="mb-2">
                      <span className="font-medium">Head Coach:</span>
                      <span className="ml-2">{selectedSport.headCoach}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Home Games:</span>
                      <span className="ml-2">{selectedSport.homeGames}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">Current Record:</span>
                      <span className="ml-2">{selectedSport.record}</span>
                    </div>
                  </div>
                  {selectedSport.upcomingGames?.length > 0 ? (
                    <>
                      <h4 className="text-lg font-bold text-orange-700 mb-2">Upcoming Games</h4>
                      <ul className="bg-amber-50 p-4 rounded-lg mb-4">
                        {selectedSport.upcomingGames.map((game, index) => (
                          <li key={index} className="mb-2 flex">
                            <span className="text-orange-700 mr-2">•</span>
                            <span>
                              {new Date(game.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                              : {game.description}
                            </span>
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
                  ) : (
                    <p className="text-gray-600">No upcoming games scheduled.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">No Sport Selected</h4>
                <p className="text-gray-600">Select a sport from the list to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

AthleticsSection.propTypes = {
  sports: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        icon: PropTypes.string,
        color: PropTypes.string,
        division: PropTypes.string,
        headCoach: PropTypes.string,
        homeGames: PropTypes.number,
        record: PropTypes.string,
        upcomingGames: PropTypes.arrayOf(
          PropTypes.shape({
            date: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
          })
        ),
        participants: PropTypes.number,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};