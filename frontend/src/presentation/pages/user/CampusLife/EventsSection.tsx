import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaMapPin, FaArrowRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import JoinRequestForm from './JoinRequestForm';
import { usePreferences } from '../../../context/PreferencesContext';
import ReactDOM from 'react-dom';

interface EventType {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  timeframe: string;
  icon: string;
  color: string;
  description?: string;
  fullTime?: string;
  additionalInfo?: string;
  requirements?: string;
  userRequestStatus?: string;
}

interface EventsSectionProps {
  events: EventType[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(events[0] || null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const { requestToJoinEvent, isJoiningEvent, joinEventError } = useCampusLife();
  const { styles, theme } = usePreferences();

  const filteredEvents = events?.events?.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
    if (window.innerWidth < 640) {
      setShowMobileDetails(true);
    }
  };

  useEffect(() => {
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
    if (!selectedEvent) return;
    try {
      await requestToJoinEvent({ eventId: selectedEvent.id, request });
      setShowJoinForm(false);
    } catch (error) {
      console.error('Failed to submit join request:', error);
    }
  };

  return (
    <div className="relative sm:px-4 md:px-8">
      <div className={`relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r ${styles.accent} group mb-6`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.primary}`}></div>
        <div className={`absolute -top-8 -left-8 w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-8 -right-8 w-20 sm:w-32 h-20 sm:h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>
        <div className="relative z-10 p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaCalendarAlt size={20} className="text-white relative z-10" />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div>
              <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                Campus Events
              </h3>
              <div className={`h-1 w-12 sm:w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-20 sm:group-hover:w-24 transition-all duration-300`}></div>
            </div>
          </div>
          <span className={`bg-amber-200 text-orange-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
            Spring 2025
          </span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
          <div className="relative z-10 p-6 sm:p-8 text-center">
            <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.accent}`}>
              <FaCalendarAlt className={`text-white`} size={24} />
            </div>
            <h3 className={`text-lg sm:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>No Events Available</h3>
            <p className={`text-xs sm:text-sm md:text-base ${styles.textSecondary}`}>
              There are no events scheduled at the moment. Check back later for updates.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className={`lg:col-span-1 md:col-span-1 relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
            <div className="relative z-10">
              <div className="p-3 sm:p-4">
                <div className="relative">
                  <FaSearch className={`absolute left-3 top-3 ${styles.icon.secondary}`} size={16} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className={`w-full pl-10 pr-4 py-2 ${styles.input.background} border ${styles.input.border} rounded-full focus:${styles.input.focus} transition-all duration-300 text-xs sm:text-sm`}
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-60 sm:max-h-80 md:max-h-96 overflow-y-auto divide-y divide-amber-100/50">
                {filteredEvents.map((event: EventType, idx: number) => (
                  <div
                    key={event.id}
                    className={`p-3 sm:p-4 cursor-pointer group/item hover:bg-amber-50/50 transition-all duration-300 ${selectedEvent?.id === event.id ? 'bg-orange-50/70' : ''
                    }`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full text-white flex items-center justify-center font-bold text-xs sm:text-sm`}
                        style={{ backgroundColor: event.color }}
                      >
                        {event.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className={`font-semibold ${styles.textPrimary} text-xs sm:text-sm md:text-base truncate`}>{event.title}</h4>
                        <div className={`text-xs sm:text-sm ${styles.textSecondary} flex items-center`}>
                          <FaMapPin size={12} className={`mr-1 ${styles.status.warning}`} /> {event.location} - {event.date}
                        </div>
                      </div>
                      <span className={`bg-amber-100 text-orange-700 text-xs px-2 py-1 rounded-full`}>{event.timeframe}</span>
                    </div>
                  </div>
                ))}
                {filteredEvents.length === 0 && (
                  <div className={`p-4 text-center ${styles.textSecondary} text-xs sm:text-sm`}>No events found</div>
                )}
              </div>
            </div>
          </div>

          <div className={`hidden sm:block lg:col-span-2 md:col-span-1 relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500 mt-4 md:mt-0`}>
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
            <div className="relative z-10">
              {/* Mobile Overlay */}
              {ReactDOM.createPortal(
                <div
                  className={`fixed inset-0 z-[9999] ${styles.card.background} transition-transform duration-700 transform sm:hidden flex flex-col
                    ${showMobileDetails && selectedEvent ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
                  style={{ willChange: 'transform' }}
                >
                  <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <button
                      aria-label="Close"
                      className={`mr-3 text-2xl focus:outline-none ${styles.textPrimary}`}
                      onClick={() => setShowMobileDetails(false)}
                    >
                      <FaArrowRight className={styles.accent} />
                    </button>
                    <span className="font-bold text-lg text-gray-800 dark:text-white">Event Details</span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold mr-4`}
                          style={{ backgroundColor: selectedEvent?.color }}
                        >
                          {selectedEvent?.icon}
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedEvent?.title}</h3>
                          <p className={`text-xs ${styles.textSecondary}`}>Organized by {selectedEvent?.organizer}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className={`font-medium ${styles.textPrimary}`}>{selectedEvent?.date}</div>
                        <div className={`${styles.status.warning}`}>{selectedEvent?.time}</div>
                      </div>
                      <h4 className={`text-base font-bold ${styles.status.warning} mb-2`}>Annual {selectedEvent?.title}</h4>
                      <p className={`text-sm ${styles.textPrimary} mb-2`}>Join us for the biggest campus event of the spring semester!</p>
                      {selectedEvent?.description && (
                        <p className={`text-sm ${styles.textPrimary} mb-2`}>{selectedEvent.description}</p>
                      )}
                      <div className={`relative overflow-hidden rounded-lg p-3 mb-3 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                        <div className="relative z-10">
                          <div className="flex items-center mb-2">
                            <FaMapPin className={`${styles.status.warning} mr-2`} size={16} />
                            <span className="font-medium text-sm">Location:</span>
                            <span className={`ml-2 text-sm ${styles.textSecondary}`}>{selectedEvent?.location}{' '}{selectedEvent?.id === '1' && '(Rain location: Indoor Arena)'}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <FaClock className={`${styles.status.warning} mr-2`} size={16} />
                            <span className="font-medium text-sm">Time:</span>
                            <span className={`ml-2 text-sm ${styles.textSecondary}`}>{selectedEvent?.time}</span>
                          </div>
                          {selectedEvent?.additionalInfo && (
                            <div className={`mt-3 pt-3 border-t ${styles.border} ${styles.textPrimary} text-sm`}>
                              {selectedEvent.additionalInfo}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedEvent?.requirements && (
                        <div className={`bg-amber-100 p-2 rounded-lg text-xs ${styles.status.warning}`}>{selectedEvent.requirements}</div>
                      )}
                      {!showJoinForm ? (
                        <button
                          onClick={() => setShowJoinForm(true)}
                          disabled={selectedEvent?.userRequestStatus === 'pending' || selectedEvent?.userRequestStatus === 'approved'}
                          className={`group/btn mt-4 w-full bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm ${
                            selectedEvent?.userRequestStatus === 'pending' || selectedEvent?.userRequestStatus === 'approved' ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          <span>
                            {selectedEvent?.userRequestStatus === 'pending'
                              ? 'Registration Pending'
                              : selectedEvent?.userRequestStatus === 'approved'
                                ? 'Already Registered'
                                : 'Register for Event'}
                          </span>
                          <FaCalendarAlt size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </button>
                      ) : (
                        <div className="mt-4">
                          <JoinRequestForm
                            onSubmit={handleJoinRequest}
                            onCancel={() => setShowJoinForm(false)}
                            isLoading={isJoiningEvent}
                            title={selectedEvent?.title}
                          />
                          {joinEventError && (
                            <div className={`mt-2 ${styles.status.error} text-xs`}>Failed to submit registration request. Please try again.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>,
                document.body
              )}
              {/* Desktop/Tablet Event Details */}
              <div className="hidden sm:block">
                {!selectedEvent ? (
                  <div className="p-4 sm:p-6 md:p-8 text-center">
                    <div className={`w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.accent}`}>
                      <FaCalendarAlt className="text-white" size={24} />
                    </div>
                    <h3 className={`text-base sm:text-lg md:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>
                      Select an Event
                    </h3>
                    <p className={`text-xs sm:text-sm md:text-base ${styles.textSecondary}`}>
                    Choose an event from the list to view its details and register if interested.
                  </p>
                </div>
              ) : (
                <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 md:p-6">
                      <div className="flex items-center flex-1 mb-3 sm:mb-0">
                      <div
                          className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full text-white flex items-center justify-center font-bold mr-3 sm:mr-4`}
                        style={{ backgroundColor: selectedEvent.color }}
                      >
                        {selectedEvent.icon}
                      </div>
                      <div>
                          <h3 className={`text-base sm:text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedEvent.title}</h3>
                          <p className={`text-xs sm:text-sm ${styles.textSecondary}`}>Organized by {selectedEvent.organizer}</p>
                        </div>
                      </div>
                      <div className={`text-xs sm:text-sm md:text-base ${styles.textSecondary}`}>
                      <div className={`font-medium ${styles.textPrimary}`}>{selectedEvent.date}</div>
                      <div className={`${styles.status.warning}`}>{selectedEvent.time}</div>
                    </div>
                  </div>
                    <div className="p-3 sm:p-4 md:p-6">
                      <h4 className={`text-sm sm:text-base md:text-lg font-bold ${styles.status.warning} mb-3 sm:mb-4`}>Annual {selectedEvent.title}</h4>
                      <p className={`text-xs sm:text-sm md:text-base ${styles.textPrimary} mb-3 sm:mb-4`}>
                      Join us for the biggest campus event of the spring semester!
                    </p>
                    {selectedEvent.description && (
                        <p className={`text-xs sm:text-sm md:text-base ${styles.textPrimary} mb-3 sm:mb-4`}>{selectedEvent.description}</p>
                    )}
                      <div className={`relative overflow-hidden rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-2">
                          <FaMapPin className={`${styles.status.warning} mr-2`} size={16} />
                            <span className="font-medium text-xs sm:text-sm md:text-base">Location:</span>
                            <span className={`ml-2 text-xs sm:text-sm md:text-base ${styles.textSecondary}`}>
                            {selectedEvent.location}{' '}
                              {selectedEvent.id === '1' && '(Rain location: Indoor Arena)'}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <FaClock className={`${styles.status.warning} mr-2`} size={16} />
                            <span className="font-medium text-xs sm:text-sm md:text-base">Time:</span>
                            <span className={`ml-2 text-xs sm:text-sm md:text-base ${styles.textSecondary}`}>{selectedEvent.time}</span>
                        </div>
                        {selectedEvent.additionalInfo && (
                            <div className={`mt-3 pt-3 border-t ${styles.border} ${styles.textPrimary} text-xs sm:text-sm md:text-base`}>
                            {selectedEvent.additionalInfo}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedEvent.requirements && (
                        <div className={`bg-amber-100 p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${styles.status.warning}`}>
                        {selectedEvent.requirements}
                      </div>
                    )}
                    {!showJoinForm ? (
                      <button
                        onClick={() => setShowJoinForm(true)}
                        disabled={selectedEvent.userRequestStatus === 'pending' || selectedEvent.userRequestStatus === 'approved'}
                        className={`group/btn mt-3 sm:mt-4 w-full bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-xs sm:text-sm md:text-base ${
                          selectedEvent.userRequestStatus === 'pending' || selectedEvent.userRequestStatus === 'approved' ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                      >
                        <span>
                          {selectedEvent.userRequestStatus === 'pending'
                            ? 'Registration Pending'
                            : selectedEvent.userRequestStatus === 'approved'
                              ? 'Already Registered'
                              : 'Register for Event'}
                        </span>
                        <FaCalendarAlt size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    ) : (
                        <div className="mt-3 sm:mt-4">
                        <JoinRequestForm
                          onSubmit={handleJoinRequest}
                          onCancel={() => setShowJoinForm(false)}
                          isLoading={isJoiningEvent}
                          title={selectedEvent.title}
                        />
                        {joinEventError && (
                            <div className={`mt-2 ${styles.status.error} text-xs sm:text-sm`}>
                            Failed to submit registration request. Please try again.
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
        </div>
      )}
    </div>
  );
}

EventsSection.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      organizer: PropTypes.string.isRequired,
      timeframe: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      description: PropTypes.string,
      fullTime: PropTypes.string,
      additionalInfo: PropTypes.string,
      requirements: PropTypes.string,
      userRequestStatus: PropTypes.string,
    })
  ).isRequired,
};