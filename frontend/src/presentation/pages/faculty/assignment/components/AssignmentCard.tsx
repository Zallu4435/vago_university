import { useState } from 'react';
import { FaEllipsisH, FaCalendar, FaUsers, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { Assignment } from '../types';
import WarningModal from './WarningModal';

interface AssignmentCardProps {
  assignment: Assignment;
  onViewSubmissions: (assignment: Assignment) => void;
  onDelete: (id: string) => Promise<boolean>;
  isDeleting: boolean;
  getSubjectIcon: (subject: string) => string;
  getStatusColor: (status: string) => string;
}

export default function AssignmentCard({
  assignment,
  onViewSubmissions,
  onDelete,
  isDeleting,
  getSubjectIcon,
  getStatusColor
}: AssignmentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const handleDeleteConfirm = async () => {
    const success = await onDelete(assignment._id);
    if (success) {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="group relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fadeInUp">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
      
      {/* Card Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
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
          <div className="relative">
            <button 
              className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaEllipsisH size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <FaTrash size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
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
              <p className="text-2xl font-bold text-indigo-600">{assignment.totalSubmissions}</p>
            </div>
            <p className="text-xs text-indigo-600 font-medium">Submitted</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <FaCheckCircle className="text-green-600" size={16} />
              <p className="text-2xl font-bold text-green-600">{assignment.averageMarks || 0}</p>
            </div>
            <p className="text-xs text-green-600 font-medium">Average Marks</p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between text-sm mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <FaCalendar size={14} className="text-indigo-500" />
            <span className="font-medium">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewSubmissions(assignment)}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
        >
          <span>View Submissions</span>
          <div className="w-0 group-hover:w-5 transition-all duration-300 overflow-hidden">
            <span>→</span>
          </div>
        </button>
      </div>

      {/* Delete Warning Modal */}
      <WarningModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${assignment.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </div>
  );
} 