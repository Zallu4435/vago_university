import React, { useState } from 'react';
import { FiPlay, FiEdit, FiTrash2, FiUpload, FiEye, FiGrid, FiList, FiCalendar, FiClock, FiBookOpen, FiVideo, FiX } from 'react-icons/fi';
import { debounce } from 'lodash';
import Header from '../User/Header'; // Import Header as used in UserManagement
import Pagination from '../User/Pagination'; // Import Pagination as used in UserManagement
import AddVideoModal from './AddVideoModal';
import VideoPreviewModal from './VideoPreviewModal';

interface Video {
  id: string;
  title: string;
  duration: string;
  uploadedAt: string;
  module: number;
  status: string;
  courseId: string;
  description: string;
}

// Minimal FilterPanel stub to satisfy Header dependency
interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filters: { [key: string]: string | undefined };
  filterOptions: { [key: string]: string[] | { id: string; name: string; videoCount: number }[] };
  debouncedFilterChange: (field: string, value: string) => void;
  customDateRange?: { startDate: string; endDate: string };
  handleCustomDateChange?: (field: 'startDate' | 'endDate', value: string) => void;
  handleResetFilters: () => void;
}

// Main VideoManagementPage Component
const VideoManagementPage = () => {
  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>({ status: 'all', course: 'CS401' });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Sample data
  const courses = [
    { id: 'CS401', name: 'CS401 – Advanced Algorithms', videoCount: 12 },
    { id: 'CS301', name: 'CS301 – Data Structures', videoCount: 8 },
    { id: 'CS201', name: 'CS201 – Programming Fundamentals', videoCount: 15 },
    { id: 'MATH201', name: 'MATH201 – Discrete Mathematics', videoCount: 6 }
  ];

  const videos = [
    {
      id: 'V001',
      title: 'Introduction to Dynamic Programming',
      duration: '25:30',
      uploadedAt: '2024-01-15',
      module: 1,
      status: 'Published',
      courseId: 'CS401',
      description: 'Basic concepts and principles of dynamic programming'
    },
    {
      id: 'V002',
      title: 'Merge Sort Algorithm',
      duration: '18:45',
      uploadedAt: '2024-01-20',
      module: 2,
      status: 'Published',
      courseId: 'CS401',
      description: 'Detailed explanation of merge sort implementation'
    },
    {
      id: 'V003',
      title: 'Graph Traversal - BFS & DFS',
      duration: '32:15',
      uploadedAt: '2024-01-25',
      module: 3,
      status: 'Draft',
      courseId: 'CS401',
      description: 'Breadth-first and depth-first search algorithms'
    },
    {
      id: 'V004',
      title: 'Dijkstra\'s Shortest Path',
      duration: '28:20',
      uploadedAt: '2024-02-01',
      module: 4,
      status: 'Published',
      courseId: 'CS401',
      description: 'Finding shortest paths in weighted graphs'
    }
  ];

  const filterOptions = {
    status: ['All Status', 'Published', 'Draft'],
    courses,
  };

  const debouncedFilterChange = debounce((field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, 500);

  const handleResetFilters = () => {
    setFilters({ status: 'all', course: 'CS401' });
    setSearchQuery('');
  };

  const filteredVideos = videos
    .filter(video => video.courseId === (filters.course || 'CS401'))
    .filter(video => {
      if (activeTab === 'published') return video.status === 'Published';
      if (activeTab === 'drafts') return video.status === 'Draft';
      return true;
    })
    .filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(video => {
      if (filters.status === 'all') return true;
      return video.status.toLowerCase() === (filters.status || 'all');
    });

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const paginatedVideos = filteredVideos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const tabs = [
    { 
      label: `All Videos (${filteredVideos.length})`, 
      icon: <FiVideo size={16} />, 
      active: activeTab === 'all' 
    },
    { 
      label: `Published (${videos.filter(v => v.status === 'Published' && v.courseId === (filters.course || 'CS401')).length})`, 
      icon: <FiVideo size={16} />, 
      active: activeTab === 'published' 
    },
    { 
      label: `Drafts (${videos.filter(v => v.status === 'Draft' && v.courseId === (filters.course || 'CS401')).length})`, 
      icon: <FiVideo size={16} />, 
      active: activeTab === 'drafts' 
    }
  ];

  const handleTabClick = (index: number) => {
    const tabKeys = ['all', 'published', 'drafts'];
    setActiveTab(tabKeys[index]);
    setPage(1);
  };

  const handleSaveVideo = (videoData: Partial<Video>) => {
    // TODO: Implement save logic
    console.log('Saving video:', videoData);
    setShowAddModal(false);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-md"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Video Management"
          subtitle="Manage course video tutorials and content"
          tabs={tabs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search by title..."
          filters={filters}
          filterOptions={filterOptions}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={handleTabClick}
        />

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <FiUpload className="h-4 w-4" />
            <span>Add New Video</span>
          </button>
          <div className="flex items-center bg-gray-800/60 backdrop-blur-sm rounded-lg p-1 border border-purple-500/30">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded text-sm ${
                viewMode === 'table' 
                  ? 'bg-purple-600/30 text-white shadow-sm border border-purple-500/50' 
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded text-sm ${
                viewMode === 'grid' 
                  ? 'bg-purple-600/30 text-white shadow-sm border border-purple-500/50' 
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-500/30">
          <div className="p-6">
            {paginatedVideos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                  <FiVideo className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Videos Found</h3>
                <p className="text-purple-300 text-center max-w-sm">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding your first video.'}
                </p>
              </div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Video
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {paginatedVideos.map((video) => (
                      <tr key={video.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex items-center justify-center shadow-lg">
                                <FiPlay className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {video.title}
                              </div>
                              <div className="text-sm text-purple-300">
                                ID: {video.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-white">
                            <FiClock className="h-4 w-4 mr-1 text-purple-400" />
                            {video.duration}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          <div className="flex items-center">
                            <FiBookOpen className="h-4 w-4 mr-1 text-purple-400" />
                            Module {video.module}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${
                            video.status === 'Published' 
                              ? 'bg-green-900/30 text-green-400 border-green-500/30'
                              : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                          }`}>
                            <span
                              className="h-1.5 w-1.5 rounded-full mr-1.5"
                              style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
                            ></span>
                            {video.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                          <div className="flex items-center">
                            <FiCalendar className="h-4 w-4 mr-1 text-purple-400" />
                            {video.uploadedAt}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {setSelectedVideo(video); setShowPreviewModal(true);}}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {setSelectedVideo(video); setShowAddModal(true);}}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  itemsCount={paginatedVideos.length}
                  itemName="videos"
                  onPageChange={setPage}
                  onFirstPage={() => setPage(1)}
                  onLastPage={() => setPage(totalPages)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedVideos.map((video) => (
                  <div key={video.id} className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-600 rounded-t-lg flex items-center justify-center">
                      <FiPlay className="h-8 w-8 text-white opacity-75" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {video.title}
                        </h3>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full border inline-flex items-center ${
                          video.status === 'Published' 
                            ? 'bg-green-900/30 text-green-400 border-green-500/30'
                            : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                        }`}>
                          <span
                            className="h-1.5 w-1.5 rounded-full mr-1.5"
                            style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
                          ></span>
                          {video.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-purple-300 mb-3">
                        <div className="flex items-center">
                          <FiClock className="h-3 w-3 mr-1 text-purple-400" />
                          {video.duration}
                        </div>
                        <div className="flex items-center">
                          <FiBookOpen className='h-3 w-3 mr-1 text-purple-400'/>
                          Module {video.module}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="h-3 w-3 mr-1 text-purple-400" />
                          {video.uploadedAt}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {setSelectedVideo(video); setShowPreviewModal(true);}}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Preview
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {setSelectedVideo(video); setShowAddModal(true);}}
                            className="p-1 text-purple-300 hover:text-purple-400"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-purple-300 hover:text-red-400">
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  itemsCount={paginatedVideos.length}
                  itemName="videos"
                  onPageChange={setPage}
                  onFirstPage={() => setPage(1)}
                  onLastPage={() => setPage(totalPages)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals rendered at root level */}
      <AddVideoModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        selectedVideo={selectedVideo}
        courses={courses}
        onSave={handleSaveVideo}
      />
      <VideoPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        video={selectedVideo}
      />

      <style>
        {`
          @keyframes floatingMist {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0.2;
            }
            50% {
              transform: translateY(-20px) translateX(10px);
              opacity: 0.7;
            }
            100% {
              transform: translateY(0) translateX(0);
              opacity: 0.2;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VideoManagementPage;