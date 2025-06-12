import React, { useState } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { NewAssignment } from './types';

interface CreateAssignmentModalProps {
  newAssignment: NewAssignment;
  setNewAssignment: (assignment: NewAssignment) => void;
  setShowCreateModal: (show: boolean) => void;
}

export default function CreateAssignmentModal({ newAssignment, setNewAssignment, setShowCreateModal }: CreateAssignmentModalProps) {
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewAssignment({ ...newAssignment, files: Array.from(e.target.files) });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50/50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50/50');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50/50');
    if (e.dataTransfer.files) {
      setNewAssignment({ ...newAssignment, files: Array.from(e.dataTransfer.files) });
    }
  };

  const createAssignment = () => {
    if (!newAssignment.title.trim()) {
      setError('Assignment title is required');
      return;
    }
    if (!newAssignment.subject) {
      setError('Subject is required');
      return;
    }
    if (!newAssignment.dueDate) {
      setError('Due date is required');
      return;
    }
    const maxMarksNum = parseFloat(newAssignment.maxMarks);
    if (isNaN(maxMarksNum) || maxMarksNum <= 0) {
      setError('Please enter a valid maximum marks greater than 0');
      return;
    }

    setShowCreateModal(false);
    setNewAssignment({ title: '', subject: '', dueDate: '', maxMarks: '', description: '', files: [] });
    setError('');
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setNewAssignment({ title: '', subject: '', dueDate: '', maxMarks: '', description: '', files: [] });
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Create New Assignment</h3>
              <p className="text-white/80 text-sm mt-1">Set up a new assignment for your students</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm animate-fadeInUp">
              {error}
            </div>
          )}
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
              placeholder="Enter assignment title"
            />
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={newAssignment.subject}
              onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
            >
              <option value="">Select Subject</option>
              <option>Database Systems</option>
              <option>Web Development</option>
              <option>Data Structures</option>
              <option>Algorithms</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
              />
            </div>
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Marks</label>
              <input
                type="number"
                value={newAssignment.maxMarks}
                onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
                placeholder="100"
                min="1"
              />
            </div>
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={6}
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80 resize-none"
              placeholder="Provide detailed assignment instructions..."
            />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Materials</label>
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center transition-all bg-gray-50/80 hover:bg-gray-100/80"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <FaUpload size={32} className="mx-auto text-indigo-500 mb-2" />
              <p className="text-gray-600 font-medium">Drag and drop files or click to browse</p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {newAssignment.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {newAssignment.files.map((file, index) => (
                    <div key={index} className="text-sm text-gray-500 flex items-center justify-center space-x-2">
                      <span>{file.name}</span>
                      <span>({Math.round(file.size / 1024)} KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-b-3xl border-t border-gray-100/50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={createAssignment}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
