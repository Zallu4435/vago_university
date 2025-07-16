import { useState } from 'react';
import { FaSearch, FaFilter, FaCalendar, FaPlus, FaUsers, FaCheckCircle, FaTrash, FaEdit } from 'react-icons/fa';
import { Assignment } from './types/index';
import WarningModal from '../../../components/common/WarningModal';
import { assignmentService } from './services/assignmentService';

interface AssignmentListProps {
  assignments: Assignment[];
  isLoading: boolean;
  error: any;
  setSelectedAssignment: (assignment: Assignment | null) => void;
  setActiveTab: (tab: string) => void;
  setShowCreateModal: (show: boolean) => void;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  isDeleting: boolean;
  onUpdate: (id: string, data: Partial<Assignment>) => Promise<{ success: boolean; error?: string }>;
  isUpdating: boolean;
}

export default function AssignmentList({
  assignments,
  isLoading,
  error,
  setSelectedAssignment,
  setActiveTab,
  setShowCreateModal,
  onDelete,
  isDeleting,
  isUpdating
}: AssignmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [isFetchingAssignment, setIsFetchingAssignment] = useState(false);

  const handleDeleteClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (assignmentToDelete) {
      const result = await onDelete(assignmentToDelete._id);
      if (result.success) {
        setShowDeleteModal(false);
        setAssignmentToDelete(null);
      }
    }
  };

  const handleEditClick = async (assignment: Assignment) => {
    try {
      setIsFetchingAssignment(true);
      const response = await assignmentService.getAssignmentById(assignment._id);
      const updatedAssignment = response?.assignment;

      setSelectedAssignment(updatedAssignment);
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error fetching assignment details:', error);
    } finally {
      setIsFetchingAssignment(false);
    }
  };

  const filteredAssignments = assignments?.filter(assignment =>
    assignment.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    assignment.subject?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const getSubjectIcon = (subject: string) => {
    if (subject?.toLowerCase().includes('database')) return '🗄️';
    if (subject?.toLowerCase().includes('web')) return '🌐';
    if (subject?.toLowerCase().includes('mobile')) return '📱';
    if (subject?.toLowerCase().includes('ai') || subject.toLowerCase().includes('machine')) return '🤖';
    return '📘';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-600';
      case 'draft': return 'from-yellow-500 to-orange-600';
      case 'closed': return 'from-gray-500 to-slate-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-6xl">⚠️</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">Error loading assignments</h3>
        <p className="text-gray-500 mb-6">{error.message || 'Please try again later'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filter Section */}
      <div className="relative">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-100 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl border-2 border-gray-100 focus-within:border-pink-300 transition-all">
                <FaSearch size={20} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search assignments by title or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-lg rounded-2xl"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button className="px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-pink-300 hover:bg-pink-50 transition-all group">
              <FaFilter size={20} className="text-gray-500 group-hover:text-pink-600 transition-colors" />
            </button>

            {/* Create Assignment Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3 group"
            >
              <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <FaPlus size={20} className="relative z-10" />
              <span className="relative z-10">Create Assignment</span>
            </button>
          </div>
        </div>

        {/* Floating Search Results Count */}
        {searchTerm && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
            {filteredAssignments.length} result{filteredAssignments.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Enhanced Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAssignments.map((assignment, index) => (
          <div
            key={assignment._id}
            className="group relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>

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
                  <h3 className="font-bold text-purple-900 text-xl mb-2 group-hover:text-pink-600 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-pink-600 font-medium mb-3">{assignment.subject}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="p-3 text-gray-400 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-all"
                    onClick={() => handleEditClick(assignment)}
                    disabled={isUpdating || isFetchingAssignment}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="p-3 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all"
                    onClick={() => handleDeleteClick(assignment)}
                    disabled={isDeleting}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-6 line-clamp-3 leading-relaxed">
                {assignment.description}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center border border-pink-100">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <FaUsers className="text-pink-600" size={16} />
                    <p className="text-2xl font-bold text-pink-600">{assignment.submissionCount ?? 0}</p>
                  </div>
                  <p className="text-xs text-pink-600 font-medium">Submissions</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <FaCheckCircle className="text-green-600" size={16} />
                    <p className="text-2xl font-bold text-green-600">{assignment.averageMark ?? 0}</p>
                  </div>
                  <p className="text-xs text-green-600 font-medium">Average Mark</p>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center justify-between text-sm mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FaCalendar size={14} className="text-pink-500" />
                  <span className="font-medium">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setActiveTab('submissions');
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
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
          <div className="w-32 h-32 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-pink-700 mb-2">No assignments found</h3>
          <p className="text-pink-500 mb-6">Try adjusting your search terms or create a new assignment</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Create Your First Assignment
          </button>
        </div>
      )}

      {/* Delete Warning Modal */}
      <div className="relative z-[9999]">
        <WarningModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setAssignmentToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Assignment"
          message={assignmentToDelete ? `Are you sure you want to delete "${assignmentToDelete.title}"? This action cannot be undone.` : ''}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>

      {/* Custom Styles */}
      <style>{`        @keyframes fadeInUp {
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
      `}</style>
    </div>
  );
}
