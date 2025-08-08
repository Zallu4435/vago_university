import { FiBook, FiBriefcase, FiUser, FiHash, FiClock, FiUsers } from 'react-icons/fi';
import { Course, EnrollmentRequest } from '../../domain/types/management/coursemanagement';

export const SPECIALIZATIONS = [
  'All Specializations',
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Web Development',
  'Mobile Development',
  'Database Management',
  'Cloud Computing',
  'Network Engineering',
  'Game Development',
];

export const FACULTIES = ['All Faculties', 'Dr. Sarah Johnson', 'Dr. Michael Chen'];
export const TERMS = ['All Terms', 'Fall 2024', 'Spring 2024', 'Summer 2024'];
export const REQUEST_STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];

export const courseColumns = [
  {
    header: 'Title',
    key: 'title',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiBook size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.title || 'N/A'}</span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Specialization',
    key: 'specialization',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiBriefcase size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.specialization || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Faculty',
    key: 'faculty',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiUser size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.faculty || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Credits',
    key: 'credits',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiHash size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.credits ?? 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Enrollment',
    key: 'currentEnrollment',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiUsers size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{`${course.currentEnrollment}/${course.maxEnrollment}`}</span>
      </div>
    ),
  },
];

export const enrollmentRequestColumns = [
  {
    header: 'Student Name',
    key: 'studentName',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiUser size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.studentName || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Course',
    key: 'courseTitle',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiBook size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.courseTitle || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Specialization',
    key: 'specialization',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiBriefcase size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.specialization || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Term',
    key: 'term',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiClock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.term || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: EnrollmentRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          request.status === 'Pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status === 'Approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {request.status}
      </span>
    ),
  },
]; 