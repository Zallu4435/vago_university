import React, { useState, useCallback } from 'react';
import { useFacultyManagement } from '../../../../application/hooks/useFacultyManagement';
import { FiFileText, FiUsers, FiClipboard, FiBarChart2, FiUser, FiMail, FiCalendar, FiBriefcase, FiEye, FiCheckCircle, FiXCircle, FiLock, FiUnlock } from 'react-icons/fi';
import { debounce } from 'lodash';
import WarningModal from '../../../components/common/WarningModal';
import FacultyDetailsModal from './FacultyDetailsModal';
import Header from '../../../components/admin/management/Header';
import Pagination from '../../../components/admin/management/Pagination';
import ApplicationsTable from '../../../components/admin/management/ApplicationsTable';
import { DEPARTMENTS, STATUSES, facultyColumns as baseFacultyColumns } from '../../../../shared/constants/facultyManagementConstants';
import { formatDate } from '../../../../shared/utils/dateUtils';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorMessage from '../../../../shared/components/ErrorMessage';
import EmptyState from '../../../../shared/components/EmptyState';
import { Faculty, FacultyFilters } from '../../../../domain/types/management/facultyManagement';

const facultyColumns = [
  ...baseFacultyColumns.slice(0, 3),
  {
    ...baseFacultyColumns[3],
    render: (faculty) => (
      <div className="flex items-center text-gray-300">
        <FiCalendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(faculty.createdAt)}</span>
      </div>
    ),
  },
  {
    ...baseFacultyColumns[4],
    render: (faculty) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          faculty.status.toLowerCase() === 'approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : faculty.status.toLowerCase() === 'rejected'
            ? 'bg-red-900/30 text-red-400 border-red-500/30'
            : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
        }`}
        role="status"
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {faculty.status?.charAt(0).toUpperCase() + faculty.status?.slice(1) || 'Pending'}
      </span>
    ),
  },
];

const FacultyManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [showApproveWarning, setShowApproveWarning] = useState(false);
  const [showBlockWarning, setShowBlockWarning] = useState(false);
  const [facultyToBlock, setFacultyToBlock] = useState<Faculty | null>(null);

  const {
    faculty,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    getFacultyDetails,
    approveFaculty,
    rejectFaculty,
    deleteFaculty,
    updateFacultyStatus,
    blockFaculty,
  } = useFacultyManagement();

  const handleFilterChange = (field: string, value: string) => {
    const cleanField = field.replace(/^page\[|\]$/g, '');
    
    const fieldMap: { [key: string]: keyof FacultyFilters } = {
      'status': 'status',
      'department': 'department',
      'dateRange': 'dateRange'
    };

    const mappedField = fieldMap[cleanField] || cleanField;
    
    setFilters((prev) => ({
      ...prev,
      [mappedField]: value
    }));
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      handleFilterChange(field, value);
    }, 500),
    []
  );

  // Handle search query changes with debouncing
  const debouncedSearchChange = useCallback(
    debounce((query: string) => {
      setFilters((prev) => ({ ...prev, search: query }));
      setPage(1); // Reset to first page when searching
    }, 500),
    []
  );

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setCustomDateRange((prev) => ({ ...prev, [field]: value }));
    // Also update the filters state so the dates get sent to the backend
    setFilters((prev) => ({ 
      ...prev, 
      [field]: value,
      dateRange: 'custom' // Set dateRange to 'custom' when custom dates are selected
    }));
  };

  const handleViewDetails = async (faculty: Faculty) => {
    try {
      const details = await getFacultyDetails(faculty._id);
      setSelectedFaculty(details);
      setIsDetailsModalOpen(true);
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  const handleActionClick = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setShowApproveWarning(true);
  };

  const handleApprove = () => {
    if (!selectedFaculty) return;

    const approvalData = {
      department: selectedFaculty.department || '',
      role: 'Faculty',
      startDate: new Date().toISOString(),
      additionalNotes: '',
    };

    approveFaculty.mutate({
      id: selectedFaculty._id,
      approvalData,
    });
    setShowApproveWarning(false);
    setSelectedFaculty(null);
  };

  const handleReject = async (reason: string) => {
    if (!selectedFaculty) return;
    try {
      rejectFaculty.mutate({
        id: selectedFaculty._id,
        reason,
      });
      setShowApprovalModal(false);
      setSelectedFaculty(null);
    } catch (error) {
      console.error('Error rejecting faculty:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      deleteFaculty.mutate(id);
      setShowDeleteWarning(false);
      setFacultyToDelete(null);
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      department: 'all_departments',
      dateRange: 'all',
      search: '', // Clear search
      startDate: '', // Clear custom start date
      endDate: '', // Clear custom end date
    });
    setCustomDateRange({ startDate: '', endDate: '' });
    setPage(1); // Reset page to 1 when resetting filters
  };

  const facultyActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Details',
      onClick: handleViewDetails,
      color: 'blue' as const,
    },
    {
      icon: <FiCheckCircle size={16} />,
      label: 'Approve',
      onClick: handleActionClick,
      color: 'green' as const,
      disabled: (faculty: Faculty) => faculty.status !== 'pending',
    },
    {
      icon: <FiXCircle size={16} />,
      label: 'Delete',
      onClick: (faculty: Faculty) => {
        setFacultyToDelete(faculty);
        setShowDeleteWarning(true);
      },
      color: 'red' as const,
      disabled: (faculty: Faculty) => faculty.status !== 'pending',
    },
    {
      icon: <FiLock size={16} />,
      label: 'Block/Unblock',
      onClick: (faculty: Faculty) => {
        setFacultyToBlock(faculty);
        setShowBlockWarning(true);
      },
      color: 'red',
      disabled: (faculty: Faculty) => faculty.status !== 'approved',
    },
  ];

  // Remove frontend filtering since we're using backend search
  // const filteredFaculty = filterFaculty(faculty, searchQuery, filters, customDateRange);

  // Block/unblock handler for modal
  const handleBlock = (faculty: Faculty) => {
    blockFaculty.mutate(faculty._id);
    setShowBlockWarning(false);
    setFacultyToBlock(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-md"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Faculty Management"
          subtitle="Manage faculty applications and members"
          stats={[
            {
              icon: <FiUsers />,
              title: 'Total',
              value: faculty?.length || '0',
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiClipboard />,
              title: 'Pending',
              value: faculty?.filter((f) => f.status.toLowerCase() === 'pending').length || '0',
              change: '-2.1%',
              isPositive: true,
            },
            {
              icon: <FiBarChart2 />,
              title: 'Approval Rate',
              value: `${((faculty?.filter((f) => f.status.toLowerCase() === 'approved').length / faculty?.length) * 100 || 0).toFixed(2)}%`,
              change: '+3.8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'All Faculty', icon: <FiUsers size={16} />, active: true },
          ]}
          searchQuery={searchQuery}
          setSearchQuery={(query) => {
            setSearchQuery(query);
            debouncedSearchChange(query);
          }}
          searchPlaceholder="Search by name or email..."
          filters={filters}
          filterOptions={{
            status: STATUSES,
            department: DEPARTMENTS,
          }}
          debouncedFilterChange={debouncedFilterChange}
          customDateRange={customDateRange}
          handleCustomDateChange={handleCustomDateChange}
          handleResetFilters={handleResetFilters}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {faculty?.length > 0 ? (
                <>
                  <ApplicationsTable
                    data={faculty}
                    columns={facultyColumns}
                    actions={facultyActions}
                    formatDate={formatDate}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages || 1}
                    itemsCount={faculty.length}
                    itemName="faculty"
                    onPageChange={(newPage: number) => setPage(newPage)}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              ) : (
                <EmptyState
                  icon={<FiFileText size={32} className="text-purple-400" />}
                  title="No Faculty Found"
                  message="There are no faculty members matching your current filters. Try adjusting your search criteria."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showApproveWarning && selectedFaculty && (
        <WarningModal
          isOpen={showApproveWarning}
          onClose={() => {
            setShowApproveWarning(false);
            setSelectedFaculty(null);
          }}
          onConfirm={handleApprove}
          title="Approve Faculty"
          message={`Are you sure you want to approve ${selectedFaculty.fullName}'s application?`}
          confirmText="Approve"
          cancelText="Cancel"
          type="success"
        />
      )}

      {showApprovalModal && selectedFaculty && (
        <WarningModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedFaculty(null);
          }}
          onConfirm={() => handleReject('No reason provided')}
          title="Reject Faculty"
          message={`Are you sure you want to reject ${selectedFaculty.fullName}'s application?`}
          confirmText="Reject"
          cancelText="Cancel"
          type="danger"
          showReasonInput
          onReasonChange={(reason) => handleReject(reason)}
        />
      )}

      {showDeleteWarning && facultyToDelete && (
        <WarningModal
          isOpen={showDeleteWarning}
          onClose={() => {
            setShowDeleteWarning(false);
            setFacultyToDelete(null);
          }}
          onConfirm={() => handleDelete(facultyToDelete._id)}
          title="Delete Application"
          message={`Are you sure you want to delete ${facultyToDelete.fullName}'s application? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

      {showBlockWarning && facultyToBlock && (
        <WarningModal
          isOpen={showBlockWarning}
          onClose={() => {
            setShowBlockWarning(false);
            setFacultyToBlock(null);
          }}
          onConfirm={() => handleBlock(facultyToBlock)}
          title={facultyToBlock.blocked ? 'Unblock Faculty' : 'Block Faculty'}
          message={`Are you sure you want to ${facultyToBlock.blocked ? 'unblock' : 'block'} ${facultyToBlock.fullName}? This will ${facultyToBlock.blocked ? 'allow' : 'prevent'} them from logging in.`}
          confirmText={facultyToBlock.blocked ? 'Unblock' : 'Block'}
          cancelText="Cancel"
          type="warning"
        />
      )}

      <FacultyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedFaculty(null);
        }}
        faculty={selectedFaculty}
        onBlockToggle={handleBlock}
      />

      <style>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(15px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default FacultyManagement;