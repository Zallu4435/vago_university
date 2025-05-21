import PropTypes from 'prop-types';
import { LuClock, LuUsers } from 'react-icons/lu';

export default function UpcomingSessions({ sessions }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Sessions</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
      </div>
      <div className="space-y-5">
        {sessions.map((session, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-indigo-200"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{session.title}</h3>
                <div className="flex items-center text-gray-500 text-sm space-x-3">
                  <span className="flex items-center">
                    <LuClock size={14} className="mr-1" /> {session.time}
                  </span>
                  <span className="flex items-center">
                    <LuUsers size={14} className="mr-1" /> {session.students} Students
                  </span>
                  <span>{session.room}</span>
                </div>
              </div>
              <button className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                Start
              </button>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Course Progress</span>
                <span className="text-indigo-600 font-medium">{session.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${session.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

UpcomingSessions.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      room: PropTypes.string.isRequired,
      students: PropTypes.number.isRequired,
      progress: PropTypes.number.isRequired,
    })
  ).isRequired,
};