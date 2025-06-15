import { useState } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import { Assignment } from '../types';
import AssignmentMenu from './AssignmentMenu';

interface AssignmentListProps {
  assignments: Assignment[];
  onEdit: (assignment: Assignment) => void;
  onView: (assignment: Assignment) => void;
  onDelete: (id: string) => Promise<boolean>;
  isDeleting: boolean;
}

const AssignmentList = ({ assignments, onEdit, onView, onDelete, isDeleting }: AssignmentListProps) => {
  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div
          key={assignment._id}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{assignment.subject}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(assignment)}
                className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
              >
                <FaEye size={16} />
              </button>
              <button
                onClick={() => onEdit(assignment)}
                className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
              >
                <FaEdit size={16} />
              </button>
              <AssignmentMenu
                assignment={assignment}
                onDelete={onDelete}
                isDeleting={isDeleting}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
              <span className="text-sm text-gray-500">
                Status: {assignment.status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Submissions: {assignment.totalSubmissions || 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentList; 