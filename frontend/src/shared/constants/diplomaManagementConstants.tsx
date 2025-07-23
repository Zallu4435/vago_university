import { FiBook, FiBriefcase, FiClock } from 'react-icons/fi';
import { Diploma } from '../../domain/types/management/diplomamanagement';

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
