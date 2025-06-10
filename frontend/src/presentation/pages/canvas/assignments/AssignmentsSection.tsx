import React, { useState } from 'react';
import { FiSearch, FiRefreshCw, FiBell, FiArrowLeft } from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';
import { Assignment, SelectedFile, SortOption, FilterStatus } from './types/AssignmentTypes';
import { filterAndSortAssignments } from './utils/assignmentUtils';
import { AssignmentCard } from './components/AssignmentCard';
import { AssignmentDetails } from './components/AssignmentDetails';
import { UploadModal } from './components/UploadModal';

const AssignmentsSection = () => {
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
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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

  const filteredAndSortedAssignments = filterAndSortAssignments(
    assignments,
    searchTerm,
    filterStatus,
    sortBy
  );

  const currentAssignments = filteredAndSortedAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
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
                onChange={(e) => setSortBy(e.target.value as SortOption)}
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
                {currentAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    styles={styles}
                    onUpload={(assignment) => {
                      setCurrentAssignment(assignment);
                      setShowUploadModal(true);
                    }}
                    onViewGrade={(assignment) => setSelectedAssignmentId(assignment.id)}
                  />
                ))}
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

  return (
    <>
      {selectedAssignmentId ? (
        <AssignmentDetails
          assignment={assignments.find(a => a.id === selectedAssignmentId)!}
          styles={styles}
          onBack={() => setSelectedAssignmentId(null)}
          onUpload={(assignment) => {
            setCurrentAssignment(assignment);
            setShowUploadModal(true);
          }}
        />
      ) : (
        renderAssignmentList()
      )}
      {showUploadModal && currentAssignment && (
        <UploadModal
          assignment={currentAssignment}
          styles={styles}
          selectedFile={selectedFile[currentAssignment.id] || null}
          onClose={() => setShowUploadModal(false)}
          onFileSelect={(file) => handleFileSelect(currentAssignment.id, file)}
          onSubmit={() => {
            handleSubmit(currentAssignment.id);
            setShowUploadModal(false);
          }}
        />
      )}
    </>
  );
};

export default AssignmentsSection;