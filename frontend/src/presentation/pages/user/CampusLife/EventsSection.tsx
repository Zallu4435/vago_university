import { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaMapPin } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useCampusLife } from '../../../../application/hooks/useCampusLife';
import JoinRequestForm from './JoinRequestForm';

export default function EventsSection({ events }) {
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const { requestToJoinEvent, isJoiningEvent, joinEventError } = useCampusLife();

  const handleJoinRequest = async (request: { reason: string; additionalInfo: string }) => {
    try {
      await requestToJoinEvent({ eventId: selectedEvent._id, request });
      setShowJoinForm(false);
    } catch (error) {
      console.error('Failed to submit join request:', error);
    }
  };

  console.log('events', events);

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Campus Events</h3>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Event List */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 border-b border-amber-200">
              <div className="relative">
                <FaSearch className="absolute left-2 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-8 pr-4 py-2 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {events.data.map((event) => (
                <div
                  key={event._id}
                  className={`p-3 border-b border-amber-200 hover:bg-amber-50 cursor-pointer ${
                    selectedEvent?._id === event?._id ? 'bg-amber-100' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${event.color} text-white flex items-center justify-center font-bold`}>
                      {event.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{event.title}</h4>
                      <div className="text-sm text-gray-600 flex items-center">
                        <FaMapPin size={12} className="mr-1 text-orange-500" /> {event.location} - {event.date}, {event.time}
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
        {/* Event Details */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center p-4 border-b border-amber-200">
            <div className={`w-12 h-12 rounded-full ${selectedEvent?.color} text-white flex items-center justify-center font-bold mr-4`}>
              {selectedEvent?.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{selectedEvent?.title}</h3>
              <p className="text-gray-600">Organized by {selectedEvent?.organizer}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-gray-700 font-medium">{selectedEvent?.date}</div>
              <div className="text-orange-600">{selectedEvent?.time}</div>
            </div>
          </div>
          <div className="p-6">
            <h4 className="text-lg font-bold text-orange-700 mb-4">Annual {selectedEvent?.title}</h4>
            <p className="text-gray-700 mb-4">
              Join us for the biggest campus event of the spring semester!
            </p>
            {selectedEvent?.description && (
              <p className="text-gray-700 mb-4">{selectedEvent?.description}</p>
            )}
            <div className="bg-amber-50 p-4 rounded-lg mb-4">
              <div className="flex items-center mb-2">
                <FaMapPin className="text-orange-600 mr-2" size={18} />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{selectedEvent?.location} {selectedEvent?._id === 1 && '(Rain location: Indoor Arena)'}</span>
              </div>
              <div className="flex items-center mb-2">
                <FaClock className="text-orange-600 mr-2" size={18} />
                <span className="font-medium">Time:</span>
                <span className="ml-2">{selectedEvent?.time}</span>
              </div>
              {selectedEvent?.additionalInfo && (
                <div className="mt-3 pt-3 border-t border-amber-200 text-gray-700">
                  {selectedEvent?.additionalInfo}
                </div>
              )}
            </div>
            {selectedEvent?.requirements && (
              <div className="bg-amber-100 p-3 rounded-lg text-sm text-orange-800">
                {selectedEvent?.requirements}
              </div>
            )}
            {!showJoinForm ? (
              <button
                onClick={() => setShowJoinForm(true)}
                className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded"
              >
                Register for Event
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
                  <div className="mt-2 text-red-500 text-sm">
                    Failed to submit registration request. Please try again.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

EventsSection.propTypes = {
  events: PropTypes.shape({
    data: PropTypes.arrayOf(
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
  }).isRequired,
};