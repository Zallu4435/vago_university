import PropTypes from 'prop-types';
import { LuFileText, LuBookOpen, LuSquareCheck } from 'react-icons/lu';

export default function RecentActivities({ activities }) {
  const getActivityIcon = (index) => {
    if (index === 0) return <LuFileText size={18} />;
    if (index === 1) return <LuBookOpen size={18} />;
    return <LuSquareCheck size={18} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h2>
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex">
            <div className="mr-4">
              <div className="bg-indigo-100 h-10 w-10 rounded-lg flex items-center justify-center text-indigo-600">
                {getActivityIcon(index)}
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-800">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.course}</p>
              <p className="text-xs text-indigo-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium transition-colors">
        View All Activities
      </button>
    </div>
  );
}

RecentActivities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.string.isRequired,
      course: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
};