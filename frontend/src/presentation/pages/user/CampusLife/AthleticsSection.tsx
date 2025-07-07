import React, { useState, useMemo } from 'react';
import { FaSearch, FaTrophy, FaUsers, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import JoinRequestForm from './JoinRequestForm';
import { usePreferences } from '../../../context/PreferencesContext';
import ReactDOM from 'react-dom';

  interface Game {
  date?: string;
  description?: string;
}

interface Sport {
  id: string;
  title: string;
  type: string;
  icon?: string;
  color?: string;
  division?: string;
  headCoach?: string;
  homeGames?: number | string[];
  record?: string;
  upcomingGames?: (string | Game)[];
  participants?: number;
  createdAt?: string;
  updatedAt?: string;
  userRequestStatus?: string;
}

interface SportsData {
  sports: Sport[];
  totalItems: number;
}

interface JoinRequest {
  clubId?: string;
  sportId?: string;
  request: any;
}

export default function AthleticsSection({ sports }: { sports: SportsData }) {
  const [selectedSport, setSelectedSport] = useState(sports.sports[0] || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const { requestToJoinSport, isJoiningSport, joinSportError } = useCampusLife();
  const { styles, theme } = usePreferences();

  const normalizedSports = useMemo(() => {
    return sports?.sports
      ?.map((sport) => ({
        id: sport.id,
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
        userRequestStatus: sport.userRequestStatus || null,
      }))
      .filter((sport) =>
        sport.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sport.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [sports, searchTerm]);

  const handleJoinRequest = async (request: any) => {
    if (!selectedSport) return;
    try {
      await requestToJoinSport({ sportId: selectedSport.id, request });
      setShowJoinForm(false);
    } catch (error) {
      console.error('Failed to submit join request:', error);
    }
  };

  const handleSportClick = (sport: Sport) => {
    setSelectedSport(sport);
    if (window.innerWidth < 640) {
      setShowMobileDetails(true);
    }
  };

  React.useEffect(() => {
    if (showMobileDetails) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showMobileDetails]);

  return (
    <div className="relative">
      <div className={`relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r ${styles.accent} group mb-6`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.primary}`}></div>
        <div className={`absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaTrophy size={20} className="text-white relative z-10" />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                University Athletics
              </h3>
              <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
            </div>
          </div>
          <span className={`bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
            Spring 2025
          </span>
        </div>
      </div>

      {normalizedSports.length === 0 ? (
        <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.accent}`}>
              <FaTrophy className="text-white" size={24} />
            </div>
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>No Sports Available</h3>
            <p className={`text-sm sm:text-base ${styles.textSecondary}`}>
              There are no sports teams available at the moment. Check back later for updates.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-1 relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
            <div className="relative z-10">
              <div className="p-4">
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-3 ${styles.icon.secondary}`} size={16} />
                  <input
                    type="text"
                    placeholder="Search sports..."
                    className={`w-full pl-10 pr-4 py-2 ${styles.input.background} border ${styles.input.border} rounded-full focus:${styles.input.focus} transition-all duration-300 text-sm`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className={`bg-amber-100 px-4 py-2 font-medium ${styles.textPrimary} text-sm sm:text-base sticky top-0 z-10`}>
                ALL SPORTS
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-amber-100/50">
                {normalizedSports.map((sport) => (
                  <div
                    key={sport.id}
                    className={`p-4 cursor-pointer group/item hover:bg-amber-50/50 transition-all duration-300 ${selectedSport?.id === sport.id ? 'bg-orange-50/70' : ''}`}
                    onClick={() => handleSportClick(sport)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm`}
                        style={{ backgroundColor: sport.color }}
                      >
                        {sport.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className={`font-semibold ${styles.textPrimary} text-sm sm:text-base truncate`}>{sport.title}</h4>
                        <div className={`text-xs sm:text-sm ${styles.textSecondary}`}>{sport.participants} players</div>
                      </div>
                      {selectedSport?.id === sport.id && (
                        <div className={`w-2 h-2 rounded-full ${styles.status.warning}`}></div>
                      )}
                    </div>
                  </div>
                ))}
                {normalizedSports.length === 0 && (
                  <div className={`p-4 text-center ${styles.textSecondary} text-sm`}>No sports found</div>
                )}
              </div>
            </div>
          </div>

          <div className={`hidden sm:block lg:col-span-2 relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
            <div className="relative z-10">
              {!selectedSport ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.accent}`}>
                    <FaTrophy className="text-white" size={24} />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Select a Sport</h3>
                  <p className={`text-sm sm:text-base ${styles.textSecondary}`}>
                    Choose a sport from the list to view its details and try out for the team.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6">
                    <div className="flex items-center flex-1 mb-4 sm:mb-0">
                      <div
                        className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold mr-4`}
                        style={{ backgroundColor: selectedSport.color }}
                      >
                        {selectedSport.icon}
                      </div>
                      <div>
                        <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedSport.title}</h3>
                        <p className={`text-sm ${styles.textSecondary}`}>{selectedSport.division}</p>
                      </div>
                    </div>
                    {selectedSport.type === 'Basketball' && (
                      <div className={`bg-amber-300 text-amber-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1`}>
                        <FaTrophy size={12} />
                        <span>Season!</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className={`text-base sm:text-lg font-bold ${styles.status.warning} mb-4`}>Team Information</h4>
                    <div className={`relative overflow-hidden rounded-lg p-4 mb-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                      <div className="relative z-10">
                        <div className={`mb-2 text-sm sm:text-base ${styles.textPrimary}`}>
                          <span className="font-medium">Head Coach:</span>
                          <span className="ml-2">{selectedSport.headCoach}</span>
                        </div>
                        <div className={`mb-2 text-sm sm:text-base ${styles.textPrimary}`}>
                          <span className="font-medium">Home Games:</span>
                          <span className="ml-2">{selectedSport.homeGames}</span>
                        </div>
                        <div className={`mb-2 text-sm sm:text-base ${styles.textPrimary}`}>
                          <span className="font-medium">Current Record:</span>
                          <span className="ml-2">{selectedSport.record}</span>
                        </div>
                      </div>
                    </div>
                    {selectedSport.upcomingGames?.length > 0 ? (
                      <>
                        <h4 className={`text-base sm:text-lg font-bold ${styles.status.warning} mb-2`}>Upcoming Games</h4>
                        <ul className={`relative overflow-hidden rounded-lg p-4 mb-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                          <div className="relative z-10">
                            {selectedSport.upcomingGames.map((game, index) => (
                              <li key={index} className={`mb-2 flex text-sm sm:text-base ${styles.textPrimary}`}>
                                <span className={`${styles.status.warning} mr-2`}>•</span>
                                <span>
                                  {typeof game === 'string' 
                                    ? game
                                    : game?.date
                                      ? `${new Date(game.date).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })}: ${game.description || ''}`
                                      : game?.description || game
                                  }
                                </span>
                              </li>
                            ))}
                          </div>
                        </ul>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base`}>
                            <span>Get Tickets</span>
                            <FaTrophy size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                          <button className={`group/btn border ${styles.border} ${styles.status.warning} hover:bg-amber-50 py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base`}>
                            <span>Team Roster</span>
                            <FaUsers size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className={`text-sm sm:text-base ${styles.textSecondary}`}>No upcoming games scheduled.</p>
                    )}
                    {!showJoinForm ? (
                      <button
                        onClick={() => setShowJoinForm(true)}
                        disabled={selectedSport.userRequestStatus === 'pending' || selectedSport.userRequestStatus === 'approved'}
                        className={`group/btn mt-4 w-full bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                          selectedSport.userRequestStatus === 'pending' || selectedSport.userRequestStatus === 'approved' ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      >
                        <span>
                          {selectedSport.userRequestStatus === 'pending'
                            ? 'Request Pending'
                            : selectedSport.userRequestStatus === 'approved'
                              ? 'Already Joined'
                              : 'Try Out for Team'}
                        </span>
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
                          <div className={`mt-2 ${styles.status.error} text-sm`}>
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

      {/* Mobile Overlay for Sport Details */}
      {ReactDOM.createPortal(
        <div
          className={`fixed inset-0 z-[9999] ${styles.card.background} transition-transform duration-700 transform sm:hidden flex flex-col
            ${showMobileDetails && selectedSport ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
          style={{ willChange: 'transform' }}
        >
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 justify-between">
            <span className="font-bold text-lg text-gray-800 dark:text-white">Sport Details</span>
            <button
              aria-label="Close"
              className={`ml-3 text-2xl focus:outline-none ${styles.textPrimary}`}
              onClick={() => setShowMobileDetails(false)}
            >
              <FaArrowRight className={styles.accent} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {selectedSport ? (
                <>
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold mr-4`}
                      style={{ backgroundColor: selectedSport.color }}
                    >
                      {selectedSport.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedSport.title}</h3>
                      <p className={`text-xs ${styles.textSecondary}`}>{selectedSport.division}</p>
                    </div>
                  </div>
                  <h4 className={`text-base font-bold ${styles.status.warning} mb-4`}>Team Information</h4>
                  <div className={`relative overflow-hidden rounded-lg p-4 mb-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                    <div className="relative z-10">
                      <div className={`mb-2 text-sm ${styles.textPrimary}`}>
                        <span className="font-medium">Head Coach:</span>
                        <span className="ml-2">{selectedSport.headCoach}</span>
                      </div>
                      <div className={`mb-2 text-sm ${styles.textPrimary}`}>
                        <span className="font-medium">Home Games:</span>
                        <span className="ml-2">{selectedSport.homeGames}</span>
                      </div>
                      <div className={`mb-2 text-sm ${styles.textPrimary}`}>
                        <span className="font-medium">Current Record:</span>
                        <span className="ml-2">{selectedSport.record}</span>
                      </div>
                    </div>
                  </div>
                  {selectedSport.upcomingGames?.length > 0 ? (
                    <>
                      <h4 className={`text-base font-bold ${styles.status.warning} mb-2`}>Upcoming Games</h4>
                      <ul className={`relative overflow-hidden rounded-lg p-4 mb-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                        <div className="relative z-10">
                          {selectedSport.upcomingGames.map((game, index) => (
                            <li key={index} className={`mb-2 flex text-sm sm:text-base ${styles.textPrimary}`}>
                              <span className={`${styles.status.warning} mr-2`}>•</span>
                              <span>
                                {typeof game === 'string' 
                                  ? game
                                  : game?.date
                                    ? `${new Date(game.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })}: ${game.description || ''}`
                                    : game?.description || game
                                }
                              </span>
                            </li>
                          ))}
                        </div>
                      </ul>
                      <div className="flex flex-col gap-3 mt-4">
                        <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm`}>
                          <span>Get Tickets</span>
                          <FaTrophy size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                        <button className={`group/btn border ${styles.border} ${styles.status.warning} hover:bg-amber-50 py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm`}>
                          <span>Team Roster</span>
                          <FaUsers size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className={`text-sm ${styles.textSecondary}`}>No upcoming games scheduled.</p>
                  )}
                  {!showJoinForm ? (
                    <button
                      onClick={() => setShowJoinForm(true)}
                      disabled={selectedSport.userRequestStatus === 'pending' || selectedSport.userRequestStatus === 'approved'}
                      className={`group/btn mt-4 w-full bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                        selectedSport.userRequestStatus === 'pending' || selectedSport.userRequestStatus === 'approved' ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>
                        {selectedSport.userRequestStatus === 'pending'
                          ? 'Request Pending'
                          : selectedSport.userRequestStatus === 'approved'
                            ? 'Already Joined'
                            : 'Try Out for Team'}
                      </span>
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
                        <div className={`mt-2 ${styles.status.error} text-sm`}>
                          Failed to submit tryout request. Please try again.
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-sm text-gray-400">Select a sport to view details.</div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

AthleticsSection.propTypes = {
  sports: PropTypes.shape({
    sports: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        icon: PropTypes.string,
        color: PropTypes.string,
        division: PropTypes.string,
        headCoach: PropTypes.string,
        homeGames: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
        record: PropTypes.string,
        upcomingGames: PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              date: PropTypes.string,
              description: PropTypes.string,
            })
          ])
        ),
        participants: PropTypes.number,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        userRequestStatus: PropTypes.string,
      })
    ),
    totalItems: PropTypes.number,
  }).isRequired,
};