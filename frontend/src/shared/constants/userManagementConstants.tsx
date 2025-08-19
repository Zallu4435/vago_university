import { FiUser, FiMail, FiBook, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaHandHoldingUsd } from 'react-icons/fa';
import { User } from '../../domain/types/management/usermanagement';

export const PROGRAMS = [
  'All Programs',
  'Computer Science',
  'Business',
  'Engineering',
  'Medicine',
  'Arts & Social Sciences',
];

export const STATUSES = ['All Statuses', 'Pending', 'Approved', 'Rejected'];

export const filterOptions = {
  status: STATUSES,
  program: PROGRAMS,
};

export const userColumns = [
  {
    header: 'Applicant',
    key: 'fullName',
    render: (user: User) => (
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm"></div>
          <span className="relative z-10 font-medium text-lg">
            {user.fullName?.[0]?.toUpperCase() || <FiUser />}
          </span>
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-200">{user.fullName || 'N/A'}</p>
          <p className="text-xs text-gray-400">ID: {user._id.substring(0, 8)}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Email',
    key: 'email',
    render: (user: User) => (
      <div className="flex items-center text-gray-300">
        <FiMail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{user.email || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Program',
    key: 'program',
    render: (user: User) => (
      <div className="flex items-center text-gray-300">
        <FiBook size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{user.program || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Applied On',
    key: 'createdAt',
    render: undefined,
  },
  {
    header: 'Status',
    key: 'status',
    render: undefined,
  },
];

export const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: {
      icon: <FiClock size={14} className="mr-1" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      label: 'Pending',
    },
    approved: {
      icon: <FiCheckCircle size={14} className="mr-1" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      label: 'Approved',
    },
    rejected: {
      icon: <FiXCircle size={14} className="mr-1" />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      label: 'Rejected',
    },
    offered: {
      icon: <FaHandHoldingUsd size={14} className="mr-1" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      label: 'Offered',
    },
  };

  const { icon, bgColor, textColor, label } = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} shadow-sm`}
    >
      {icon}
      {label}
    </span>
  );
};