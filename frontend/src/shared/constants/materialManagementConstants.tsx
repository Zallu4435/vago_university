import { FiFileText, FiVideo, FiTag } from 'react-icons/fi';
import { Material } from '../../domain/types/management/materialmanagement';
import { InfoCardProps, StatusBadgeProps } from '../../domain/types/management/notificationmanagement';

export const SUBJECTS = ['All Subjects', 'Mathematics', 'Computer Science', 'Physics', 'Chemistry'];
export const COURSES = ['All Courses', 'B.Sc. Mathematics', 'B.Tech. CS', 'B.Sc. Physics'];
export const SEMESTERS = ['All Semesters', '1', '2', '3', '4', '5', '6'];
export const TYPES = ['All Types', 'pdf', 'video'];
export const UPLOADERS = ['All Uploaders', 'Dr. Smith', 'Prof. Jones'];

export const getMaterialColumns = () => [
  {
    header: 'Title',
    key: 'title',
    render: (material: Material) => (
      <div className="flex items-center text-gray-300">
        {material.type === 'pdf' ? <FiFileText size={14} className="text-purple-400 mr-2" /> : <FiVideo size={14} className="text-purple-400 mr-2" />}
        <span className="text-sm">{material.title}</span>
      </div>
    ),
    width: '25%',
  },
  {
    header: 'Subject',
    key: 'subject',
    render: (material: Material) => (
      <div className="flex items-center text-gray-300">
        <FiTag size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{material.subject}</span>
      </div>
    ),
  },
  {
    header: 'Course',
    key: 'course',
    render: (material: Material) => (
      <span className="text-sm text-gray-300">{material.course}</span>
    ),
  },
  {
    header: 'Semester',
    key: 'semester',
    render: (material: Material) => (
      <span className="text-sm text-gray-300">{material.semester}</span>
    ),
  },
  {
    header: 'Type',
    key: 'type',
    render: (material: Material) => (
      <span className="text-sm text-gray-300 capitalize">{material.type}</span>
    ),
  },
  {
    header: 'Status',
    key: 'isRestricted',
    render: (material: Material) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${material.isRestricted
          ? 'bg-red-900/30 text-red-400 border-red-500/30'
          : 'bg-green-900/30 text-green-400 border-green-500/30'
          }`}
      >
        <span className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}></span>
        {material.isRestricted ? 'Restricted' : 'Public'}
      </span>
    ),
  },
];

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    sent: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    failed: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
    pending: {
      bg: 'bg-yellow-600/30',
      text: 'text-yellow-100',
      border: 'border-yellow-500/50',
    },
  };

  const config = statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full mr-1.5"
        style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
      ></span>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-300" />
      <span className="ml-2 text-sm font-medium text-purple-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);


export const ghostParticles = Array(30)
  .fill(0)
  .map((_) => ({
    size: Math.random() * 10 + 5,
    top: Math.random() * 100,
    left: Math.random() * 100,
    animDuration: Math.random() * 10 + 15,
    animDelay: Math.random() * 5,
  }));