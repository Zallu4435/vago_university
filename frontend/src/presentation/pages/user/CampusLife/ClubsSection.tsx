import { useState } from 'react';
import { FaSearch, FaUsers } from 'react-icons/fa';
import PropTypes from 'prop-types';

export default function ClubsSection({ clubs }) {
  const [selectedClub, setSelectedClub] = useState(clubs[0]);

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Student Organizations</h3>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Clubs List */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 border-b border-amber-200">
              <div className="relative">
                <FaSearch className="absolute left-2 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  className="w-full pl-8 pr-4 py-2 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="bg-amber-100 px-4 py-2 font-medium text-gray-700">MY CLUBS</div>
            <div className="max-h-96 overflow-y-auto">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className={`p-3 border-b border-amber-200 hover:bg-amber-50 cursor-pointer ${
                    selectedClub.id === club.id ? 'bg-amber-100' : ''
                  }`}
                  onClick={() => setSelectedClub(club)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${club.color} text-white flex items-center justify-center font-bold`}>
                      {club.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{club.name}</h4>
                      <div className="text-sm text-gray-600">
                        {club.role} • {club.nextMeeting}
                      </div>
                    </div>
                    {selectedClub.id === club.id && (
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Club Details */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center p-4 border-b border-amber-200">
            <div className={`w-12 h-12 rounded-full ${selectedClub.color} text-white flex items-center justify-center font-bold mr-4`}>
              {selectedClub.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">{selectedClub.name}</h3>
              <p className="text-gray-600">{selectedClub.type} • {selectedClub.members}</p>
            </div>
            {selectedClub.status && (
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedClub.status}
              </div>
            )}
          </div>
          <div className="p-6">
            <h4 className="text-lg font-bold text-orange-700 mb-2">About</h4>
            <p className="text-gray-700 mb-6">{selectedClub.about}</p>
            {selectedClub.upcomingEvents && (
              <>
                <h4 className="text-lg font-bold text-orange-700 mb-2">Upcoming Events</h4>
                <ul className="bg-amber-50 p-4 rounded-lg mb-4">
                  {selectedClub.upcomingEvents.map((event, index) => (
                    <li key={index} className="mb-3 flex">
                      <span className="text-orange-700 mr-2">•</span>
                      <span>{event.date}: {event.description}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 mt-4">
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded">
                    Get Tickets
                  </button>
                  <button className="border border-orange-500 text-orange-500 hover:bg-amber-50 py-2 px-4 rounded">
                    View Calendar
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

ClubsSection.propTypes = {
  clubs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      members: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      status: PropTypes.string,
      role: PropTypes.string.isRequired,
      nextMeeting: PropTypes.string.isRequired,
      about: PropTypes.string,
      upcomingEvents: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};