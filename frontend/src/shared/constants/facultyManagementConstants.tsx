import { FiUser, FiMail, FiBriefcase } from 'react-icons/fi';

export const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Humanities',
  'Business',
];

export const STATUSES = ['All Statuses', 'Pending', 'Approved', 'Rejected'];

export const facultyColumns = [
  {
    header: 'Applicant',
    key: 'fullName',
    render: (faculty) => (
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm"></div>
          <span className="relative z-10 font-medium text-lg">
            {faculty.fullName?.[0]?.toUpperCase() || <FiUser />}
          </span>
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-200">{faculty.fullName || 'N/A'}</p>
          <p className="text-xs text-gray-400">ID: {faculty._id.substring(0, 8)}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Email',
    key: 'email',
    render: (faculty) => (
      <div className="flex items-center text-gray-300">
        <FiMail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{faculty.email || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Department',
    key: 'department',
    render: (faculty) => (
      <div className="flex items-center text-gray-300">
        <FiBriefcase size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{faculty.department || 'N/A'}</span>
      </div>
    ),
  },
  // The following columns should be injected with functions from the component
  {
    header: 'Applied On',
    key: 'createdAt',
    render: null, // Replace in component with a function using formatDate
  },
  {
    header: 'Status',
    key: 'status',
    render: null, // Replace in component with a function rendering status
  },
]; 