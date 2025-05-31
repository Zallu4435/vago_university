import { useState, useMemo } from 'react';
import { FaSearch, FaTrophy, FaUsers } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import JoinRequestForm from './JoinRequestForm';

export default function AthleticsSection({ sports }) {
  const [selectedSport, setSelectedSport] = useState(sports[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { requestToJoinSport, isJoiningSport, joinSportError } = useCampusLife();

  const normalizedSports = useMemo(() => {
    return sports
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
  }, [sports, searchTerm]);

  const handleJoinRequest = async (request) => {
    if (!selectedSport) return;
    try {
      await requestToJoinSport({ sportId: selectedSport._id, request });
      setShowJoinForm(false);
    } catch (error) {
      console.error('Failed to submit join request:', error);
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r from-amber-600 to-orange-500 group mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30"></div>
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaTrophy size={20} className="text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                University Athletics
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            Spring 2025
          </span>
        </div>
      </div>

      {/* Content */}
      {normalizedSports.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrophy className="text-amber-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sports Available</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              There are no sports teams available at the moment. Check back later for updates.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sports List */}
          <div className="lg:col-span-1 relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-4 border-b border-amber-200/50">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search sports..."
                    className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="bg-amber-100 px-4 py-2 font-medium text-gray-700 text-sm sm:text-base sticky top-0 z-10">
                ALL SPORTS
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-amber-100/50">
                {normalizedSports.map((sport) => (
                  <div
                    key={sport._id}
                    className={`p-4 cursor-pointer group/item hover:bg-amber-50/50 transition-all duration-300 ${
                      selectedSport?._id === sport._id ? 'bg-orange-50/70' : ''
                    }`}
                    onClick={() => setSelectedSport(sport)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm`}
                        style={{ backgroundColor: sport.color }}
                      >
                        {sport.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{sport.title}</h4>
                        <div className="text-xs sm:text-sm text-gray-600">{sport.participants} players</div>
                      </div>
                      {selectedSport?._id === sport._id && (
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      )}
                    </div>
                  </div>
                ))}
                {normalizedSports.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">No sports found</div>
                )}
              </div>
            </div>
          </div>

          {/* Sport Details */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
            <div className="relative z-10">
              {!selectedSport ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrophy className="text-amber-500" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Select a Sport</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Choose a sport from the list to view its details and try out for the team.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 border-b border-amber-200/50">
                    <div className="flex items-center flex-1 mb-4 sm:mb-0">
                      <div
                        className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold mr-4`}
                        style={{ backgroundColor: selectedSport.color }}
                      >
                        {selectedSport.icon}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{selectedSport.title}</h3>
                        <p className="text-gray-600 text-sm">{selectedSport.division}</p>
                      </div>
                    </div>
                    {selectedSport.type === 'Basketball' && (
                      <div className="bg-amber-300 text-amber-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1">
                        <FaTrophy size={12} />
                        <span>Season!</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-bold text-orange-700 mb-4">Team Information</h4>
                    <div className="relative overflow-hidden rounded-lg bg-amber-50 p-4 mb-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                      <div className="relative z-10">
                        <div className="mb-2 text-sm sm:text-base">
                          <span className="font-medium">Head Coach:</span>
                          <span className="ml-2">{selectedSport.headCoach}</span>
                        </div>
                        <div className="mb-2 text-sm sm:text-base">
                          <span className="font-medium">Home Games:</span>
                          <span className="ml-2">{selectedSport.homeGames}</span>
                        </div>
                        <div className="mb-2 text-sm sm:text-base">
                          <span className="font-medium">Current Record:</span>
                          <span className="ml-2">{selectedSport.record}</span>
                        </div>
                      </div>
                    </div>
                    {selectedSport.upcomingGames?.length > 0 ? (
                      <>
                        <h4 className="text-base sm:text-lg font-bold text-orange-700 mb-2">Upcoming Games</h4>
                        <ul className="relative overflow-hidden rounded-lg bg-amber-50 p-4 mb-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                          <div className="relative z-10">
                            {selectedSport.upcomingGames.map((game, index) => (
                              <li key={index} className="mb-2 flex text-sm sm:text-base">
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
                          </div>
                        </ul>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button className="group/btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base">
                            <span>Get Tickets</span>
                            <FaTrophy size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                          <button className="group/btn border border-orange-500 text-orange-500 hover:bg-amber-50 py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base">
                            <span>Team Roster</span>
                            <FaUsers size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">No upcoming games scheduled.</p>
                    )}
                    {!showJoinForm ? (
                      <button
                        onClick={() => setShowJoinForm(true)}
                        className="group/btn mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <span>Try Out for Team</span>
                        <FaTrophy size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    ) : (
                      <div className="mt-4">
                        <JoinRequestForm
                          onSubmit={handleJoinRequest}
                          onCancel={() => setShowJoinForm(false)}
                          isLoading={isJoiningSport}
                          title={selectedSport.title}
                        />
                        {joinSportError && (
                          <div className="mt-2 text-red-500 text-sm">
                            Failed to submit tryout request. Please try again.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AthleticsSection.propTypes = {
  sports: PropTypes.arrayOf(
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
};
