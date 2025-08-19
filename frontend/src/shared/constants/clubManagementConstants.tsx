import {
  IoBusinessOutline as Building,
  IoPersonOutline as User,
  IoStarOutline as Star,
} from 'react-icons/io5';
import {
  Club,
  ClubRequest,
  ClubColumn,
  StatusBadgeProps,
  InfoCardProps,
  ApiErrorResponse,
  ClubRequestDetailsStatusBadgeProps,
  ClubRequestDetailsInfoCardProps,
  StatusType,
  ParticleConfig
} from '../../domain/types/management/clubmanagement';
import { formatDate } from '../utils/dateUtils';
import { AxiosError } from 'axios';

export const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Arts', 'Academic'];
export const CLUB_STATUSES = ['All', 'Active', 'Inactive'];
export const REQUEST_STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];
export const DATE_RANGES = ['All', 'Last Week', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'Last Year'];
export const ICONS = ['🎓', '🎨', '⚽', '💻', '🎭', '📚', '🎤', '🎮', '🏆', '🔬'];
export const COLORS = ['#8B5CF6', '#06B6D4', '#EF4444', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#84CC16', '#F97316', '#DC2626'];

export const clubColumns: ClubColumn[] = [
  {
    header: 'Club',
    key: 'name',
    render: (item: Club | ClubRequest) => {
      const club = item as Club;
      return (
        <div className="flex items-center gap-3">
          <span
            className="text-2xl w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${club.color}20`, color: club.color }}
          >
            {club.icon}
          </span>
          <div>
            <p className="font-medium text-gray-200">{club.name}</p>
            <p className="text-xs text-gray-400">ID: {club.id?.slice(0, 7)}</p>
          </div>
        </div>
      );
    },
    width: '20%',
  },
  {
    header: 'Type',
    key: 'type',
    render: (item: Club | ClubRequest) => {
      const club = item as Club;
      return (
        <div className="text-sm text-gray-300 capitalize">{club.type}</div>
      );
    },
  },
  {
    header: 'Created By',
    key: 'createdBy',
    render: (item: Club | ClubRequest) => {
      const club = item as Club;
      return (
        <div className="flex items-center text-gray-300">
          {club.createdBy?.includes('Admin') ? (
            <Building size={14} className="text-purple-400 mr-2" />
          ) : (
            <User size={14} className="text-purple-400 mr-2" />
          )}
          <span className="text-sm">{club.createdBy}</span>
        </div>
      );
    },
  },
  {
    header: 'Created Date',
    key: 'createdAt',
    render: (item: Club | ClubRequest) => {
      const club = item as Club;
      return (
        <div className="text-sm text-gray-300">{formatDate(club.createdAt)}</div>
      );
    },
  },
  {
    header: 'Members',
    key: 'members',
    render: (item: Club | ClubRequest) => {
      const club = item as Club;
      return (
        <div className="flex items-center text-gray-300">
          <span className="text-sm">{club.memberCount || '0'}</span>
        </div>
      );
    },
  },
  {
    header: 'Status',
    key: 'status',
    render: (item: Club | ClubRequest) => {
      const club = item as Club;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${club.status.toLowerCase() === 'active'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
            }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full mr-1.5"
            style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
          ></span>
          {club.status.charAt(0).toUpperCase() + club.status.slice(1)}
        </span>
      );
    },
  },
];

export const clubRequestColumns: ClubColumn[] = [
  {
    header: 'Request',
    key: 'name',
    render: (item: Club | ClubRequest) => {
      const request = item as ClubRequest;
      return (
        <div>
          <p className="font-medium text-gray-200">{request.clubName}</p>
          <p className="text-xs text-gray-400">ID: {request.requestedId?.slice(0, 7)}</p>
        </div>
      );
    },
    width: '20%',
  },
  {
    header: 'Requested By',
    key: 'requestedBy',
    render: (item: Club | ClubRequest) => {
      const request = item as ClubRequest;
      return (
        <div className="flex items-center text-gray-300">
          <User size={14} className="text-purple-400 mr-2" />
          <span className="text-sm">{request.requestedBy}</span>
        </div>
      );
    },
  },
  {
    header: 'Type',
    key: 'type',
    render: (item: Club | ClubRequest) => {
      const request = item as ClubRequest;
      return (
        <div className="text-sm text-gray-300 capitalize">{request.type}</div>
      );
    },
  },
  {
    header: 'Requested At',
    key: 'createdAt',
    render: (item: Club | ClubRequest) => {
      const request = item as ClubRequest;
      return (
        <div className="text-sm text-gray-300">{formatDate(request.requestedAt || '')}</div>
      );
    },
  },
  {
    header: 'Status',
    key: 'status',
    render: (item: Club | ClubRequest) => {
      const request = item as ClubRequest;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${request.status.toLowerCase() === 'pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status.toLowerCase() === 'approved'
              ? 'bg-green-900/30 text-green-400 border-green-500/30'
              : 'bg-red-900/30 text-red-400 border-red-500/30'
            }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full mr-1.5"
            style={{ boxShadow: '0 0 8px currentColor', backgroundColor: 'currentColor' }}
          ></span>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
      );
    },
  },
];



export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
    active: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    inactive: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
    pending: {
      bg: 'bg-yellow-600/30',
      text: 'text-yellow-100',
      border: 'border-yellow-500/50',
    },
    approved: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    rejected: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-300" />
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);


export function isAxiosErrorWithApiError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (error as AxiosError).isAxiosError !== undefined;
}


export const RequestStatusBadge: React.FC<ClubRequestDetailsStatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<StatusType, { bg: string; text: string; border: string }> = {
    pending: {
      bg: 'bg-yellow-600/30',
      text: 'text-yellow-100',
      border: 'border-yellow-500/50',
    },
    approved: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    rejected: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const RequestInfoCard: React.FC<ClubRequestDetailsInfoCardProps> = ({ icon: Icon, label, value, highlight = false }) => {
  return (
    <div
      className={`bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 shadow-sm ${highlight ? 'ring-2 ring-purple-500/20 shadow-lg' : ''
        }`}
    >
      <div className="flex items-center mb-2">
        <Icon size={18} className="text-purple-300" />
        <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
        {highlight && <Star size={14} className="ml-auto text-purple-300" />}
      </div>
      <p className="text-white font-semibold">{value || 'N/A'}</p>
    </div>
  );
};

export const ghostParticles: ParticleConfig[] = Array(30)
  .fill(0)
  .map((_) => ({
    size: Math.random() * 10 + 5,
    top: Math.random() * 100,
    left: Math.random() * 100,
    animDuration: Math.random() * 10 + 15,
    animDelay: Math.random() * 5,
  }));
