import { FiFileText, FiVideo, FiTag } from 'react-icons/fi';
import { Material } from '../../domain/types/management/materialmanagement';

// Material Filter Options
export const SUBJECTS = ['All Subjects', 'Mathematics', 'Computer Science', 'Physics', 'Chemistry'];
export const COURSES = ['All Courses', 'B.Sc. Mathematics', 'B.Tech. CS', 'B.Sc. Physics'];
export const SEMESTERS = ['All Semesters', '1', '2', '3', '4', '5', '6'];
export const TYPES = ['All Types', 'pdf', 'video'];
export const UPLOADERS = ['All Uploaders', 'Dr. Smith', 'Prof. Jones'];

// Material Column Definitions
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