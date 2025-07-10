import {
  IoMailOutline as Mail,
  IoTimeOutline as Clock,
  IoPersonOutline as Users,
} from 'react-icons/io5';
import { Message, MessageColumn } from '../../domain/types/management/communicationmanagement';

export const STATUSES = ['All Statuses', 'Unread', 'Read', 'Delivered', 'Opened'];

export const USER_GROUPS = [
  { value: 'all-students', label: 'All Students' },
  { value: 'all-faculty', label: 'All Faculty' },
  { value: 'individual', label: 'Individual User' },
];

export const ITEMS_PER_PAGE = 10;

export const inboxColumns: MessageColumn[] = [
  {
    header: 'From',
    key: 'from',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Mail size={14} className="text-purple-400 mr-2" />
        <div>
          <p className={`text-sm ${message.status === 'unread' ? 'font-semibold text-gray-200' : 'text-gray-300'}`}>
            {message.sender?.name || message.from}
          </p>
          <p className="text-xs text-gray-400">{message.sender?.email || message.email}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Subject',
    key: 'subject',
    render: (message: Message) => (
      <div className="text-sm text-gray-300 truncate">{message.subject}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'date',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Clock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{`${message.updatedAt}`}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (message: Message) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          message.status === 'unread'
            ? 'bg-blue-900/30 text-blue-400 border-blue-500/30'
            : 'bg-green-900/30 text-green-400 border-green-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {message.status?.charAt(0).toUpperCase() + message?.status?.slice(1)}
      </span>
    ),
  },
];

export const sentColumns: MessageColumn[] = [
  {
    header: 'To',
    key: 'to',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Mail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{message.recipients?.[0]?.email || message.recipients?.[0]?.name || message.to}</span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Subject',
    key: 'subject',
    render: (message: Message) => (
      <div className="text-sm text-gray-300 truncate">{message.subject}</div>
    ),
  },
  {
    header: 'Date & Time',
    key: 'date',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Clock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{`${message.updatedAt}`}</span>
      </div>
    ),
  },
  {
    header: 'Recipients',
    key: 'recipients',
    render: (message: Message) => (
      <div className="flex items-center text-gray-300">
        <Users size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{message.recipientsCount || 1}</span>
      </div>
    ),
  },
]; 