import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaPlay, FaStop, FaVideo, FaDownload, FaClock, FaCheck } from 'react-icons/fa';
import CreateSessionModal from './CreateSessionModal';
import EditSessionModal from './EditSessionModal';
import RecordingModal from './RecordingModal';
import { Session } from './types';

const mockSessions: Session[] = [
  {
    id: 1,
    title: 'Introduction to Databases',
    instructor: 'Dr. Alice Smith',
    course: 'Database Systems',
    date: '2025-06-15',
    time: '10:00',
    duration: '2',
    maxAttendees: 50,
    description: 'Learn the basics of relational databases.',
    tags: ['SQL', 'RDBMS'],
    difficulty: 'beginner',
    status: 'upcoming',
    isLive: false,
    hasRecording: false,
    attendees: 0,
    attendeeList: []
  },
  {
    id: 2,
    title: 'Advanced Web Development',
    instructor: 'Prof. Bob Johnson',
    course: 'Web Development',
    date: '2025-06-10',
    time: '14:00',
    duration: '3',
    maxAttendees: 30,
    description: 'Explore modern frameworks like React.',
    tags: ['React', 'JavaScript'],
    difficulty: 'advanced',
    status: 'completed',
    isLive: false,
    hasRecording: true,
    recordingUrl: 'https://youtube.com/example',
    attendees: 25,
    attendeeList: [
      { id: 'ST001', name: 'Carol Davis' },
      { id: 'ST002', name: 'David Wilson' }
    ]
  }
];

const mockStudents = [
  { id: 'ST001', name: 'Carol Davis' },
  { id: 'ST002', name: 'David Wilson' },
  { id: 'ST003', name: 'Emma Brown' },
  { id: 'ST004', name: 'Frank Lee' }
];

export default function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const matchesCourse = filterCourse === 'all' || session.course === filterCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleCreateSession = (newSession: Session) => {
    setSessions([...sessions, { ...newSession, id: sessions.length + 1 }]);
    setShowCreateModal(false);
  };

  const handleEditSession = (updatedSession: Session) => {
    setSessions(sessions.map(s => s.id === updatedSession.id ? updatedSession : s));
    setShowEditModal(false);
    setSelectedSession(null);
  };

  const handleDeleteSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleToggleLive = (id: number) => {
    setSessions(sessions.map(s => {
      if (s.id === id) {
        const isLive = !s.isLive;
        let attendees = s.attendees;
        let attendeeList = s.attendeeList || [];
        if (isLive && !s.attendees) {
          // Simulate automatic attendance when going live
          attendees = Math.floor(Math.random() * s.maxAttendees) + 1;
          const shuffledStudents = mockStudents.sort(() => Math.random() - 0.5);
          attendeeList = shuffledStudents.slice(0, attendees);
        }
        return {
          ...s,
          isLive,
          status: isLive ? 'live' : (new Date(s.date) < new Date() ? 'completed' : 'upcoming'),
          attendees,
          attendeeList
        };
      }
      return s;
    }));
  };

  const handleUploadRecording = (id: number, recordingUrl: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, hasRecording: true, recordingUrl } : s));
    setShowRecordingModal(false);
    setSelectedSession(null);
  };

  const handleExportAttendance = (session: Session) => {
    const csvContent = [
      ['Student ID', 'Name'],
      ...(session.attendeeList || []).map(student => [student.id, student.name])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${session.title}_attendance.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusConfig = (status: 'upcoming' | 'live' | 'completed') => {
    switch (status) {
      case 'upcoming':
        return { color: 'from-yellow-500 to-orange-600', text: 'text-yellow-700', icon: <FaClock size={14} /> };
      case 'live':
        return { color: 'from-green-500 to-emerald-600', text: 'text-green-700', icon: <FaPlay size={14} /> };
      case 'completed':
        return { color: 'from-blue-500 to-indigo-600', text: 'text-blue-700', icon: <FaCheck size={14} /> };
      default:
        return { color: 'from-gray-500 to-slate-600', text: 'text-gray-700', icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="h-full w-full px-6">
        <div className="max-w-7xl mx-auto flex flex-col">
          {/* Fixed Header Section */}
          <div className="flex-none py-6">
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Session Management
                    </h2>
                    <p className="text-gray-500">Manage live and recorded sessions for your courses</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                  >
                    <FaPlus size={16} />
                    <span>Create Session</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6">
                <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  <div className="flex-1 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-white rounded-2xl border-2 border-gray-100 focus-within:border-indigo-300 transition-all">
                      <FaSearch size={20} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search by title or instructor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-lg"
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="relative px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-300 text-gray-700 font-medium cursor-pointer hover:border-indigo-200 transition-all"
                    >
                      <option value="all">All Status</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <select
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                      className="relative px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-indigo-300 text-gray-700 font-medium cursor-pointer hover:border-indigo-200 transition-all"
                    >
                      <option value="all">All Courses</option>
                      <option>Database Systems</option>
                      <option>Web Development</option>
                      <option>Data Structures</option>
                      <option>Algorithms</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Table Section */}
          <div className="flex-1 pb-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 h-full">
              <div className="h-full overflow-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Title</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Instructor</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Course</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Time</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Live</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Attendees</th>
                      <th className="px-6 py-4 text-left text-gray-900 font-bold uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSessions.map((session, index) => {
                      const statusConfig = getStatusConfig(session.status);
                      return (
                        <tr key={session.id} className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all animate-fadeInUp" style={{ animationDelay: `${index * 0.05}s` }}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="font-bold text-gray-900">{session.title}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{session.instructor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{session.course}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{session.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${statusConfig.color} shadow-lg`}>
                              {statusConfig.icon}
                              <span className="ml-2 capitalize">{session.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleLive(session.id)}
                              className={`px-3 py-1 rounded-full text-white font-medium ${session.isLive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} transition-all`}
                            >
                              {session.isLive ? 'End' : 'Start'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">{session.attendees}/{session.maxAttendees}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => { setSelectedSession(session); setShowEditModal(true); }}
                                className="p-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-200 hover:border-indigo-300 hover:scale-110 transform"
                                title="Edit"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteSession(session.id)}
                                className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all border border-red-200 hover:border-red-300 hover:scale-50 transform"
                                title="Delete"
                              >
                                <FaTrash size={16} />
                              </button>
                              <button
                                onClick={() => { setSelectedSession(session); setShowRecordingModal(true); }}
                                className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all border border-blue-200 hover:border-blue-300 hover:scale-50 transform"
                                title="Upload Recording"
                              >
                                <FaVideo size={16} />
                              </button>
                              <button
                                onClick={() => handleExportAttendance(session)}
                                className="p-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all border border-green-200 hover:border-green-300 hover:scale-50 transform"
                                title="Export Attendance"
                              >
                                <FaDownload size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredSessions.length === 0 && (
        <div className="text-center py-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <FaSearch size={32} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Sessions Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search or filter criteria to find the sessions you're looking for.
          </p>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateSessionModal
          setShowCreateModal={setShowCreateModal}
          createSession={handleCreateSession}
        />
      )}
      {showEditModal && selectedSession && (
        <EditSessionModal
          session={selectedSession}
          setShowEditModal={setShowEditModal}
          editSession={handleEditSession}
        />
      )}
      {showRecordingModal && selectedSession && (
        <RecordingModal
          sessionId={selectedSession.id}
          setShowRecordingModal={setShowRecordingModal}
          uploadRecording={handleUploadRecording}
        />
      )}
    </div>
  );
}
