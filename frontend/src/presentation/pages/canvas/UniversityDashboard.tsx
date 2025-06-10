import React, { useState } from 'react';
import type { JSX } from 'react';
import { 
  FaBook, FaVideo, FaDownload, FaUpload, 
  FaClock, FaCheck, FaLock, FaUnlock, FaPlay, FaUsers,
  FaPoll, FaPlus, FaChartBar, FaSearch, FaFilter,
  FaFileAlt, FaFilePdf, FaFileWord, FaImage, FaGraduationCap,
  FaTasks, FaCalendarAlt, FaBell, FaTrophy, FaChartLine,
  FaHeart, FaStar, FaComments, FaShare, FaEye, FaThumbsUp
} from 'react-icons/fa';
import { FiFileText, FiTrendingUp, FiActivity, FiMoreVertical } from 'react-icons/fi';
import { Course, Assignment, Session, SessionPoll, Material, NewPoll } from './types/UniversityDashboardTypes';
import DashboardHeader from './components/DashboardHeader';
import PollModal from './components/PollModal';
import SessionPolls from './components/SessionPolls';

const UniversityDashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('student');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showPollModal, setShowPollModal] = useState<boolean>(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [newPoll, setNewPoll] = useState<NewPoll>({
    question: '',
    options: ['', ''],
    allowMultiple: false
  });

  // Enhanced sample data with polls
  const [sessions, setSessions] = useState<Session[]>([
    { 
      id: 1, 
      title: "Advanced React Hooks", 
      type: "live", 
      time: "10:00 AM", 
      date: "Today", 
      instructor: "Dr. Smith", 
      attendees: 45,
      hasActivePolls: true,
      thumbnail: "🚀",
      polls: [
        {
          id: 1,
          sessionId: 1,
          question: "Which React Hook do you find most challenging?",
          options: ["useState", "useEffect", "useContext", "useReducer"],
          votes: [12, 18, 8, 15],
          totalVotes: 53,
          isActive: true,
          allowMultiple: false,
          userVoted: false,
          userVote: null,
          createdBy: "Dr. Smith",
          timeRemaining: 300
        },
        {
          id: 2,
          sessionId: 1,
          question: "How confident are you with custom hooks?",
          options: ["Very confident", "Somewhat confident", "Need more practice", "Just starting"],
          votes: [8, 15, 20, 10],
          totalVotes: 53,
          isActive: true,
          allowMultiple: false,
          userVoted: true,
          userVote: 2,
          createdBy: "Dr. Smith"
        }
      ]
    },
    { 
      id: 2, 
      title: "Database Optimization", 
      type: "upcoming", 
      time: "2:00 PM", 
      date: "Tomorrow", 
      instructor: "Prof. Johnson", 
      attendees: 32,
      hasActivePolls: false,
      thumbnail: "💾",
      polls: []
    },
    { 
      id: 3, 
      title: "Algorithm Complexity", 
      type: "completed", 
      time: "9:00 AM", 
      date: "Yesterday", 
      instructor: "Dr. Brown", 
      attendees: 38,
      hasActivePolls: false,
      thumbnail: "⚡",
      polls: [
        {
          id: 3,
          sessionId: 3,
          question: "Which algorithm complexity topic needs more coverage?",
          options: ["Big O Notation", "Space Complexity", "Amortized Analysis", "Best/Worst Case"],
          votes: [15, 8, 12, 3],
          totalVotes: 38,
          isActive: false,
          allowMultiple: true,
          userVoted: true,
          userVote: 0,
          createdBy: "Dr. Brown"
        }
      ]
    }
  ]);

  const courses: Course[] = [
    { id: 1, title: "Computer Science Fundamentals", progress: 85, locked: false, level: "Beginner", students: 245, rating: 4.8, thumbnail: "💻" },
    { id: 2, title: "Data Structures & Algorithms", progress: 60, locked: false, level: "Intermediate", students: 189, rating: 4.6, thumbnail: "🌳" },
    { id: 3, title: "Web Development", progress: 30, locked: false, level: "Advanced", students: 156, rating: 4.9, thumbnail: "🌐" },
    { id: 4, title: "Machine Learning", progress: 0, locked: true, level: "Advanced", students: 98, rating: 4.7, thumbnail: "🤖" },
    { id: 5, title: "Mobile App Development", progress: 45, locked: false, level: "Intermediate", students: 134, rating: 4.5, thumbnail: "📱" },
    { id: 6, title: "Database Management", progress: 75, locked: false, level: "Beginner", students: 203, rating: 4.4, thumbnail: "🗄️" }
  ];

  const assignments: Assignment[] = [
    { id: 1, title: "Algorithm Analysis Report", subject: "DSA", dueDate: "2025-06-15", status: "pending", priority: "high", grade: null },
    { id: 2, title: "React Component Library", subject: "Web Dev", dueDate: "2025-06-20", status: "submitted", priority: "medium", grade: "A-" },
    { id: 3, title: "Database Design Project", subject: "Database", dueDate: "2025-06-10", status: "overdue", priority: "high", grade: null },
    { id: 4, title: "UI/UX Case Study", subject: "Design", dueDate: "2025-06-25", status: "pending", priority: "low", grade: null },
    { id: 5, title: "Mobile Prototype", subject: "Mobile", dueDate: "2025-06-18", status: "submitted", priority: "medium", grade: "B+" },
    { id: 6, title: "SQL Optimization", subject: "Database", dueDate: "2025-06-22", status: "pending", priority: "medium", grade: null }
  ];

  const materials: Material[] = [
    { id: 1, title: "Introduction to Algorithms", subject: "DSA", type: "pdf", uploader: "Dr. Smith", size: "2.3 MB", downloads: 234 },
    { id: 2, title: "React Best Practices", subject: "Web Dev", type: "doc", uploader: "Prof. Johnson", size: "1.1 MB", downloads: 189 },
    { id: 3, title: "Database Schema Examples", subject: "Database", type: "pdf", uploader: "Dr. Brown", size: "3.2 MB", downloads: 156 },
    { id: 4, title: "UI Design Principles", subject: "Design", type: "img", uploader: "Ms. Davis", size: "5.1 MB", downloads: 203 },
    { id: 5, title: "Mobile Development Guide", subject: "Mobile", type: "pdf", uploader: "Dr. Wilson", size: "4.7 MB", downloads: 178 },
    { id: 6, title: "ML Algorithms Cheat Sheet", subject: "ML", type: "pdf", uploader: "Prof. Lee", size: "1.8 MB", downloads: 267 }
  ];

  const getFileIcon = (type: 'pdf' | 'doc' | 'img'): JSX.Element => {
    switch(type) {
      case 'pdf': return <FaFilePdf className="text-red-500" />;
      case 'doc': return <FaFileWord className="text-blue-500" />;
      case 'img': return <FaImage className="text-green-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: 'submitted' | 'pending' | 'overdue'): string => {
    switch(status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVote = (sessionId: number, pollId: number, optionIndex: number): void => {
    setSessions(sessions.map(session => {
      if (session.id === sessionId) {
        const updatedPolls = session.polls.map(poll => {
          if (poll.id === pollId && !poll.userVoted) {
            const newVotes = [...poll.votes];
            newVotes[optionIndex]++;
            return {
              ...poll,
              votes: newVotes,
              totalVotes: poll.totalVotes + 1,
              userVoted: true,
              userVote: optionIndex
            };
          }
          return poll;
        });
        return { ...session, polls: updatedPolls, hasActivePolls: updatedPolls.some(p => p.isActive) };
      }
      return session;
    }));
  };

  const createPoll = (sessionId: number): void => {
    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) return;

    const poll: SessionPoll = {
      id: Date.now(),
      sessionId,
      question: newPoll.question,
      options: newPoll.options.filter(opt => opt.trim()),
      votes: new Array(newPoll.options.filter(opt => opt.trim()).length).fill(0),
      totalVotes: 0,
      isActive: true,
      allowMultiple: newPoll.allowMultiple,
      userVoted: false,
      userVote: null,
      createdBy: "You"
    };

    setSessions(sessions.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          polls: [...session.polls, poll],
          hasActivePolls: true
        };
      }
      return session;
    }));

    setNewPoll({ question: '', options: ['', ''], allowMultiple: false });
    setShowPollModal(false);
    setSelectedSession(null);
  };

  const addPollOption = (): void => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const updatePollOption = (index: number, value: string): void => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const removePollOption = (index: number): void => {
    if (newPoll.options.length > 2) {
      const updatedOptions = newPoll.options.filter((_, i) => i !== index);
      setNewPoll({ ...newPoll, options: updatedOptions });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <DashboardHeader courses={courses} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{session.thumbnail}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{session.title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">{session.instructor}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                session.type === 'live' ? 'bg-red-100 text-red-800' :
                session.type === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <FaClock className="mr-1" />
                  {session.time}
                </span>
                <span>{session.date}</span>
              </div>
              <span className="flex items-center">
                <FaUsers className="mr-1" />
                {session.attendees} attendees
              </span>
            </div>

            <SessionPolls
              polls={session.polls}
              onVote={(pollId, optionIndex) => handleVote(session.id, pollId, optionIndex)}
            />

            {session.type === 'live' && (
              <button className="w-full mt-4 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-xs sm:text-sm font-medium flex items-center justify-center">
                <FaPlay className="mr-2" />
                Join Live Session
              </button>
            )}
          </div>
        ))}
      </div>

      <PollModal
        show={showPollModal}
        onClose={() => {
          setShowPollModal(false);
          setSelectedSession(null);
        }}
        selectedSession={selectedSession}
        sessions={sessions}
        newPoll={newPoll}
        onQuestionChange={(value) => setNewPoll({ ...newPoll, question: value })}
        onOptionChange={updatePollOption}
        onAddOption={addPollOption}
        onRemoveOption={removePollOption}
        onAllowMultipleChange={(value) => setNewPoll({ ...newPoll, allowMultiple: value })}
        onCreatePoll={createPoll}
      />

      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6">
        <button className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg sm:text-xl hover:scale-110">
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default UniversityDashboard;