import { FiVideo } from 'react-icons/fi';
import { Diploma, Video } from '../../domain/types/diploma';

export const ITEMS_PER_PAGE = 10;

export const STATUS_OPTIONS = ['All Status', 'Published', 'Draft'];

export const getCategoryOptions = (diplomasData: { diplomas: Diploma[] }) => diplomasData?.diplomas.map((d: Diploma) => d.category) || [];

export const getTabs = (filteredVideos: Video[], activeTab: string) => [
  {
    label: `All Videos (${filteredVideos.length})`,
    icon: <FiVideo size={16} />,
    active: activeTab === 'all',
  },
  {
    label: `Published (${filteredVideos.filter(v => v.status === 'Published').length})`,
    icon: <FiVideo size={16} />,
    active: activeTab === 'published',
  },
  {
    label: `Drafts (${filteredVideos.filter(v => v.status === 'Draft').length})`,
    icon: <FiVideo size={16} />,
    active: activeTab === 'drafts',
  },
]; 