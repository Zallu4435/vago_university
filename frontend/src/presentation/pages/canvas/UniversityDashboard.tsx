import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaVideo, FaDownload, FaUpload, 
  FaClock, FaCheck, FaLock, FaUnlock, FaPlay, FaUsers,
  FaPoll, FaPlus, FaChartBar, FaSearch, FaFilter,
  FaFileAlt, FaFilePdf, FaFileWord, FaImage, FaGraduationCap,
  FaTasks, FaCalendarAlt, FaBell, FaTrophy, FaChartLine,
  FaHeart, FaStar, FaComments, FaShare, FaEye, FaThumbsUp
} from 'react-icons/fa';
import { FiFileText, FiTrendingUp, FiActivity, FiMoreVertical } from 'react-icons/fi';

interface Course {
  id: number;
  title: string;
  progress: number;
  locked: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  rating: number;
  thumbnail?: string;
}

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  grade: string | null;
}

interface SessionPoll {
  id: number;
  sessionId: number;
  question: string;
  options: string[];
  votes: number[];
  totalVotes: number;
  isActive: boolean;
  allowMultiple: boolean;
  userVoted: boolean;
  userVote: number | null;
  createdBy: string;
  timeRemaining?: number;
}

interface Session {
  id: number;
  title: string;
  type: 'live' | 'upcoming' | 'completed' | 'scheduled';
  time: string;
  date: string;
  instructor: string;
  attendees: number;
  polls: SessionPoll[];
  hasActivePolls: boolean;
  thumbnail?: string;
}

interface Material {
  id: number;
  title: string;
  subject: string;
  type: 'pdf' | 'doc' | 'img';
  uploader: string;
  size: string;
  downloads: number;
}

