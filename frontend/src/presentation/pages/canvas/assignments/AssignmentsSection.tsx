import { useState, useEffect } from 'react';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { usePreferences } from '../../../../application/context/PreferencesContext';
import { Assignment, SortOption, FilterStatus } from '../../../../domain/types/canvas/assignment';
import { AssignmentCard } from './components/AssignmentCard';
import { UploadModal } from './components/UploadModal';
import { useUserAssignments } from './hooks/useUserAssignments';

const AssignmentsSection = () => {
  const { styles } = usePreferences();
  const {
    assignments,
    selectedFile,
    handleFileSelect,
    handleSubmit,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
  } = useUserAssignments();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(debouncedSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, setSearchTerm]);

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, [searchTerm]);

  const currentAssignments = assignments;

  const renderAssignmentList = () => (
    <div className={`min-h-screen ${styles.background}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <div className="hidden sm:flex flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl sm:text-4xl font-bold ${styles.textPrimary} mb-1 sm:mb-2`}>
                Assignment Dashboard
              </h1>
              <p className={`${styles.textSecondary} text-base sm:text-lg`}>Track your academic progress and stay organized</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-full sm:w-1/2">
              <div className="relative">
                <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 ${styles.icon.secondary}`} />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={debouncedSearchTerm}
                  onChange={(e) => {
                    setDebouncedSearchTerm(e.target.value);
                  }}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 rounded-lg sm:rounded-xl ${styles.input.background} ${styles.input.border} ${styles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base`}
                />
              </div>
            </div>
            <div className="w-full sm:w-1/2 flex gap-2 sm:gap-3">
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as FilterStatus);
                }}
                className={`w-1/2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl ${styles.input.background} ${styles.input.border} ${styles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base`}
                style={{ background: styles.input.background, color: styles.textPrimary }}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                }}
                className={`w-1/2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl ${styles.input.background} ${styles.input.border} ${styles.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base`}
                style={{ background: styles.input.background, color: styles.textPrimary }}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="course">Course</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {currentAssignments.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className={`${styles.textSecondary}`}>No assignments found. Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 sm:space-y-6">
                {currentAssignments.map((assignment: Assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    styles={styles}
                    onUpload={(assignment) => {
                      setCurrentAssignment(assignment);
                      setShowUploadModal(true);
                    }}
                    onViewGrade={() => {
                    }}
                  />
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderPagination = () => {
    const disableAll = currentAssignments.length < 10;
    return (
      <div className={`flex items-center justify-between border-t ${styles.input.border} ${styles.input.background} px-4 py-3 sm:px-6`}>
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={disableAll || currentPage === 1}
            className={`relative inline-flex items-center rounded-md ${styles.input.background} ${styles.input.border} ${styles.textPrimary} px-4 py-2 text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              disableAll || currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={disableAll}
            className={`relative ml-3 inline-flex items-center rounded-md ${styles.input.background} ${styles.input.border} ${styles.textPrimary} px-4 py-2 text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              disableAll ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className={`${styles.textPrimary} text-sm`}>
              Page <span className="font-medium">{currentPage}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={disableAll || currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md ${styles.input.background} ${styles.input.border} ${styles.textPrimary} px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  disableAll || currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                <span className="sr-only">Previous</span>
                <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={disableAll}
                className={`relative inline-flex items-center ${styles.input.background} ${styles.input.border} ${styles.textPrimary} px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  disableAll ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                Next
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
          selectedFile={selectedFile[currentAssignment._id]}
          onClose={() => {
            setShowUploadModal(false);
            setCurrentAssignment(null);
          }}
          onFileSelect={(file) => handleFileSelect(currentAssignment._id, file)}
          onSubmit={() => {
            handleSubmit(currentAssignment._id);
            setShowUploadModal(false);
            setCurrentAssignment(null);
          }}
        />
      )}
    </>
  );
};

export default AssignmentsSection;