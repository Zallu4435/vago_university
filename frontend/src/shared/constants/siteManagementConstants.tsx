import { FiStar, FiZap, FiUser } from 'react-icons/fi';
import { Section, SiteSectionKey } from '../../domain/types/management/sitemanagement';
import { SiteSection } from '../../application/services/siteManagement.service';
import { formatDate } from '../utils/dateUtils';

export const SECTIONS: Section[] = [
  {
    key: 'highlights',
    label: 'Highlights',
    icon: <FiStar size={16} />,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter highlight title' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'General News, Research, Education, Events, Facilities, Student Life' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter highlight description' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'link', label: 'Link', type: 'text', placeholder: 'https://example.com' }
    ]
  },
  {
    key: 'vagoNow',
    label: 'VAGO Now',
    icon: <FiZap size={16} />,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter VAGO Now title' },
      { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'Events, Facilities, Research, Student Life, Financial Services, Business, Technology, Health Services' },
      { name: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Enter VAGO Now description' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'link', label: 'Link', type: 'text', placeholder: 'https://example.com' }
    ]
  },
  {
    key: 'leadership',
    label: 'Leadership',
    icon: <FiUser size={16} />,
    fields: [
      { name: 'title', label: 'Name', type: 'text', required: true, placeholder: 'Enter leader name' },
      { name: 'category', label: 'Department', type: 'text', required: true, placeholder: 'Academic Affairs, Student Services, Finance, Human Resources, IT Services, Facilities Management, Research & Development, External Relations' },
      { name: 'description', label: 'Position', type: 'textarea', required: true, placeholder: 'Enter position title' },
      { name: 'image', label: 'Photo', type: 'image' },
      { name: 'link', label: 'Link', type: 'text', placeholder: 'https://example.com' }
    ]
  }
];

export const createColumns = (sectionKey: SiteSectionKey) => [
  {
    header: 'Title',
    key: 'title',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        {sectionKey === 'highlights' && <FiStar size={14} className="text-purple-400 mr-2" />}
        {sectionKey === 'vagoNow' && <FiZap size={14} className="text-purple-400 mr-2" />}
        {sectionKey === 'leadership' && <FiUser size={14} className="text-purple-400 mr-2" />}
        <span className="text-sm">{item.title || 'N/A'}</span>
      </div>
    ),
    width: '25%',
  },
  {
    header: 'Category',
    key: 'category',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm bg-purple-900/30 px-2 py-1 rounded text-purple-300">
          {item.category || 'N/A'}
        </span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Created',
    key: 'createdAt',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm">{formatDate(item.createdAt)}</span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Updated',
    key: 'updatedAt',
    render: (item: SiteSection & { _id: string }) => (
      <div className="flex items-center text-gray-300">
        <span className="text-sm">{formatDate(item.updatedAt)}</span>
      </div>
    ),
    width: '20%',
  },
];

export const columnsMap: Record<SiteSectionKey, unknown[]> = {
  highlights: createColumns('highlights'),
  vagoNow: createColumns('vagoNow'),
  leadership: createColumns('leadership'),
};

export const filterOptions: { [key: string]: string[] } = {
  category: [
    'All Categories',
    'Events',
    'News',
    'Research',
    'Education',
    'Student Life',
    'Facilities',
    'Awards',
    'Technology',
    'Business',
    'Health Services',
    'Financial Services',
    'Academic Affairs',
    'Student Services',
    'Finance',
    'Human Resources',
    'IT Services',
    'Facilities Management',
    'Research & Development',
    'External Relations'
  ],
};

export const ghostParticles = Array(30)
  .fill(0)
  .map((_) => ({
    size: Math.random() * 10 + 5,
    top: Math.random() * 100,
    left: Math.random() * 100,
    animDuration: Math.random() * 10 + 15,
    animDelay: Math.random() * 5,
  }));