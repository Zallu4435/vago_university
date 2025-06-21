import React, { useState, useCallback } from 'react';
import { useFacultyManagement } from '../../../application/hooks/useFacultyManagement';
import { FiFileText, FiUsers, FiClipboard, FiBarChart2, FiUser, FiMail, FiCalendar, FiBriefcase, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { debounce } from 'lodash';
import WarningModal from '../../components/WarningModal';
import FacultyDetailsModal from '../../components/admin/FacultyDetailsModal';
import Header from '../admin/User/Header';
import Pagination from '../admin/User/Pagination';
import ApplicationsTable from '../admin/User/ApplicationsTable';

interface Faculty {
  _id: string;
  fullName: string;
  email: string;
  department: string;
  status: string;
  createdAt: string;
}

interface FacultyFilters {
  status: string;
  department: string;
  dateRange: string;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const DEPARTMENTS = [
  'All Departments',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Humanities',
  'Business',
];

const STATUSES = ['All Statuses', 'Pending', 'Approved', 'Rejected'];

const facultyColumns = [
  {
    header: 'Applicant',
    key: 'fullName',
    render: (faculty: Faculty) => (
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm"></div>
          <span className="relative z-10 font-medium text-lg">
            {faculty.fullName?.[0]?.toUpperCase() || <FiUser />}
          </span>
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-200">{faculty.fullName || 'N/A'}</p>
          <p className="text-xs text-gray-400">ID: {faculty._id.substring(0, 8)}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Email',
    key: 'email',
    render: (faculty: Faculty) => (
      <div className="flex items-center text-gray-300">
        <FiMail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{faculty.email || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Department',
    key: 'department',
    render: (faculty: Faculty) => (
      <div className="flex items-center text-gray-300">
        <FiBriefcase size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{faculty.department || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Applied On',
    key: 'createdAt',
    render: (faculty: Faculty) => (
      <div className="flex items-center text-gray-300">
        <FiCalendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(faculty.createdAt)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (faculty: Faculty) => (
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

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setCustomDateRange((prev) => ({ ...prev, [field]: value }));
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
    });
    setCustomDateRange({ startDate: '', endDate: '' });
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
  ];

  const filteredFaculty = faculty?.filter((member) => {
    const fullName = member.fullName || '';
    const email = member.email || '';
    const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = email.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch =
      filters.status === 'all' ||
      member.status.toLowerCase() === filters.status.toLowerCase();
    const departmentMatch =
      filters.department === 'all_departments' ||
      member.department.toLowerCase().replace(/\s+/g, '_') === filters.department;
    const dateMatch =
      filters.dateRange === 'all' ||
      (customDateRange.startDate &&
        customDateRange.endDate &&
        new Date(member.createdAt) >= new Date(customDateRange.startDate) &&
        new Date(member.createdAt) <= new Date(customDateRange.endDate)) ||
      (filters.dateRange === 'last_week' &&
        new Date(member.createdAt) >=
          new Date(new Date().setDate(new Date().getDate() - 7))) ||
      (filters.dateRange === 'last_month' &&
        new Date(member.createdAt) >=
          new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
      (filters.dateRange === 'last_3_months' &&
        new Date(member.createdAt) >=
          new Date(new Date().setMonth(new Date().getMonth() - 3)));
    return (nameMatch || emailMatch) && statusMatch && departmentMatch && dateMatch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error.message}
      </div>
    );
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
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search faculty..."
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
              {filteredFaculty?.length > 0 ? (
                <>
                  <ApplicationsTable
                    data={filteredFaculty}
                    columns={facultyColumns}
                    actions={facultyActions}
                    formatDate={formatDate}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages || 1}
                    itemsCount={filteredFaculty.length}
                    itemName="faculty"
                    onPageChange={(newPage) => setPage(newPage)}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <FiFileText size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Faculty Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no faculty members matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
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

      <FacultyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedFaculty(null);
        }}
        faculty={selectedFaculty}
      />

      <style jsx>{`
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