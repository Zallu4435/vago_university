import React, { useState } from 'react';
import { FiSearch, FiRefreshCw, FiBell, FiArrowLeft } from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';
import { Assignment, SelectedFile, SortOption, FilterStatus } from './types/AssignmentTypes';
import { filterAndSortAssignments } from './utils/assignmentUtils';
import { AssignmentCard } from './components/AssignmentCard';
import { UploadModal } from './components/UploadModal';
import { useUserAssignments } from './hooks/useUserAssignments';

const AssignmentsSection = () => {
  const { styles } = usePreferences();
  const { assignments, selectedFile, error, isLoading, handleFileSelect, handleSubmit, getAssignmentStatus, getAssignmentFeedback } = useUserAssignments();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;


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
              {/* <button className={`${styles.button.primary} px-4 py-2 rounded-xl flex items-center gap-2`}>
                <FiRefreshCw className="h-4 w-4" />
                Sync
              </button>
              <button className={`${styles.button.primary} px-4 py-2 rounded-xl flex items-center gap-2`}>
                <FiBell className="h-4 w-4" />
                Reminders
              </button> */}
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${styles.icon.secondary}`} />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl ${styles.input.background} ${styles.input.border} ${styles.input.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className={`px-4 py-3 rounded-xl ${styles.input.background} ${styles.input.border} ${styles.input.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`px-4 py-3 rounded-xl ${styles.input.background} ${styles.input.border} ${styles.input.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="course">Course</option>
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
                    onViewGrade={(assignment) => {
                      // This is now handled by the GradeModal in AssignmentCard
                    }}
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
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
              currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
              currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{' '}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {page}
                </button>
              ))}

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
      {renderAssignmentList()}
      {showUploadModal && currentAssignment && (
        <UploadModal
          assignment={currentAssignment}
          styles={styles}
          selectedFile={selectedFile[currentAssignment.id]}
          onClose={() => {
            setShowUploadModal(false);
            setCurrentAssignment(null);
          }}
          onFileSelect={(file) => handleFileSelect(currentAssignment.id, file)}
          onSubmit={() => {
            handleSubmit(currentAssignment.id);
            setShowUploadModal(false);
            setCurrentAssignment(null);
          }}
        />
      )}
    </>
  );
};

export default AssignmentsSection;