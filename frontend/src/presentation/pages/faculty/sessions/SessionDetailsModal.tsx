import React, { useEffect } from 'react';
import { FaCheck, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaHourglassHalf, FaUsers, FaListOl, FaTag, FaInfoCircle, FaPlay, FaVideo, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../../appStore/store';

interface SessionDetailsModalProps {
  session: any;
  onClose: () => void;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ session, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  if (!session) return null;
  const details = [
    { label: 'Title', value: session.title, icon: <FaInfoCircle className="text-indigo-500" /> },
    { label: 'Instructor', value: session.instructor, icon: <FaChalkboardTeacher className="text-indigo-500" /> },
    { label: 'Course', value: session.course, icon: <FaBook className="text-indigo-500" /> },
    { label: 'Status', value: session.status, icon: <FaCheck className="text-indigo-500" /> },
    { label: 'Start Time', value: session.startTime ? new Date(session.startTime).toLocaleString() : '', icon: <FaCalendarAlt className="text-indigo-500" /> },
    { label: 'Duration (hrs)', value: session.duration, icon: <FaHourglassHalf className="text-indigo-500" /> },
    { label: 'Max Attendees', value: session.maxAttendees, icon: <FaUsers className="text-indigo-500" /> },
    { label: 'Attendees', value: session.attendees, icon: <FaListOl className="text-indigo-500" /> },
    { label: 'Difficulty', value: session.difficulty, icon: <FaTag className="text-indigo-500" /> },
    { label: 'Tags', value: Array.isArray(session.tags) ? session.tags.join(', ') : '', icon: <FaTag className="text-indigo-500" /> },
    { label: 'Description', value: session.description, icon: <FaInfoCircle className="text-indigo-500" /> },
    { label: 'Is Live', value: session.isLive ? 'Yes' : 'No', icon: <FaPlay className="text-indigo-500" /> },
    { label: 'Has Recording', value: session.hasRecording ? 'Yes' : 'No', icon: <FaVideo className="text-indigo-500" /> },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-transparent">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeInUp border border-indigo-100 max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 text-3xl font-bold focus:outline-none"><FaTimes /></button>
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center tracking-tight">Session Details</h2>
        <div className="overflow-y-auto max-h-[60vh] flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {details.map(({ label, value, icon }) => (
              value !== undefined && value !== '' && (
                <div key={label} className="flex items-start gap-3 bg-indigo-50 rounded-xl p-4 shadow-sm">
                  <div className="mt-1">{icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">{label}</div>
                    <div className="text-base text-gray-900 break-words">{value}</div>
                  </div>
                </div>
              )
            ))}
          </div>
          {Array.isArray(session.attendeeList) && session.attendeeList.length > 0 && (
            <div className="mt-8">
              <div className="text-lg font-bold text-indigo-700 mb-2 flex items-center gap-2"><FaUsers /> Attendee List</div>
              <ul className="divide-y divide-indigo-100 bg-indigo-50 rounded-xl p-4">
                {session.attendeeList.map((a: any, idx: number) => (
                  <li key={a.id || idx} className="py-1 flex justify-between text-gray-800">
                    <span>{a.name}</span>
                    <span className="text-xs text-gray-500">{a.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {session.joinUrl && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                navigate(`/faculty/video-conference/${session.id || session._id}`, {
                  state: {
                    session,
                    faculty: user,
                    isHost: true,
                  },
                });
              }}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 text-lg"
            >
              Join Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetailsModal; 