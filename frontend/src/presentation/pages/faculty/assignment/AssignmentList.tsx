import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEllipsisH, FaCalendar, FaClock, FaPlus, FaUsers, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Assignment } from './types';

interface AssignmentListProps {
  setSelectedAssignment: (assignment: Assignment) => void;
  setActiveTab: (tab: string) => void;
  setShowCreateModal: (show: boolean) => void;
}

export default function AssignmentList({ setSelectedAssignment, setActiveTab, setShowCreateModal }: AssignmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Database Design Project',
      description: 'Design and implement a complete database system for a library management system.',
      dueDate: '2024-12-20',
      createdDate: '2024-11-15',
      totalStudents: 45,
      submitted: 38,
      reviewed: 25,
      late: 5,
      status: 'active',
      subject: 'Database Systems',
      maxMarks: 100
    },
    {
      id: 2,
      title: 'React Component Development',
      description: 'Create a set of reusable React components with proper documentation.',
      dueDate: '2024-12-15',
      createdDate: '2024-11-10',
      totalStudents: 45,
      submitted: 42,
      reviewed: 40,
      late: 3,
      status: 'active',
      subject: 'Web Development',
      maxMarks: 80
    }
  ]);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSubjectIcon = (subject: string) => {
    if (subject.toLowerCase().includes('database')) return '🗄️';
    if (subject.toLowerCase().includes('web')) return '🌐';
    if (subject.toLowerCase().includes('mobile')) return '📱';
    if (subject.toLowerCase().includes('ai') || subject.toLowerCase().includes('machine')) return '🤖';
    return '📘';
  };

  const getProgressPercentage = (submitted: number, total: number) => {
    return Math.round((submitted / total) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-600';
      case 'draft': return 'from-yellow-500 to-orange-600';
      case 'closed': return 'from-gray-500 to-slate-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filter Section */}
      <div className="relative">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl border-2 border-gray-100 focus-within:border-indigo-300 transition-all">
                <FaSearch size={20} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search assignments by title or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-lg"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
              <FaFilter size={20} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
            </button>

            {/* Create Assignment Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3 group"
            >
              <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <FaPlus size={20} className="relative z-10" />
              <span className="relative z-10">Create Assignment</span>
            </button>
          </div>
        </div>

        {/* Floating Search Results Count */}
        {searchTerm && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
            {filteredAssignments.length} result{filteredAssignments.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Enhanced Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAssignments.map((assignment, index) => (
          <div 
            key={assignment.id} 
            className="group relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
            
            {/* Card Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getSubjectIcon(assignment.subject)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(assignment.status)}`}>
                      {assignment.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-xl mb-2 group-hover:text-indigo-600 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-indigo-600 font-medium mb-3">{assignment.subject}</p>
                </div>
                <button className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all group">
                  <FaEllipsisH size={16} />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                {assignment.description}
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 text-center border border-indigo-200">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <FaUsers className="text-indigo-600" size={16} />
                    <p className="text-2xl font-bold text-indigo-600">{assignment.submitted}</p>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium">Submitted</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <FaCheckCircle className="text-green-600" size={16} />
                    <p className="text-2xl font-bold text-green-600">{assignment.reviewed}</p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">Reviewed</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-gray-800">
                    {getProgressPercentage(assignment.submitted, assignment.totalStudents)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getProgressPercentage(assignment.submitted, assignment.totalStudents)}%` }}
                  ></div>
                </div>
              </div>

              {/* Due Date and Late Status */}
              <div className="flex items-center justify-between text-sm mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaCalendar size={14} className="text-indigo-500" />
                  <span className="font-medium">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
                {assignment.late > 0 && (
                  <div className="flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-200">
                    <FaExclamationCircle size={12} />
                    <span className="text-xs font-bold">{assignment.late} late</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setActiveTab('submissions');
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>View Submissions</span>
                <div className="w-0 group-hover:w-5 transition-all duration-300 overflow-hidden">
                  <span>→</span>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-16">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No assignments found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search terms or create a new assignment</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            Create Your First Assignment
          </button>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}