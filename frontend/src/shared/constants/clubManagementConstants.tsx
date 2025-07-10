import {
  IoEyeOutline as Eye,
  IoCreateOutline as Edit,
  IoTrashOutline as Trash2,
  IoBusinessOutline as Building,
  IoPersonOutline as User,
} from 'react-icons/io5';
import { Club, ClubRequest, ClubColumn } from '../../domain/types/management/clubmanagement';
import { formatDate } from '../utils/dateUtils';

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
    render: (club: Club) => (
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
    ),
    width: '20%',
  },
  {
    header: 'Type',
    key: 'type',
    render: (club: Club) => (
      <div className="text-sm text-gray-300 capitalize">{club.type}</div>
    ),
  },
  {
    header: 'Created By',
    key: 'createdBy',
    render: (club: Club) => (
      <div className="flex items-center text-gray-300">
        {club.createdBy?.includes('Admin') ? (
          <Building size={14} className="text-purple-400 mr-2" />
        ) : (
          <User size={14} className="text-purple-400 mr-2" />
        )}
        <span className="text-sm">{club.createdBy}</span>
      </div>
    ),
  },
  {
    header: 'Created Date',
    key: 'createdAt',
    render: (club: Club) => (
      <div className="text-sm text-gray-300">{formatDate(club.createdAt)}</div>
    ),
  },
  {
    header: 'Members',
    key: 'members',
    render: (club: Club) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm">{club.memberCount || '0'}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (club: Club) => (
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
    ),
  },
];

export const clubRequestColumns: ClubColumn[] = [
  {
    header: 'Request',
    key: 'name',
    render: (request: ClubRequest) => (
      <div>
        <p className="font-medium text-gray-200">{request.clubName}</p>
        <p className="text-xs text-gray-400">ID: {request.requestedId?.slice(0, 7)}</p>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Requested By',
    key: 'requestedBy',
    render: (request: ClubRequest) => (
      <div className="flex items-center text-gray-300">
        <User size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.requestedBy}</span>
      </div>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300 capitalize">{request.type}</div>
    ),
  },
  {
    header: 'Requested At',
    key: 'createdAt',
    render: (request: ClubRequest) => (
      <div className="text-sm text-gray-300">{formatDate(request.requestedAt)}</div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: ClubRequest) => (
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
    ),
  },
]; 