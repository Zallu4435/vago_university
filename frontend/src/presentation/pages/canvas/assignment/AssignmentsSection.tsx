import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiDownload, 
  FiUpload, 
  FiClock, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiFileText,
  FiEye,
  FiX,
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiBarChart2,
  FiStar,
  FiBookOpen,
  FiTarget,
  FiTrendingUp,
  FiAward,
  FiBell,
  FiRefreshCw
} from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: Date;
  urgency: 'urgent' | 'normal';
  status: 'pending' | 'submitted' | 'graded';
  description: string;
  hasFile: boolean;
  submittedFile: string | null;
  submittedAt?: Date;
  grade: { score: number; total: number; feedback: string } | null;
  isLate?: boolean;
  priority: number;
  estimatedTime: string;
  completionRate?: number;
}

interface SelectedFile {
  [key: number]: File;
}

const EnhancedAssignments = () => {
  const { styles } = usePreferences();
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Machine Learning Final Project",
      course: "CS 4780 - Machine Learning",
      dueDate: new Date('2025-06-10T23:59:59'),
      urgency: "urgent",
      status: "pending",
      description: "Implement and compare three ML algorithms on a dataset of your choice. Include comprehensive analysis and visualization of results.",
      hasFile: true,
      submittedFile: null,
      grade: null,
      priority: 5,
      estimatedTime: "15-20 hours",
      completionRate: 65
    },
    {
      id: 2,
      title: "Database Design Assignment",
      course: "CS 3320 - Database Systems",
      dueDate: new Date('2025-06-15T23:59:59'),
      urgency: "normal",
      status: "submitted",
      description: "Design a normalized database schema for an e-commerce platform with full documentation",
      hasFile: true,
      submittedFile: "database_schema_john_doe.pdf",
      submittedAt: new Date('2025-06-03T14:30:00'),
      grade: null,
      priority: 3,
      estimatedTime: "8-10 hours",
      completionRate: 100
    },
    {
      id: 3,
      title: "Literature Review Essay",
      course: "ENG 2010 - Academic Writing",
      dueDate: new Date('2025-06-08T11:59:59'),
      urgency: "urgent",
      status: "graded",
      description: "Write a 2000-word literature review on climate change impacts with at least 15 scholarly sources",
      hasFile: false,
      submittedFile: "climate_review_essay.docx",
      submittedAt: new Date('2025-06-07T10:15:00'),
      grade: { score: 88, total: 100, feedback: "Excellent analysis and structure. Minor citation issues noted. Great use of current research." },
      priority: 4,
      estimatedTime: "12-15 hours",
      completionRate: 100
    },
    {
      id: 4,
      title: "React Component Library",
      course: "CS 3750 - Web Development",
      dueDate: new Date('2025-06-20T23:59:59'),
      urgency: "normal",
      status: "pending",
      description: "Create a reusable component library with comprehensive documentation and testing suite",
      hasFile: true,
      submittedFile: null,
      grade: null,
      priority: 2,
      estimatedTime: "20-25 hours",
      completionRate: 30
    },
    {
      id: 5,
      title: "Statistical Analysis Report",
      course: "STAT 2050 - Statistics",
      dueDate: new Date('2025-06-06T17:00:00'),
      urgency: "urgent",
      status: "submitted",
      description: "Analyze survey data using R/Python and present comprehensive findings with visualizations",
      hasFile: true,
      submittedFile: "stats_analysis_report.pdf",
      submittedAt: new Date('2025-06-06T16:45:00'),
      grade: null,
      isLate: false,
      priority: 4,
      estimatedTime: "6-8 hours",
      completionRate: 100
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<SelectedFile>({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getDaysLeft = (dueDate: Date): number => {
    const now = new Date();
    const diff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDueDate = (dueDate: Date): string => {
    return dueDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Assignment['status'], isLate: boolean = false) => {
    if (isLate) return `${styles.status.error} ${styles.button.primary}`;
    switch (status) {
      case 'pending': return `${styles.status.warning} ${styles.button.primary}`;
      case 'submitted': return `${styles.status.info} ${styles.button.primary}`;
      case 'graded': return `${styles.status.success} ${styles.button.primary}`;
      default: return `${styles.button.secondary}`;
    }
  };

  const getUrgencyColor = (urgency: Assignment['urgency'], daysLeft: number) => {
    if (urgency === 'urgent' || daysLeft <= 2) return `${styles.status.error} ${styles.button.primary}`;
    return `${styles.status.success} ${styles.button.primary}`;
  };

  const handleFileSelect = (assignmentId: number, file: File): void => {
    setSelectedFile((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmit = (assignmentId: number): void => {
    const file = selectedFile[assignmentId];
    if (!file) return;

    const now = new Date();
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === assignmentId 
          ? {
              ...assignment,
              status: 'submitted',
              submittedFile: file.name,
              submittedAt: now,
              isLate: now > assignment.dueDate,
              completionRate: 100
            }
          : assignment
      )
    );

    setSelectedFile((prev) => {
      const updated = { ...prev };
      delete updated[assignmentId];
      return updated;
    });
  };

  const filteredAndSortedAssignments = assignments
    .filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate': return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority': return b.priority - a.priority;
        case 'status': return a.status.localeCompare(b.status);
        case 'course': return a.course.localeCompare(b.course);
        default: return 0;
      }
    });

  const currentAssignments = filteredAndSortedAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderAssignmentCard = (assignment: Assignment) => {
    const daysLeft = getDaysLeft(assignment.dueDate);
    const isOverdue = daysLeft < 0 && assignment.status === 'pending';
    
    return (
      <div
        key={assignment.id}
        className={`${styles.card.background} p-6 rounded-2xl shadow-lg ${styles.border} ${
          isOverdue ? `border-l-4 ${styles.status.error}` : ''
        } hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
        onClick={() => setSelectedAssignmentId(assignment.id)}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-xl font-bold ${styles.textPrimary}`}>
                  {assignment.title}
                </h3>
                <div className="flex items-center gap-2">
                  {[...Array(assignment.priority)].map((_, i) => (
                    <FiStar key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className={`font-medium mb-2 ${styles.accent}`}>{assignment.course}</p>
              <p className={`${styles.textSecondary} text-sm line-clamp-2`}>{assignment.description}</p>
            </div>
          </div>
          
          {assignment.completionRate !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${styles.textSecondary}`}>Progress</span>
                <span className={`text-sm font-bold ${styles.textPrimary}`}>{assignment.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${assignment.completionRate}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <FiCalendar className={`h-4 w-4 ${styles.icon.secondary}`} />
              <span className={`${styles.textSecondary}`}>Due: {formatDueDate(assignment.dueDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className={`h-4 w-4 ${styles.icon.secondary}`} />
              <span className={`${styles.textSecondary}`}>
                {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className={`h-4 w-4 ${styles.icon.secondary}`} />
              <span className={`${styles.textSecondary}`}>{assignment.estimatedTime}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(assignment.status, assignment.isLate)}`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                {assignment.isLate && ' (Late)'}
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getUrgencyColor(assignment.urgency, daysLeft)}`}>
                {assignment.urgency === 'urgent' ? 'Urgent' : 'Normal'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {assignment.status === 'pending' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentAssignment(assignment);
                    setShowUploadModal(true);
                  }}
                  className={`px-6 py-3 ${styles.button.primary} rounded-xl flex items-center gap-2`}
                >
                  <FiUpload className="h-4 w-4" />
                  Submit
                </button>
              )}
              {assignment.status === 'submitted' && assignment.submittedFile && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={`p-3 ${styles.button.secondary} rounded-xl transition-all duration-200`}
                >
                  <FiDownload className={`h-4 w-4 ${styles.icon.secondary}`} />
                </button>
              )}
              {assignment.status === 'graded' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentAssignment(assignment);
                    setSelectedAssignmentId(assignment.id);
                  }}
                  className={`px-6 py-2 ${styles.button.primary} rounded-xl flex items-center gap-2`}
                >
                  <FiEye className="h-4 w-4" />
                  View Grade
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssignmentList = () => (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-4xl font-bold ${styles.textPrimary} mb-2`}>
                Assignment Dashboard
              </h1>
              <p className={`${styles.textSecondary} text-lg`}>Track your academic progress and stay organized</p>
            </div>
            <div className="flex items-center gap-3">
              <button className={`${styles.button.primary} px-4 py-2 rounded-xl flex items-center gap-2`}>
                <FiRefreshCw className="h-4 w-4" />
                Sync
              </button>
              <button className={`${styles.button.primary} px-4 py-2 rounded-xl flex items-center gap-2`}>
                <FiBell className="h-4 w-4" />
                Reminders
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${styles.icon.secondary} h-5 w-5`} />
              <input
                type="text"
                placeholder="Search assignments or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${styles.input.border} rounded-xl ${styles.input.background} ${styles.input.focus} transition-all duration-300`}
                aria-label="Search assignments"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`px-4 py-3 ${styles.input.border} rounded-xl ${styles.input.background} ${styles.input.focus}`}
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-4 py-3 ${styles.input.border} rounded-xl ${styles.input.background} ${styles.input.focus}`}
                aria-label="Sort assignments"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="status">Sort by Status</option>
                <option value="course">Sort by Course</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentAssignments.length === 0 ? (
            <div className="text-center py-12">
              <p className={`${styles.textSecondary}`}>No assignments found. Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {currentAssignments.map((assignment) => renderAssignmentCard(assignment))}
              </div>
              {renderPagination(filteredAndSortedAssignments.length)}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              currentPage === 1
                ? `${styles.button.secondary} cursor-not-allowed`
                : `${styles.button.outline} hover:${styles.button.secondary}`
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              currentPage === totalPages
                ? `${styles.button.secondary} cursor-not-allowed`
                : `${styles.button.outline} hover:${styles.button.secondary}`
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className={`text-sm ${styles.textSecondary}`}>
              Showing <span className={`font-semibold ${styles.textPrimary}`}>{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className={`font-semibold ${styles.textPrimary}`}>{Math.min(currentPage * itemsPerPage, totalItems)}</span>{' '}
              of <span className={`font-semibold ${styles.textPrimary}`}>{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="relative isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <span className="sr-only">Previous</span>
                <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;
                const isNearCurrentPage = 
                  Math.abs(pageNumber - currentPage) <= 1 || 
                  pageNumber === 1 || 
                  pageNumber === totalPages;

                if (!isNearCurrentPage) {
                  if (pageNumber === 2 || pageNumber === totalPages - 1) {
                    return <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">...</span>;
                  }
                  return null;
                }
            
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      isCurrentPage
                        ? `${styles.button.primary} focus:z-20 focus:outline-offset-0`
                        : `${styles.button.outline} hover:${styles.button.secondary} ${styles.textPrimary} ring-1 ring-inset ring-gray-300`
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <span className="sr-only">Next</span>
                <FiArrowLeft className="h-5 w-5 rotate-180" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const renderAssignmentDetails = () => {
    const assignment = assignments.find(a => a.id === selectedAssignmentId);
    if (!assignment) return null;

    return (
      <div className={`min-h-screen ${styles.background}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedAssignmentId(null)}
              className={`flex items-center gap-3 px-4 py-2 ${styles.button.secondary} rounded-xl transition-all duration-300`}
              aria-label="Back to dashboard"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>

          <div className={`${styles.card.background} p-8 rounded-3xl shadow-lg ${styles.border}`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className={`text-3xl font-bold ${styles.textPrimary} mb-2`}>{assignment.title}</h2>
                <p className={`font-medium text-lg ${styles.accent}`}>{assignment.course}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusColor(assignment.status, assignment.isLate)}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  {assignment.isLate && ' (Late)'}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getUrgencyColor(assignment.urgency, getDaysLeft(assignment.dueDate))}`}>
                  {assignment.urgency === 'urgent' ? 'Urgent' : 'Normal'}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-4`}>Description</h3>
                <p className={`${styles.textSecondary} leading-relaxed`}>{assignment.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${styles.textPrimary}`}>Assignment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiCalendar className={`h-5 w-5 ${styles.icon.primary}`} />
                      <span className={`${styles.textSecondary}`}>Due: {formatDueDate(assignment.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiTrendingUp className={`h-5 w-5 ${styles.icon.primary}`} />
                      <span className={`${styles.textSecondary}`}>Estimated Time: {assignment.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiStar className="h-5 w-5 text-yellow-500" />
                      <span className={`${styles.textSecondary}`}>Priority: {assignment.priority}/5</span>
                    </div>
                  </div>
                </div>
                
                {assignment.submittedAt && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${styles.textPrimary}`}>Submission Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FiUpload className={`h-5 w-5 ${styles.status.success}`} />
                        <span className={`${styles.textSecondary}`}>
                          Submitted: {assignment.submittedAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {assignment.submittedFile && (
                        <div className="flex items-center gap-3">
                          <FiFileText className={`h-5 w-5 ${styles.status.info}`} />
                          <span className={`${styles.textSecondary}`}>{assignment.submittedFile}</span>
                          <button className={`p-2 ${styles.button.secondary} rounded-lg transition-all duration-300`}>
                            <FiDownload className={`h-4 w-4 ${styles.icon.secondary}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {assignment.status === 'graded' && assignment.grade && (
                <div>
                  <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-4`}>Grade & Feedback</h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl font-bold ${styles.status.success}`}>
                          {assignment.grade.score}/{assignment.grade.total}
                        </div>
                        <div className={`px-4 py-2 ${styles.status.success} rounded-full font-semibold`}>
                          {Math.round((assignment.grade.score / assignment.grade.total) * 100)}%
                        </div>
                      </div>
                      <FiAward className={`h-12 w-12 ${styles.status.success}`} />
                    </div>
                    <div className={`${styles.card.background} p-4 rounded-xl ${styles.border}`}>
                      <h4 className={`font-semibold ${styles.textPrimary} mb-2`}>Instructor Feedback:</h4>
                      <p className={`${styles.textSecondary}`}>{assignment.grade.feedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {assignment.status === 'pending' && (
                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setCurrentAssignment(assignment);
                      setShowUploadModal(true);
                    }}
                    className={`px-8 py-3 ${styles.button.primary} rounded-xl flex items-center gap-2 text-lg font-medium`}
                    aria-label="Submit assignment"
                  >
                    <FiUpload className="h-5 w-5" />
                    Submit Assignment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUploadModal = () => (
    showUploadModal && currentAssignment && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`${styles.cardBackground} p-8 rounded-3xl shadow-lg ${styles.border} w-full max-w-md`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-2xl font-bold ${styles.textPrimary}`}>Submit Assignment</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className={`p-2 ${styles.button.secondary} rounded-xl transition-all duration-300`}
              aria-label="Close modal"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-semibold ${styles.textPrimary} mb-3`}>
                Select File to Upload
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(currentAssignment.id, e.target.files[0]);
                    }
                  }}
                  className={`w-full p-4 border-2 border-dashed ${styles.input.border} rounded-xl ${styles.input.background} hover:border-${styles.accent} transition-colors ${styles.input.focus}`}
                  aria-label="Upload file"
                />
                {selectedFile[currentAssignment.id] && (
                  <div className={`mt-3 p-3 ${styles.backgroundSecondary} rounded-lg ${styles.border}`}>
                    <div className="flex items-center gap-2">
                      <FiFileText className={`h-4 w-4 ${styles.status.info}`} />
                      <span className={`text-sm ${styles.textPrimary} font-medium`}>
                        {selectedFile[currentAssignment.id].name}
                      </span>
                      <span className={`text-xs ${styles.textSecondary}`}>
                        ({Math.round(selectedFile[currentAssignment.id].size / 1024)} KB)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`${styles.backgroundSecondary} p-4 rounded-xl ${styles.border}`}>
              <h4 className={`font-semibold ${styles.textPrimary} mb-2`}>Assignment Details:</h4>
              <p className={`text-sm ${styles.textSecondary} mb-1`}>
                <strong>Title:</strong> {currentAssignment.title}
              </p>
              <p className={`text-sm ${styles.textSecondary} mb-1`}>
                <strong>Course:</strong> {currentAssignment.course}
              </p>
              <p className={`text-sm ${styles.textSecondary}`}>
                <strong>Due:</strong> {formatDueDate(currentAssignment.dueDate)}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className={`px-6 py-3 ${styles.button.secondary} rounded-xl transition-all duration-200 font-medium`}
                aria-label="Cancel upload"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSubmit(currentAssignment.id);
                  setShowUploadModal(false);
                }}
                disabled={!selectedFile[currentAssignment.id]}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedFile[currentAssignment.id] 
                    ? `${styles.button.primary} hover:shadow-lg`
                    : `${styles.button.secondary} cursor-not-allowed`
                }`}
                aria-label="Submit assignment"
              >
                <FiUpload className="h-4 w-4" />
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {selectedAssignmentId ? renderAssignmentDetails() : renderAssignmentList()}
      {renderUploadModal()}
    </>
  );
};

export default EnhancedAssignments;