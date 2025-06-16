import React, { useState } from 'react';
import { FiSearch, FiRefreshCw, FiBell, FiArrowLeft } from 'react-icons/fi';
import { usePreferences } from '../../../context/PreferencesContext';
import { Assignment, SelectedFile, SortOption, FilterStatus } from './types/AssignmentTypes';
import { filterAndSortAssignments } from './utils/assignmentUtils';
import { AssignmentCard } from './components/AssignmentCard';
import { AssignmentDetails } from './components/AssignmentDetails';
import { UploadModal } from './components/UploadModal';
import { useUserAssignments } from './hooks/useUserAssignments';

const AssignmentsSection = () => {
  const { styles } = usePreferences();
  const { assignments, selectedFile, error, isLoading, handleFileSelect, handleSubmit, getAssignmentStatus, getAssignmentFeedback } = useUserAssignments();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  console.log(assignments, "wwwwwwwwww")

  const filteredAndSortedAssignments = filterAndSortAssignments(
    assignments,
    searchTerm,
    filterStatus,
    sortBy
  );

  console.log(filteredAndSortedAssignments, "eeeeeeeeeee")

  const currentAssignments = filteredAndSortedAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log(currentAssignments, "rrrrrrrrr")


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
      {selectedAssignmentId && (
        <AssignmentDetails
          assignmentId={selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
          styles={styles}
        />
      )}
    </>
  );
};

export default AssignmentsSection;