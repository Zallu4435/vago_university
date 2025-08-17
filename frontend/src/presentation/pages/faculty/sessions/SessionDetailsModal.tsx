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
    { label: 'Title', value: session.title, icon: <FaInfoCircle className="text-purple-500" /> },
    { label: 'Instructor', value: session.instructor, icon: <FaChalkboardTeacher className="text-purple-500" /> },
    { label: 'Course', value: session.course, icon: <FaBook className="text-purple-500" /> },
    { label: 'Status', value: session.status, icon: <FaCheck className="text-purple-500" /> },
    { label: 'Start Time', value: session.startTime ? new Date(session.startTime).toLocaleString() : '', icon: <FaCalendarAlt className="text-purple-500" /> },
    { label: 'Duration (hrs)', value: session.duration, icon: <FaHourglassHalf className="text-purple-500" /> },
    { label: 'Max Attendees', value: session.maxAttendees, icon: <FaUsers className="text-purple-500" /> },
    { label: 'Attendees', value: session.attendees, icon: <FaListOl className="text-purple-500" /> },
    { label: 'Difficulty', value: session.difficulty, icon: <FaTag className="text-purple-500" /> },
    { label: 'Tags', value: Array.isArray(session.tags) ? session.tags.join(', ') : '', icon: <FaTag className="text-purple-500" /> },
    { label: 'Description', value: session.description, icon: <FaInfoCircle className="text-purple-500" /> },
    { label: 'Is Live', value: session.isLive ? 'Yes' : 'No', icon: <FaPlay className="text-purple-500" /> },
    { label: 'Has Recording', value: session.hasRecording ? 'Yes' : 'No', icon: <FaVideo className="text-purple-500" /> },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/10">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-0 relative animate-fadeInUp border border-purple-100 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-pink-600 text-3xl font-bold focus:outline-none z-10 transition-colors"><FaTimes /></button>
        {/* Modal Header Gradient Bar */}
        <div className="w-full h-3 rounded-t-3xl bg-gradient-to-r from-purple-500 to-pink-500 mb-0" />
        {/* Ended Badge */}
        {session.status === 'Ended' && (
          <div className="flex justify-center mt-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-gray-500 to-slate-600 shadow-lg">
              <FaCheck className="mr-2" /> Ended
            </span>
          </div>
        )}
        {/* Modal Content */}
        <div className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 text-center tracking-tight mb-2">Session Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {details.map(({ label, value, icon }) => (
              value !== undefined && value !== '' && (
                <div key={label} className="flex items-start gap-3 bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-100">
                  <div className="mt-1">{icon}</div>
                  <div>
                    <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">{label}</div>
                    <div className="text-base text-gray-900 break-words">{value}</div>
                  </div>
                </div>
              )
            ))}
          </div>
          {Array.isArray(session.attendeeList) && session.attendeeList.length > 0 && (
            <div className="mt-4">
              <div className="text-lg font-bold text-purple-700 mb-2 flex items-center gap-2"><FaUsers /> Attendee List</div>
              <ul className="divide-y divide-purple-100 bg-purple-50 rounded-xl p-4 border border-purple-100">
                {session.attendeeList.map((a: { id: string; name: string }, idx: number) => (
                  <li key={a.id || idx} className="py-2 flex justify-between text-gray-800">
                    <span>{a.name}</span>
                    <span className="text-xs text-gray-500">{a.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 text-lg"
              >
                Join Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsModal; 