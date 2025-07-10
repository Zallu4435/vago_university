// Enquiry Management Constants
import { FiUser, FiMail, FiFlag, FiClock, FiHelpCircle, FiCheckSquare, FiEye, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { EnquiryStatus } from '../../domain/types/enquirymanagement';

export const ENQUIRY_STATUSES = ['All Statuses', ...Object.values(EnquiryStatus)];

export const ENQUIRY_COLUMNS = [
  {
    header: 'Name',
    key: 'name',
    render: (item: any) => (
      <div className="flex items-center text-gray-300">
        <FiUser size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{item.name}</span>
      </div>
    ),
  },
  {
    header: 'Email',
    key: 'email',
    render: (item: any) => (
      <div className="flex items-center text-gray-300">
        <FiMail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{item.email}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (item: any) => (
      <div className="flex items-center text-gray-300">
        <FiFlag size={14} className="text-purple-400 mr-2" />
        <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold border ${
          item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
          item.status === 'in_progress' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
          item.status === 'resolved' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
          'bg-gray-800/30 text-gray-400 border-gray-500/30'
        }`}>
          {item.status.replace('_', ' ')}
        </span>
      </div>
    ),
  },
  {
    header: 'Created At',
    key: 'createdAt',
    render: (item: any) => (
      <div className="flex items-center text-gray-300">
        <FiClock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>
    ),
  },
];

export const ENQUIRY_ACTIONS = [
  {
    icon: <FiEye className="h-4 w-4" />,
    label: 'View',
    color: 'blue' as const,
  },
  {
    icon: <FiMessageSquare className="h-4 w-4" />,
    label: 'Reply',
    color: 'green' as const,
  },
  {
    icon: <FiTrash2 className="h-4 w-4" />,
    label: 'Delete',
    color: 'red' as const,
  },
];

export const ENQUIRY_STATS = (enquiries: any[]) => ({
  total: enquiries.length,
  pending: enquiries.filter(e => e.status === 'pending').length,
  resolved: enquiries.filter(e => e.status === 'resolved').length,
});

export const ENQUIRY_TABS = [
  { label: 'All Enquiries', icon: <FiHelpCircle size={16} />, active: true },
]; 