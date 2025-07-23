import React, { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaUsers, FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import JoinRequestForm from './JoinRequestForm';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import ReactDOM from 'react-dom';
import type { ClubType, ClubsSectionProps, ClubUpcomingEvent } from '../../../../domain/types/user/campus-life';

export default function ClubsSection({ clubs }: ClubsSectionProps) {
  const [selectedClub, setSelectedClub] = useState<ClubType | null>(clubs[0] || null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const { requestToJoinClub, isJoiningClub, joinClubError } = useCampusLife();
  const { styles, theme } = usePreferences();

  console.log(clubs, "popoppppoop")

  const filteredClubs = clubs?.clubs?.filter((club: ClubType) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClubClick = (club: ClubType) => {
    setSelectedClub(club);
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

  const handleJoinRequest = async (request: any) => {
    if (!selectedClub) return;
    try {
      await requestToJoinClub({ clubId: selectedClub.id, request });
      setShowJoinForm(false);
    } catch (error) {
      console.error('Failed to submit join request:', error);
    }
  };

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
                <FaUsers size={20} className="text-white relative z-10" />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                Student Organizations
              </h3>
              <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
            </div>
          </div>
          <span className={`bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
            Spring 2025
          </span>
        </div>
      </div>

      {clubs.length === 0 ? (
        <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.accent}`}>
              <FaUsers className="text-white" size={24} />
            </div>
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>No Clubs Available</h3>
            <p className={`text-sm sm:text-base ${styles.textSecondary}`}>
              There are no clubs available at the moment. Check back later for updates.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-1 relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
            <div className="relative z-10">
              <div className="p-4">
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-3 ${styles.icon.secondary}`} size={16} />
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    className={`w-full pl-10 pr-4 py-2 ${styles.input.background} border ${styles.input.border} rounded-full focus:${styles.input.focus} transition-all duration-300 text-sm`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-amber-100/50">
                {filteredClubs.map((club: ClubType) => (
                  <div
                    key={club.id}
                    className={`p-4 cursor-pointer group/item hover:bg-amber-50/50 transition-all duration-300 ${selectedClub?.id === club.id ? 'bg-orange-50/70' : ''
                      }`}
                    onClick={() => handleClubClick(club)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm`}
                        style={{ backgroundColor: club.color }}
                      >
                        {club.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className={`font-semibold ${styles.textPrimary} text-sm sm:text-base truncate`}>{club.name}</h4>
                        <div className={`text-xs sm:text-sm ${styles.textSecondary}`}>{club.role} • {club.nextMeeting}</div>
                      </div>
                      {selectedClub?.id === club.id ? (
                        <div className={`w-2 h-2 rounded-full ${styles.status.warning}`}></div>
                      ) : null}
                    </div>
                  </div>
                ))}
                {filteredClubs.length === 0 && (
                  <div className={`p-4 text-center ${styles.textSecondary} text-sm`}>No clubs found</div>
                )}
              </div>
            </div>
          </div>

          {ReactDOM.createPortal(
            <div
              className={`fixed inset-0 z-[9999] ${styles.card.background} transition-transform duration-700 transform sm:hidden flex flex-col
                ${showMobileDetails && selectedClub ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}
              style={{ willChange: 'transform' }}
            >
              <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  aria-label="Back"
                  className={`mr-3 text-2xl focus:outline-none ${styles.textPrimary}`}
                  onClick={() => setShowMobileDetails(false)}
                >
                  <FaArrowLeft className={styles.accent} />
                </button>
                <span className="font-bold text-lg text-gray-800 dark:text-white">Club Details</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  {selectedClub ? (
                    <>
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold mr-4`}
                          style={{ backgroundColor: selectedClub.color }}
                        >
                          {selectedClub.icon}
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedClub.name}</h3>
                          <p className={`text-xs ${styles.textSecondary}`}>{selectedClub.type} • {selectedClub.members}</p>
                        </div>
                      </div>
                      {selectedClub.status && (
                        <div className={`bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-4`}>
                          {selectedClub.status}
                        </div>
                      )}
                      <h4 className={`text-base font-bold ${styles.status.warning} mb-2`}>About</h4>
                      <p className={`text-sm ${styles.textPrimary} mb-6`}>{selectedClub.about}</p>
                      {selectedClub.upcomingEvents && (
                        <>
                          <h4 className={`text-base font-bold ${styles.status.warning} mb-2`}>Upcoming Events</h4>
                          <ul className={`relative overflow-hidden rounded-lg p-4 mb-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                            <div className="relative z-10">
                              {selectedClub.upcomingEvents.map((event: string | ClubUpcomingEvent, index: number) => (
                                <li key={index} className={`mb-3 flex text-sm ${styles.textPrimary}`}>
                                  <span className={`${styles.status.warning} mr-2`}>•</span>
                                  <span>
                                    {typeof event === 'string'
                                      ? event
                                      : event?.date
                                        ? `${event.date}: ${event.description || ''}`
                                        : event?.description || ''}
                                  </span>
                                </li>
                              ))}
                            </div>
                          </ul>
                          <div className="flex flex-col gap-3 mt-4">
                            <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm`}>
                              <span>Get Tickets</span>
                              <FaCalendarAlt size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </button>
                            <button className={`group/btn border ${styles.border} ${styles.status.warning} hover:bg-amber-50 py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm`}>
                              <span>View Calendar</span>
                              <FaCalendarAlt size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </>
                      )}
                      {!showJoinForm ? (
                        <button
                          onClick={() => setShowJoinForm(true)}
                          disabled={selectedClub.userRequestStatus === 'pending' || selectedClub.userRequestStatus === 'approved'}
                          className={`group/btn mt-4 w-full bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm ${
                            selectedClub.userRequestStatus === 'pending' || selectedClub.userRequestStatus === 'approved' ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          <span>
                            {selectedClub.userRequestStatus === 'pending'
                              ? 'Request Pending'
                              : selectedClub.userRequestStatus === 'approved'
                                ? 'Already Joined'
                                : 'Request to Join'}
                          </span>
                          <FaUsers size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      ) : (
                        <div className="mt-4">
                          <JoinRequestForm
                            onSubmit={handleJoinRequest}
                            onCancel={() => setShowJoinForm(false)}
                            isLoading={isJoiningClub}
                            title={selectedClub.name}
                          />
                          {joinClubError && (
                            <div className={`mt-2 ${styles.status.error} text-sm`}>
                              Failed to submit join request. Please try again.
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-sm text-gray-400">Select a club to view details.</div>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )}

          <div className="hidden sm:block lg:col-span-2 md:col-span-1">
            {!selectedClub ? (
              <div className="p-6 sm:p-8 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.accent}`}>
                  <FaUsers className="text-white" size={24} />
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Select a Club</h3>
                <p className={`text-sm sm:text-base ${styles.textSecondary}`}>Select a club from the list to view its details.</p>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6">
                  <div className="flex items-center flex-1 mb-4 sm:mb-0">
                    <div
                      className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold mr-4`}
                      style={{ backgroundColor: selectedClub.color }}
                    >
                      {selectedClub.icon}
                    </div>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedClub.name}</h3>
                      <p className={`text-sm ${styles.textSecondary}`}>{selectedClub.type} • {selectedClub.members}</p>
                    </div>
                  </div>
                  {selectedClub.status && (
                    <div className={`bg-green-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                      {selectedClub.status}
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h4 className={`text-base sm:text-lg font-bold ${styles.status.warning} mb-2`}>About</h4>
                  <p className={`text-sm sm:text-base ${styles.textPrimary} mb-6`}>{selectedClub.about}</p>
                  {selectedClub.upcomingEvents && (
                    <>
                      <h4 className={`text-base sm:text-lg font-bold ${styles.status.warning} mb-2`}>Upcoming Events</h4>
                      <ul className={`relative overflow-hidden rounded-lg p-4 mb-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                        <div className="relative z-10">
                          {selectedClub.upcomingEvents.map((event: string | ClubUpcomingEvent, index: number) => (
                            <li key={index} className={`mb-3 flex text-sm ${styles.textPrimary}`}>
                              <span className={`${styles.status.warning} mr-2`}>•</span>
                              <span>
                                {typeof event === 'string'
                                  ? event
                                  : event?.date
                                    ? `${event.date}: ${event.description || ''}`
                                    : event?.description || ''}
                              </span>
                            </li>
                          ))}
                        </div>
                      </ul>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button className={`group/btn bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base`}>
                          <span>Get Tickets</span>
                          <FaCalendarAlt size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                        <button className={`group/btn border ${styles.border} ${styles.status.warning} hover:bg-amber-50 py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base`}>
                          <span>View Calendar</span>
                          <FaCalendarAlt size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </>
                  )}
                  {!showJoinForm ? (
                    <button
                      onClick={() => setShowJoinForm(true)}
                      disabled={selectedClub.userRequestStatus === 'pending' || selectedClub.userRequestStatus === 'approved'}
                      className={`group/btn mt-4 w-full bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm ${
                        selectedClub.userRequestStatus === 'pending' || selectedClub.userRequestStatus === 'approved' ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>
                        {selectedClub.userRequestStatus === 'pending'
                          ? 'Request Pending'
                          : selectedClub.userRequestStatus === 'approved'
                            ? 'Already Joined'
                            : 'Request to Join'}
                      </span>
                      <FaUsers size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  ) : (
                    <div className="mt-4">
                      <JoinRequestForm
                        onSubmit={handleJoinRequest}
                        onCancel={() => setShowJoinForm(false)}
                        isLoading={isJoiningClub}
                        title={selectedClub.name}
                      />
                      {joinClubError && (
                        <div className={`mt-2 ${styles.status.error} text-sm`}>
                          Failed to submit join request. Please try again.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

ClubsSection.propTypes = {
  clubs: PropTypes.shape({
    clubs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        members: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        icon: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        status: PropTypes.string,
        role: PropTypes.string.isRequired,
        nextMeeting: PropTypes.string.isRequired,
        about: PropTypes.string,
        upcomingEvents: PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
              date: PropTypes.string,
              description: PropTypes.string,
            })
          ])
        ),
        userRequestStatus: PropTypes.string,
      })
    ),
    totalItems: PropTypes.number,
  }).isRequired,
};