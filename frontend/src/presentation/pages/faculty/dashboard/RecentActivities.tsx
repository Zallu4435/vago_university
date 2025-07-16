import PropTypes from 'prop-types';
import { LuFileText, LuBookOpen, LuSquareCheck } from 'react-icons/lu';

interface Activity {
  action: string;
  course: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (index: number) => {
    if (index === 0) return <LuFileText size={18} />;
    if (index === 1) return <LuBookOpen size={18} />;
    return <LuSquareCheck size={18} />;
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 p-8 mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">Recent Activities</h2>
      <div className="space-y-6">
        {activities.map((activity: Activity, index: number) => (
          <div key={index} className="flex items-center group">
            <div className="mr-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-12 w-12 rounded-xl flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
                {getActivityIcon(index)}
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.course}</p>
              <p className="text-xs text-pink-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-pink-700 py-2 rounded-lg text-sm font-medium transition-colors">
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