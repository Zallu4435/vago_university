import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Session } from './types';

interface EditSessionModalProps {
  session: Session;
  setShowEditModal: (show: boolean) => void;
  editSession: (session: Session) => void;
}

export default function EditSessionModal({ session, setShowEditModal, editSession }: EditSessionModalProps) {
  // Extract date and time from startTime if present
  function extractDateTime(startTime?: string) {
    if (!startTime) return { date: '', time: '' };
    const d = new Date(startTime);
    const date = d.toISOString().slice(0, 10);
    const time = d.toTimeString().slice(0, 5);
    return { date, time };
  }

  const [editedSession, setEditedSession] = useState(() => {
    const { date, time } = extractDateTime((session as any).startTime);
    return {
      ...session,
      date: (session as any).date || date,
      time: (session as any).time || time,
      maxAttendees: session.maxAttendees.toString(),
      duration: session.duration.toString(),
      tags: session.tags.join(', ')
    };
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedSession.title.trim()) {
      setError('Session title is required');
      return;
    }
    if (!editedSession.instructor) {
      setError('Instructor is required');
      return;
    }
    if (!editedSession.course) {
      setError('Course is required');
      return;
    }
    if (!editedSession.date) {
      setError('Date is required');
      return;
    }
    if (!editedSession.time) {
      setError('Time is required');
      return;
    }
    const maxAttendeesNum = parseInt(editedSession.maxAttendees);
    if (isNaN(maxAttendeesNum) || maxAttendeesNum <= 0) {
      setError('Please enter a valid maximum number of attendees');
      return;
    }
    const durationNum = parseFloat(editedSession.duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    editSession({
      ...editedSession,
      maxAttendees: maxAttendeesNum,
      duration: durationNum.toString(),
      tags: editedSession.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
    setError('');
  };

  const handleClose = () => {
    setShowEditModal(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">Edit Session</h3>
              <p className="text-white/80 text-sm mt-1">Update session details</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
            <input
              type="text"
              value={editedSession.title}
              onChange={(e) => setEditedSession({ ...editedSession, title: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
              placeholder="Enter session title"
            />
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <select
              value={editedSession.instructor}
              onChange={(e) => setEditedSession({ ...editedSession, instructor: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
            >
              <option value="">Select Instructor</option>
              <option>Dr. Alice Smith</option>
              <option>Prof. Bob Johnson</option>
            </select>
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={editedSession.course}
              onChange={(e) => setEditedSession({ ...editedSession, course: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
            >
              <option value="">Select Course</option>
              <option>Database Systems</option>
              <option>Web Development</option>
              <option>Data Structures</option>
              <option>Algorithms</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={editedSession.date}
                onChange={(e) => setEditedSession({ ...editedSession, date: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
              />
            </div>
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={editedSession.time}
                onChange={(e) => setEditedSession({ ...editedSession, time: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <input
                type="number"
                step="0.5"
                value={editedSession.duration}
                onChange={(e) => setEditedSession({ ...editedSession, duration: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
                placeholder="e.g., 2"
              />
            </div>
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
              <input
                type="number"
                value={editedSession.maxAttendees}
                onChange={(e) => setEditedSession({ ...editedSession, maxAttendees: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
                placeholder="e.g., 50"
              />
            </div>
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              value={editedSession.description}
              onChange={(e) => setEditedSession({ ...editedSession, description: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80 resize-none"
              placeholder="Provide session details..."
            />
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={editedSession.tags}
              onChange={(e) => setEditedSession({ ...editedSession, tags: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
              placeholder="e.g., SQL, Database"
            />
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '1.0s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={editedSession.difficulty}
              onChange={(e) => setEditedSession({ ...editedSession, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
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
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform-bg-gray-50/80 backdrop-blur-sm p-150">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