const UniversityDashboard = () => {
  const [userRole, setUserRole] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [newPoll, setNewPoll] = useState({
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
    },
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

  const getFileIcon = (type: 'pdf' | 'doc' | 'img') => {
    switch(type) {
      case 'pdf': return <FaFilePdf className="text-red-500" />;
      case 'doc': return <FaFileWord className="text-blue-500" />;
      case 'img': return <FaImage className="text-green-500" />;
      default: return <FaFileAlt className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: 'submitted' | 'pending' | 'overdue') => {
    switch(status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVote = (sessionId: number, pollId: number, optionIndex: number) => {
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
        return { ...session, polls: updatedPolls };
      }
      return session;
    }));
  };

  const createPoll = (sessionId: number) => {
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
  };

  const addPollOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const removePollOption = (index: number) => {
    if (newPoll.options.length > 2) {
      const updatedOptions = newPoll.options.filter((_, i) => i !== index);
      setNewPoll({ ...newPoll, options: updatedOptions });
    }
  };

  // Calculate stats
  const completedCourses = courses.filter(c => c.progress === 100).length;
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
  const upcomingSessions = sessions.filter(s => s.type === 'upcoming').length;
  const averageGrade = assignments
    .filter(a => a.grade)
    .reduce((acc, curr) => {
      const gradeValue = curr.grade?.includes('A') ? 90 : curr.grade?.includes('B') ? 80 : 70;
      return acc + (gradeValue || 0);
    }, 0) / assignments.filter(a => a.grade).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Enhanced Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                S
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, Student!
                </h1>
                <p className="text-gray-600 text-lg">Ready to continue your learning journey? 🚀</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaBell className="text-gray-400 hover:text-blue-600 cursor-pointer text-xl transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
              A
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div> 
                <p className="text-sm font-medium text-gray-600 mb-1">Active Courses</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {courses.filter(c => !c.locked).length}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-2">
                  <FiTrendingUp className="mr-1" />
                  +2 this semester
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <FaBook className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {pendingAssignments}
                </p>
                <p className="text-xs text-red-600 flex items-center mt-2">
                  <FaClock className="mr-1" />
                  1 overdue
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <FaTasks className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Live Sessions</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {sessions.filter(s => s.type === 'live').length}
                </p>
                <p className="text-xs text-green-600 flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active now
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <FaVideo className="text-white text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Average Grade</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {averageGrade.toFixed(0)}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-2">
                  <FaTrophy className="mr-1" />
                  Above average
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <FaChartLine className="text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Enhanced Courses */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              My Courses
            </h2>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{course.thumbnail}</div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                  {course.locked ? 
                    <FaLock className="text-gray-400" /> : 
                    <FaUnlock className="text-green-500" />
                  }
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{course.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <FaUsers className="mr-2" />
                    {course.students} students
                  </span>
                  <span className="flex items-center">
                    <FaStar className="mr-1 text-yellow-500" />
                    {course.rating}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{course.progress}% complete</span>
                  <span className="font-medium text-blue-600">Continue →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Enhanced Sessions with Polling */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Live Sessions & Polls
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowPollModal(true)}
                className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                <FaPoll className="inline mr-1" /> Poll
              </button>
              <button className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium">
                Join All
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {sessions.slice(0, 3).map((session) => (
              <div key={session.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{session.thumbnail}</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      session.type === 'live' ? 'bg-red-100 text-red-800' :
                      session.type === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {session.type === 'live' && <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>}
                      {session.type.toUpperCase()}
                    </span>
                  </div>
                  {session.hasActivePolls && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <FaPoll className="text-sm" />
                      <span className="text-xs font-medium">Active Polls</span>
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{session.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{session.instructor}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="font-medium">{session.date} at {session.time}</span>
                  <span className="flex items-center">
                    <FaUsers className="mr-1" />
                    {session.attendees}
                  </span>
                </div>

                {/* Session Polls */}
                {session.polls.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <FaPoll className="mr-2 text-purple-500" />
                      Session Polls ({session.polls.length})
                    </h4>
                    {session.polls.slice(0, 2).map((poll) => (
                      <div key={poll.id} className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-medium text-gray-900 text-sm">{poll.question}</h5>
                          <span className="text-xs text-gray-500">{poll.totalVotes} votes</span>
                        </div>
                        
                        <div className="space-y-2">
                          {poll.options.map((option, index) => {
                            const percentage = poll.totalVotes > 0 ? (poll.votes[index] / poll.totalVotes) * 100 : 0;
                            const isUserChoice = poll.userVote === index;
                            
                            return (
                              <div key={index} className="relative">
                                <button
                                  onClick={() => !poll.userVoted && poll.isActive && handleVote(session.id, poll.id, index)}
                                  disabled={poll.userVoted || !poll.isActive}
                                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                                    poll.userVoted || !poll.isActive
                                      ? 'cursor-default'
                                      : 'hover:bg-purple-100 cursor-pointer'
                                  } ${
                                    isUserChoice
                                      ? 'bg-purple-200 border-purple-400 font-medium'
                                      : 'bg-white border-gray-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span>{option}</span>
                                    <div className="flex items-center space-x-2">
                                      {isUserChoice && <FaCheck className="text-purple-600 text-xs" />}
                                      <span className="text-xs font-medium">{poll.votes[index]}</span>
                                    </div>
                                  </div>
                                  
                                  {poll.userVoted && (
                                    <div className="absolute bottom-0 left-0 h-1 bg-purple-500 rounded-b-lg transition-all duration-500"
                                         style={{ width: `${percentage}%` }}>
                                    </div>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                          <span>by {poll.createdBy}</span>
                          <div className="flex items-center space-x-3">
                            {poll.timeRemaining && (
                              <span className="flex items-center">
                                <FaClock className="mr-1" />
                                {Math.floor(poll.timeRemaining / 60)}:{(poll.timeRemaining % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              poll.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {poll.isActive ? 'Active' : 'Closed'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {session.type === 'live' && (
                  <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center">
                    <FaPlay className="mr-2" />
                    Join Live Session
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Enhanced Tasks & Materials */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Tasks & Materials
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Enhanced Upcoming Assignments */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FaTasks className="mr-2 text-orange-500" />
                  Upcoming Tasks
                </h3>
                <span className="text-sm text-gray-500">{pendingAssignments} pending</span>
              </div>
              <div className="space-y-3">
                {assignments.slice(0, 3).map((assignment) => (
                  <div key={assignment.id} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-orange-100">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{assignment.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">{assignment.subject}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Due: {assignment.dueDate}</span>
                      {assignment.grade && (
                        <span className="text-sm font-bold text-green-600">{assignment.grade}</span>
                      )}
                    </div>
                    {assignment.status === 'pending' && (
                      <button className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium">
                        Start Working
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Recent Materials */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FaFileAlt className="mr-2 text-blue-500" />
                  Study Materials
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
              </div>
              <div className="space-y-3">
                {materials.slice(0, 3).map((material) => (
                  <div key={material.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-white shadow-sm">
                          {getFileIcon(material.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{material.title}</h4>
                          <p className="text-xs text-gray-600">{material.subject} • {material.size}</p>
                          <p className="text-xs text-gray-500">by {material.uploader}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300 hover:shadow-md">
                          <FaDownload />
                        </button>
                        <div className="flex items-center text-xs text-gray-500">
                          <FaEye className="mr-1" />
                          {material.downloads}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <FaPlus className="mr-2 text-purple-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-700 hover:text-purple-600 border border-gray-100">
                  <FaUpload className="mx-auto mb-1 text-lg" />
                  Upload
                </button>
                <button className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-700 hover:text-purple-600 border border-gray-100">
                  <FaSearch className="mx-auto mb-1 text-lg" />
                  Search
                </button>
                <button className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-700 hover:text-purple-600 border border-gray-100">
                  <FaCalendarAlt className="mx-auto mb-1 text-lg" />
                  Schedule
                </button>
                <button className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-700 hover:text-purple-600 border border-gray-100">
                  <FaChartBar className="mx-auto mb-1 text-lg" />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Poll Creation Modal */}
      {showPollModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Poll</h3>
              <button
                onClick={() => setShowPollModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poll Question
                </label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  placeholder="Enter your question..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options
                </label>
                <div className="space-y-2">
                  {newPoll.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {newPoll.options.length > 2 && (
                        <button
                          onClick={() => removePollOption(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addPollOption}
                  className="mt-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-medium transition-colors"
                >
                  + Add Option
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowMultiple"
                  checked={newPoll.allowMultiple}
                  onChange={(e) => setNewPoll({ ...newPoll, allowMultiple: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="allowMultiple" className="text-sm text-gray-700">
                  Allow multiple selections
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPollModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedSession && createPoll(selectedSession)}
                disabled={!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Poll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-xl hover:scale-110">
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default UniversityDashboard;