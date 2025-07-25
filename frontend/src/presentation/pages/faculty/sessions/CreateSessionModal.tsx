import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Session, NewSession } from './types';

interface CreateSessionModalProps {
  setShowCreateModal: (show: boolean) => void;
  createSession?: (session: Session) => void;
  editSession?: (session: Session) => void;
  sessionToEdit?: Session | null;
}

export default function CreateSessionModal({ setShowCreateModal, createSession, editSession, sessionToEdit }: CreateSessionModalProps) {
  const isEditMode = !!sessionToEdit;
  const [newSession, setNewSession] = useState<NewSession>({
    title: '',
    instructor: '',
    course: '',
    date: '',
    time: '',
    duration: '',
    maxAttendees: '',
    description: '',
    tags: '',
    difficulty: 'beginner'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && sessionToEdit) {
      // Split startTime into date and time
      let date = '';
      let time = '';
      if (sessionToEdit.startTime) {
        const dt = new Date(sessionToEdit.startTime);
        date = dt.toISOString().slice(0, 10); // yyyy-mm-dd
        time = dt.toTimeString().slice(0, 5); // hh:mm
      }
      setNewSession({
        title: sessionToEdit.title || '',
        instructor: sessionToEdit.instructor || '',
        course: sessionToEdit.course || '',
        date,
        time,
        duration: sessionToEdit.duration ? String(sessionToEdit.duration) : '',
        maxAttendees: sessionToEdit.maxAttendees ? String(sessionToEdit.maxAttendees) : '',
        description: sessionToEdit.description || '',
        tags: Array.isArray(sessionToEdit.tags) ? sessionToEdit.tags.join(', ') : '',
        difficulty: sessionToEdit.difficulty || 'beginner',
      });
    } else {
      setNewSession({
        title: '',
        instructor: '',
        course: '',
        date: '',
        time: '',
        duration: '',
        maxAttendees: '',
        description: '',
        tags: '',
        difficulty: 'beginner'
      });
    }
    setError('');
  }, [isEditMode, sessionToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.title.trim()) {
      setError('Session title is required');
      return;
    }
    if (!newSession.instructor) {
      setError('Instructor is required');
      return;
    }
    if (!newSession.course) {
      setError('Course is required');
      return;
    }
    if (!newSession.date) {
      setError('Date is required');
      return;
    }
    if (!newSession.time) {
      setError('Time is required');
      return;
    }
    const maxAttendeesNum = parseInt(newSession.maxAttendees);
    if (isNaN(maxAttendeesNum) || maxAttendeesNum <= 0) {
      setError('Please enter a valid maximum number of attendees');
      return;
    }
    const durationNum = newSession.duration;
    if (!durationNum || isNaN(Number(durationNum)) || Number(durationNum) <= 0) {
      setError('Please enter a valid duration');
      return;
    }

    // Combine date and time into ISO string for startTime
    const startTime = new Date(`${newSession.date}T${newSession.time}`).toISOString();

    const sessionPayload: Session = {
      id: sessionToEdit?.id || Date.now(),
      title: newSession.title,
      instructor: newSession.instructor,
      course: newSession.course,
      startTime, // use ISO string
      duration: newSession.duration,
      maxAttendees: maxAttendeesNum,
      description: newSession.description,
      tags: newSession.tags.split(',').map(t => t.trim()).filter(Boolean),
      difficulty: newSession.difficulty,
      status: sessionToEdit?.status || 'upcoming',
      isLive: sessionToEdit?.isLive || false,
      hasRecording: sessionToEdit?.hasRecording || false,
      recordingUrl: sessionToEdit?.recordingUrl,
      attendees: sessionToEdit?.attendees || 0,
      attendeeList: sessionToEdit?.attendeeList || [],
    };
    if (isEditMode && editSession) {
      editSession(sessionPayload);
    } else if (createSession) {
      createSession(sessionPayload);
    }
    setError('');
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{isEditMode ? 'Edit Session' : 'Create New Session'}</h3>
              <p className="text-white/80 text-sm mt-1">{isEditMode ? 'Update session details' : 'Set up a new live session for your course'}</p>
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
            <input
              type="text"
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
              placeholder="Enter session title"
            />
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <select
              value={newSession.instructor}
              onChange={(e) => setNewSession({ ...newSession, instructor: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
            >
              <option value="">Select Instructor</option>
              <option>Dr. Alice Smith</option>
              <option>Prof. Bob Johnson</option>
            </select>
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <select
              value={newSession.course}
              onChange={(e) => setNewSession({ ...newSession, course: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newSession.date}
                onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
              />
            </div>
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={newSession.time}
                onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <input
                type="number"
                step="0.5"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                placeholder="e.g., 2"
              />
            </div>
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
              <input
                type="number"
                value={newSession.maxAttendees}
                onChange={(e) => setNewSession({ ...newSession, maxAttendees: e.target.value })}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                placeholder="e.g., 50"
              />
            </div>
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={4}
              value={newSession.description}
              onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80 resize-none"
              placeholder="Provide session details..."
            />
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={newSession.tags}
              onChange={(e) => setNewSession({ ...newSession, tags: e.target.value })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
              placeholder="e.g., SQL, Database"
            />
          </div>
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '1.0s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={newSession.difficulty}
              onChange={(e) => setNewSession({ ...newSession, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
              className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
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
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              type="submit"
            >
              {isEditMode ? 'Update Session' : 'Create Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
