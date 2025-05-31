import { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaMapPin } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import JoinRequestForm from './JoinRequestForm';

export default function EventsSection({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(events[0] || null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { requestToJoinEvent, isJoiningEvent, joinEventError } = useCampusLife();

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinRequest = async (request) => {
    if (!selectedEvent) return;
    try {
      await requestToJoinEvent({ eventId: selectedEvent._id, request });
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
                <FaCalendarAlt size={20} className="text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Campus Events
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
      {events.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
          <div className="relative z-10 p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-amber-500" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Available</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              There are no events scheduled at the moment. Check back later for updates.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event List */}
          <div className="lg:col-span-1 relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="p-4 border-b border-amber-200/50">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-amber-100/50">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className={`p-4 cursor-pointer group/item hover:bg-amber-50/50 transition-all duration-300 ${
                      selectedEvent?._id === event._id ? 'bg-orange-50/70' : ''
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm`}
                        style={{ backgroundColor: event.color }}
                      >
                        {event.icon}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{event.title}</h4>
                        <div className="text-xs sm:text-sm text-gray-600 flex items-center">
                          <FaMapPin size={12} className="mr-1 text-orange-500" /> {event.location} - {event.date}
                        </div>
                      </div>
                      <span className="bg-amber-100 text-orange-700 text-xs px-2 py-1 rounded-full">{event.timeframe}</span>
                    </div>
                  </div>
                ))}
                {filteredEvents.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">No events found</div>
                )}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
            <div className="relative z-10">
              {!selectedEvent ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCalendarAlt className="text-amber-500" size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Select an Event</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Choose an event from the list to view its details and register if interested.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-6 border-b border-amber-200/50">
                    <div className="flex items-center flex-1 mb-4 sm:mb-0">
                      <div
                        className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold mr-4`}
                        style={{ backgroundColor: selectedEvent.color }}
                      >
                        {selectedEvent.icon}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{selectedEvent.title}</h3>
                        <p className="text-gray-600 text-sm">Organized by {selectedEvent.organizer}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm sm:text-base">
                      <div className="text-gray-700 font-medium">{selectedEvent.date}</div>
                      <div className="text-orange-600">{selectedEvent.time}</div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-bold text-orange-700 mb-4">Annual {selectedEvent.title}</h4>
                    <p className="text-gray-700 text-sm sm:text-base mb-4">
                      Join us for the biggest campus event of the spring semester!
                    </p>
                    {selectedEvent.description && (
                      <p className="text-gray-700 text-sm sm:text-base mb-4">{selectedEvent.description}</p>
                    )}
                    <div className="relative overflow-hidden rounded-lg bg-amber-50 p-4 mb-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center mb-2">
                          <FaMapPin className="text-orange-600 mr-2" size={16} />
                          <span className="font-medium text-sm sm:text-base">Location:</span>
                          <span className="ml-2 text-sm sm:text-base">
                            {selectedEvent.location}{' '}
                            {selectedEvent._id === 1 && '(Rain location: Indoor Arena)'}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <FaClock className="text-orange-600 mr-2" size={16} />
                          <span className="font-medium text-sm sm:text-base">Time:</span>
                          <span className="ml-2 text-sm sm:text-base">{selectedEvent.time}</span>
                        </div>
                        {selectedEvent.additionalInfo && (
                          <div className="mt-3 pt-3 border-t border-amber-200 text-gray-700 text-sm sm:text-base">
                            {selectedEvent.additionalInfo}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedEvent.requirements && (
                      <div className="bg-amber-100 p-3 rounded-lg text-sm text-orange-800">
                        {selectedEvent.requirements}
                      </div>
                    )}
                    {!showJoinForm ? (
                      <button
                        onClick={() => setShowJoinForm(true)}
                        className="group/btn mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <span>Register for Event</span>
                        <FaCalendarAlt size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    ) : (
                      <div className="mt-4">
                        <JoinRequestForm
                          onSubmit={handleJoinRequest}
                          onCancel={() => setShowJoinForm(false)}
                          isLoading={isJoiningEvent}
                          title={selectedEvent.title}
                        />
                        {joinEventError && (
                          <div className="mt-2 text-red-500 text-sm">
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
      )}
    </div>
  );
}

EventsSection.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
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
    })
  ).isRequired,
};
