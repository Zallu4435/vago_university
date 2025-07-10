import { FiBook, FiBriefcase, FiUser, FiClock } from 'react-icons/fi';
import { Diploma, Enrollment } from '../../domain/types/management/diplomamanagement';

export const CATEGORIES = ['All Categories', 'Programming', 'Data Science', 'Business', 'Design', 'Marketing'];
export const STATUSES = ['All', 'Active', 'Inactive', 'Pending', 'Approved', 'Rejected'];

export const diplomaColumns = [
    {
        header: 'Title',
        key: 'title',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiBook size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.title}</span>
            </div>
        ),
        width: '25%',
    },
    {
        header: 'Category',
        key: 'category',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiBriefcase size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.category}</span>
            </div>
        ),
    },
    {
        header: 'Price',
        key: 'price',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <span className="text-sm">₹{diploma.price.toFixed(2)}</span>
            </div>
        ),
    },
    {
        header: 'Duration',
        key: 'duration',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiClock size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.duration}</span>
            </div>
        ),
    },
    {
        header: 'Videos',
        key: 'videoCount',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiBook size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.videoCount}</span>
            </div>
        ),
    },
    {
        header: 'Status',
        key: 'status',
        render: (diploma: Diploma) => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${diploma.status ? 'bg-green-900/30 text-green-400 border-green-500/30' : 'bg-red-900/30 text-red-400 border-red-500/30'
                    }`}
            >
                <span className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}></span>
                {diploma.status ? 'Active' : 'Inactive'}
            </span>
        ),
    },
];

export const enrollmentColumns = [
    {
        header: 'Student',
        key: 'studentName',
        render: (enrollment: Enrollment) => (
            <div className="flex items-center text-gray-300">
                <FiUser size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{enrollment.studentName}</span>
            </div>
        ),
        width: '20%',
    },
    {
        header: 'Course',
        key: 'courseTitle',
        render: (enrollment: Enrollment) => (
            <div className="flex items-center text-gray-300">
                <FiBook size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{enrollment.courseTitle}</span>
            </div>
        ),
    },
    {
        header: 'Progress',
        key: 'progress',
        render: (enrollment: Enrollment) => {
            // ... Progress bar logic omitted for brevity, copy from original file ...
            return null;
        },
    },
    {
        header: 'Status',
        key: 'status',
        render: (enrollment: Enrollment) => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${enrollment.status === 'Approved'
                        ? 'bg-green-900/30 text-green-400 border-green-500/30'
                        : enrollment.status === 'Pending'
                            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-900/30 text-red-400 border-red-500/30'
                    }`}
            >
                <span className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}></span>
                {enrollment.status}
            </span>
        ),
    },
    {
        header: 'Enrollment Date',
        key: 'enrollmentDate',
        render: (enrollment: Enrollment) => (
            <div className="flex items-center text-gray-300">
                <FiClock size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
            </div>
        ),
    },
]; 