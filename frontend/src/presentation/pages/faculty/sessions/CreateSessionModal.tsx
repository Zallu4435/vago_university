import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from './types';
import { SessionFormData, sessionSchema } from '../../../../domain/validation/management/sessionSchema';

interface CreateSessionModalProps {
  setShowCreateModal: (show: boolean) => void;
  createSession?: (session: Session) => void;
  editSession?: (session: Session) => void;
  sessionToEdit?: Session | null;
}

export default function CreateSessionModal({ setShowCreateModal, createSession, editSession, sessionToEdit }: CreateSessionModalProps) {
  const isEditMode = !!sessionToEdit;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
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
    }
  });

  useEffect(() => {
    if (isEditMode && sessionToEdit) {
      let date = '';
      let time = '';
      if (sessionToEdit.startTime) {
        const dt = new Date(sessionToEdit.startTime);
        date = dt.toISOString().slice(0, 10);
        time = dt.toTimeString().slice(0, 5); 
      }
      
      reset({
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
      reset({
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
  }, [isEditMode, sessionToEdit, reset]);

  const onSubmit = (data: SessionFormData) => {
    const startTime = new Date(`${data.date}T${data.time}`).toISOString();
    const maxAttendeesNum = parseInt(data.maxAttendees);

    const sessionPayload: Session = {
      id: sessionToEdit?.id || Date.now(),
      title: data.title,
      instructor: data.instructor,
      course: data.course,
      date: data.date,
      time: data.time,
      startTime,
      duration: data.duration,
      maxAttendees: maxAttendeesNum,
      description: data.description || '',
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      difficulty: data.difficulty,
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
    
    handleClose();
  };

  const handleClose = () => {
    setShowCreateModal(false);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-3xl flex-shrink-0">
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
              <input
                {...register('title')}
                type="text"
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                placeholder="Enter session title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
              <select
                {...register('instructor')}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
              >
                <option value="">Select Instructor</option>
                <option>Dr. Alice Smith</option>
                <option>Prof. Bob Johnson</option>
              </select>
              {errors.instructor && (
                <p className="text-red-500 text-sm mt-1">{errors.instructor.message}</p>
              )}
            </div>

            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                {...register('course')}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
              >
                <option value="">Select Course</option>
                <option>Database Systems</option>
                <option>Web Development</option>
                <option>Data Structures</option>
                <option>Algorithms</option>
              </select>
              {errors.course && (
                <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  {...register('date')}
                  type="date"
                  className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>
              <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  {...register('time')}
                  type="time"
                  className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                <input
                  {...register('duration')}
                  type="number"
                  step="0.5"
                  className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                  placeholder="e.g., 2"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                )}
              </div>
              <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                <input
                  {...register('maxAttendees')}
                  type="number"
                  className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                  placeholder="e.g., 50"
                />
                {errors.maxAttendees && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxAttendees.message}</p>
                )}
              </div>
            </div>

            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80 resize-none"
                placeholder="Provide session details..."
              />
            </div>

            <div className="relative group animate-fadeInUp" style={{ animationDelay: '0.9s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
              <input
                {...register('tags')}
                type="text"
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
                placeholder="e.g., SQL, Database"
              />
            </div>

            <div className="relative group animate-fadeInUp" style={{ animationDelay: '1.0s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                {...register('difficulty')}
                className="relative w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white/80"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-b-3xl border-t border-gray-100/50 flex-shrink-0">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                {isEditMode ? 'Update Session' : 'Create Session'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
