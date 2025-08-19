// Enquiry Management Constants
import { FiUser, FiMail, FiFlag, FiClock, FiHelpCircle, FiEye, FiTrash2, FiMessageSquare } from 'react-icons/fi';
import { Enquiry, EnquiryStatus } from '../../domain/types/management/enquirymanagement';

export const ENQUIRY_STATUSES = ['All Statuses', ...Object.values(EnquiryStatus)];

export const ENQUIRY_COLUMNS = [
  {
    header: 'Name',
    key: 'name',
    render: (item: Enquiry) => (
      <div className="flex items-center text-gray-300">
        <FiUser size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{item.name}</span>
      </div>
    ),
  },
  {
    header: 'Email',
    key: 'email',
    render: (item: Enquiry) => (
      <div className="flex items-center text-gray-300">
        <FiMail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{item.email}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (item: Enquiry) => (
      <div className="flex items-center text-gray-300">
        <FiFlag size={14} className="text-purple-400 mr-2" />
        <span className={`capitalize px-2 py-1 rounded-full text-xs font-semibold border ${item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
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
    render: (item: Enquiry) => (
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

export const ENQUIRY_STATS = (enquiries: Enquiry[]) => ({
  total: enquiries.length,
  pending: enquiries.filter(e => e.status === 'pending').length,
  resolved: enquiries.filter(e => e.status === 'resolved').length,
});

export const ENQUIRY_TABS = [
  { label: 'All Enquiries', icon: <FiHelpCircle size={16} />, active: true },
];

export const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
    pending: {
      bg: 'bg-yellow-600/30',
      text: 'text-yellow-100',
      border: 'border-yellow-500/50',
    },
    in_progress: {
      bg: 'bg-blue-600/30',
      text: 'text-blue-100',
      border: 'border-blue-500/50',
    },
    resolved: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status?.replace('_', ' ').charAt(0)?.toUpperCase() + status?.replace('_', ' ').slice(1)}
    </span>
  );
};

export const InfoCard = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number | string; className?: string }>; label: string; value: string }) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-400" />
      <span className="ml-2 text-sm font-medium text-gray-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);

export const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'text-yellow-400' },
  { value: 'in_progress', label: 'In Progress', color: 'text-blue-400' },
  { value: 'resolved', label: 'Resolved', color: 'text-green-400' },
];

export function getDateRangeFromKeyword(keyword: string): { startDate: string; endDate: string } {
  const now = new Date();
  let startDate = '';
  let endDate = now.toISOString();
  switch (keyword) {
    case 'last_week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'last_month':
      startDate = new Date(new Date().setMonth(now.getMonth() - 1)).toISOString();
      break;
    case 'last_3_months':
      startDate = new Date(new Date().setMonth(now.getMonth() - 3)).toISOString();
      break;
    default:
      startDate = '';
      endDate = '';
  }
  return { startDate, endDate };
}

