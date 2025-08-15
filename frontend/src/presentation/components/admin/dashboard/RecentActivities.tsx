import React from 'react';
import { formatRelativeTime } from '../../../../shared/utils/dateUtils';

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  time: string;
  avatar: string;
  type: 'success' | 'warning' | 'info' | 'default';
  isRead: boolean;
}

interface RecentActivitiesProps {
  activitiesData: ActivityItem[];
}

const EnhancedActivityItem = ({ action, user, time, avatar, type = "default" }: ActivityItem) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-emerald-400 to-emerald-600';
      case 'warning': return 'from-amber-400 to-orange-500';
      case 'info': return 'from-blue-400 to-blue-600';
      default: return 'from-purple-400 to-purple-600';
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-700/30 rounded-lg transition-colors duration-200 px-2 backdrop-blur-sm">
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 bg-gradient-to-br ${getTypeColor(type)} rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm`}>
          <span className="text-sm font-bold text-white">{avatar}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200">{action}</p>
        <p className="text-xs text-gray-400 flex items-center">
          <span className="mr-1">by</span>
          <span className="font-medium">{user}</span>
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-500/30 backdrop-blur-sm">
          {formatRelativeTime(time)}
        </span>
      </div>
    </div>
  );
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activitiesData }) => (
  <div className="space-y-2">
    {activitiesData.length > 0 ? (
      activitiesData.map((activity) => (
        <div key={activity.id}>
          <EnhancedActivityItem
            action={activity.action}
            user={activity.user}
            time={activity.time}
            avatar={activity.avatar}
            type={activity.type}
          />
        </div>
      ))
    ) : (
      <div className="text-center py-8">
        <span className="h-8 w-8 text-gray-500 mx-auto mb-2">⚡</span>
        <p className="text-gray-400">No recent activities</p>
      </div>
    )}
  </div>
);

export default RecentActivities; 