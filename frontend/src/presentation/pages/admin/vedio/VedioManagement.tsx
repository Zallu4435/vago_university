import React, { useState } from 'react';
import { FiSearch, FiPlus, FiPlay, FiEdit, FiTrash2, FiFilter, FiUpload, FiEye, FiGrid, FiList, FiChevronDown, FiCalendar, FiClock, FiBookOpen, FiVideo, FiX, FiCheck } from 'react-icons/fi';

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

const VideoManagementPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS401');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

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

  const filteredVideos = videos
    .filter(video => video.courseId === selectedCourse)
    .filter(video => {
      if (activeTab === 'published') return video.status === 'Published';
      if (activeTab === 'drafts') return video.status === 'Draft';
      return true;
    })
    .filter(video => 
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(video => {
      if (filterStatus === 'all') return true;
      return video.status.toLowerCase() === filterStatus;
    });

  const AddVideoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedVideo ? 'Edit Video' : 'Add New Video'}
          </h3>
          <button 
            onClick={() => {setShowAddModal(false); setSelectedVideo(null);}}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Title *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter video title"
              defaultValue={selectedVideo?.title || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Video
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-500 font-medium">
                  Click to upload
                </button>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">MP4, AVI, MOV up to 500MB</p>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or paste video URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module/Section
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
                defaultValue={selectedVideo?.module || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Position
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the video content"
              defaultValue={selectedVideo?.description || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={selectedVideo?.status || 'Draft'}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => {setShowAddModal(false); setSelectedVideo(null);}}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            {selectedVideo ? 'Update Video' : 'Save Video'}
          </button>
        </div>
      </div>
    </div>
  );

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-screen overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Video Preview: {selectedVideo?.title}
          </h3>
          <button 
            onClick={() => {setShowPreviewModal(false); setSelectedVideo(null);}}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
            <FiPlay className="h-16 w-16 text-white opacity-75" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Duration:</span>
              <span className="ml-2 text-gray-600">{selectedVideo?.duration}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Module:</span>
              <span className="ml-2 text-gray-600">{selectedVideo?.module}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedVideo?.status === 'Published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedVideo?.status}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Uploaded:</span>
              <span className="ml-2 text-gray-600">{selectedVideo?.uploadedAt}</span>
            </div>
          </div>
          {selectedVideo?.description && (
            <div className="mt-4">
              <span className="font-medium text-gray-700">Description:</span>
              <p className="mt-1 text-gray-600">{selectedVideo.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Video Management</h1>
              <p className="text-gray-600 mt-1">Manage course video tutorials and content</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Add Video
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Course Selection & Filters */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Course Selection */}
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name} ({course.videoCount} videos)
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                <div className="flex items-center bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded text-sm ${
                      viewMode === 'table' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiList className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded text-sm ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Videos', count: filteredVideos.length },
                { key: 'published', label: 'Published', count: videos.filter(v => v.status === 'Published' && v.courseId === selectedCourse).length },
                { key: 'drafts', label: 'Drafts', count: videos.filter(v => v.status === 'Draft' && v.courseId === selectedCourse).length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <FiVideo className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No videos found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Get started by adding your first video.'}
                </p>
              </div>
            ) : viewMode === 'table' ? (
              // Table View
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Video
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVideos.map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                <FiPlay className="h-4 w-4 text-gray-500" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {video.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {video.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FiClock className="h-4 w-4 mr-1 text-gray-400" />
                            {video.duration}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Module {video.module}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            video.status === 'Published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {video.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {video.uploadedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {setSelectedVideo(video); setShowPreviewModal(true);}}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {setSelectedVideo(video); setShowAddModal(true);}}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <FiPlay className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {video.title}
                        </h3>
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${
                          video.status === 'Published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {video.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <FiClock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </div>
                        <div className="flex items-center">
                          <FiBookOpen className="h-3 w-3 mr-1" />
                          Module {video.module}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="h-3 w-3 mr-1" />
                          {video.uploadedAt}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {setSelectedVideo(video); setShowPreviewModal(true);}}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Preview
                        </button>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {setSelectedVideo(video); setShowAddModal(true);}}
                            className="p-1 text-gray-400 hover:text-indigo-600"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && <AddVideoModal />}
      {showPreviewModal && <PreviewModal />}
    </div>
  );
};

export default VideoManagementPage;