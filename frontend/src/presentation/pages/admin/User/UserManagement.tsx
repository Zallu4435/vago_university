import React, { useState, useCallback } from 'react';
import { useUserManagement } from '../../../../application/hooks/useUserManagement';
import { FiUsers, FiClipboard, FiBarChart2, FiUser, FiMail, FiCalendar, FiBook, FiEye, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { debounce } from 'lodash';
import ApprovalModal from '../../../components/admin/ApprovalModal';
import WarningModal from '../../../components/WarningModal';
import Header from './Header';
import ApplicationsTable from './ApplicationsTable';
import Pagination from './Pagination';
import ApplicantDetails from '../../../components/admin/ApplicantDetails';

interface User {
  _id: string;
  fullName: string;
  email: string;
  program: string;
  status: string;
  createdAt: string;
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

const PROGRAMS = [
  'All Programs',
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Arts & Social Sciences',
];

const STATUSES = ['All Statuses', 'Pending', 'Approved', 'Rejected'];

const userColumns = [
  {
    header: 'Applicant',
    key: 'fullName',
    render: (user: User) => (
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm"></div>
          <span className="relative z-10 font-medium text-lg">
            {user.fullName?.[0]?.toUpperCase() || <FiUser />}
          </span>
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-200">{user.fullName || 'N/A'}</p>
          <p className="text-xs text-gray-400">ID: {user._id.substring(0, 8)}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Email',
    key: 'email',
    render: (user: User) => (
      <div className="flex items-center text-gray-300">
        <FiMail size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{user.email || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Program',
    key: 'program',
    render: (user: User) => (
      <div className="flex items-center text-gray-300">
        <FiBook size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{user.program || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Applied On',
    key: 'createdAt',
    render: (user: User) => (
      <div className="flex items-center text-gray-300">
        <FiCalendar size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{formatDate(user.createdAt)}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (user: User) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          user.status.toLowerCase() === 'approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : user.status.toLowerCase() === 'rejected'
            ? 'bg-red-900/30 text-red-400 border-red-500/30'
            : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
        }`}
        role="status"
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Pending'}
      </span>
    ),
  },
];

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedApplicant, setSelectedApplicant] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<User | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [admissionToDelete, setAdmissionToDelete] = useState<User | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    programs: true,
    education: true,
    achievements: true,
    otherInfo: true,
    documents: true,
    declaration: true,
    application: true,
  });

  const {
    users,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    getAdmissionDetails,
    approveAdmission,
    rejectAdmission,
    deleteAdmission,
  } = useUserManagement();

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }, 500),
    []
  );

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setCustomDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = async (user: User) => {
    try {
      console.log('Opening details for user:', user);
      const details = await getAdmissionDetails(user._id);
      console.log('Received details:', details);
      setSelectedApplicant(details);
      setShowDetails(true);
      console.log('Modal state after update:', { showDetails: true, selectedApplicant: details });
    } catch (error) {
      console.error('Error fetching admission details:', error);
    }
  };

  const handleActionClick = (user: User) => {
    setSelectedAdmission(user);
    setShowApprovalModal(true);
  };

  const handleApprove = async (data: {
    programDetails: string;
    startDate: string;
    scholarshipInfo: string;
    additionalNotes: string;
  }) => {
    if (!selectedAdmission) return;
    try {
      await approveAdmission({
        id: selectedAdmission._id,
        approvalData: {
          programDetails: data.programDetails || '',
          startDate: data.startDate || '',
          scholarshipInfo: data.scholarshipInfo || '',
          additionalNotes: data.additionalNotes || '',
        },
      });
      setShowApprovalModal(false);
      setShowDetails(false);
      setSelectedAdmission(null);
    } catch (error) {
      console.error('Error approving admission:', error);
    }
  };

  const handleReject = async (data: { reason: string }) => {
    if (!selectedAdmission) return;
    try {
      await rejectAdmission({
        id: selectedAdmission._id,
        reason: data.reason || 'Application rejected',
      });
      setShowApprovalModal(false);
      setShowDetails(false);
      setSelectedAdmission(null);
    } catch (error) {
      console.error('Error rejecting admission:', error);
    }
  };

  const handleDelete = async (user: User) => {
    try {
      await deleteAdmission(user._id);
      setShowDeleteWarning(false);
      setAdmissionToDelete(null);
    } catch (error) {
      console.error('Error deleting admission:', error);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      program: '',
      dateRange: '',
    });
    setCustomDateRange({ startDate: '', endDate: '' });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const userActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Details',
      onClick: handleViewDetails,
      color: 'blue' as const,
    },
    {
      icon: <FiCheckCircle size={16} />,
      label: 'Review',
      onClick: handleActionClick,
      color: 'green' as const,
      disabled: (user: User) => user.status !== 'pending',
    },
    {
      icon: <FiXCircle size={16} />,
      label: 'Delete',
      onClick: (user: User) => {
        setAdmissionToDelete(user);
        setShowDeleteWarning(true);
      },
      color: 'red' as const,
      disabled: (user: User) => user.status !== 'pending',
    },
  ];

  const filteredAdmissions = users?.filter((user) => {
    const fullName = user.fullName || '';
    const email = user.email || '';
    const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter - simplified
    const statusMatch = !filters.status || 
      filters.status === 'all' ||
      user.status.toLowerCase() === filters.status.toLowerCase();

    // Program filter - simplified
    const programMatch = !filters.program ||
      filters.program === 'all' ||
      user.program?.toLowerCase() === filters.program.toLowerCase();

    // Date filter - simplified
    const dateMatch =
      !filters.dateRange ||
      filters.dateRange === 'all' ||
      (customDateRange.startDate &&
        customDateRange.endDate &&
        new Date(user.createdAt) >= new Date(customDateRange.startDate) &&
        new Date(user.createdAt) <= new Date(customDateRange.endDate)) ||
      (filters.dateRange === 'last_week' &&
        new Date(user.createdAt) >= new Date(new Date().setDate(new Date().getDate() - 7))) ||
      (filters.dateRange === 'last_month' &&
        new Date(user.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 1))) ||
      (filters.dateRange === 'last_3_months' &&
        new Date(user.createdAt) >= new Date(new Date().setMonth(new Date().getMonth() - 3)));

    return (nameMatch || emailMatch) && statusMatch && programMatch && dateMatch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error.message}</div>
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
          title="Admission Management"
          subtitle="Review and process student admission applications"
          stats={[
            {
              icon: <FiUsers />,
              title: 'Total Applications',
              value: users?.length || '0',
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiClipboard />,
              title: 'Pending',
              value: users?.filter((u) => u.status.toLowerCase() === 'pending').length || '0',
              change: '-2.1%',
              isPositive: true,
            },
            {
              icon: <FiBarChart2 />,
              title: 'Approval Rate',
              value: `${((users?.filter((u) => u.status.toLowerCase() === 'approved').length / users?.length) * 100 || 0).toFixed(2)}%`,
              change: '+3.8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'All Applications', icon: <FiUsers size={16} />, active: true },
          ]}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search by name or email..."
          filters={filters}
          filterOptions={{
            status: STATUSES,
            program: PROGRAMS,
          }}
          debouncedFilterChange={debouncedFilterChange}
          customDateRange={customDateRange}
          handleCustomDateChange={handleCustomDateChange}
          handleResetFilters={handleResetFilters}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {filteredAdmissions?.length > 0 ? (
                <>
                  <ApplicationsTable
                    data={filteredAdmissions}
                    columns={userColumns}
                    actions={userActions}
                    formatDate={formatDate}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages || 1}
                    itemsCount={filteredAdmissions.length}
                    itemName="applications"
                    onPageChange={(newPage) => setPage(newPage)}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <FiUsers size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Applications Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no admission applications matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDetails && selectedApplicant && (
        <ApplicantDetails
          selectedApplicant={selectedApplicant}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          approveAdmission={handleApprove}
          rejectAdmission={handleReject}
          deleteAdmission={deleteAdmission}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          formatDate={formatDate}
        />
      )}

      {showApprovalModal && selectedAdmission && (
        <ApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedAdmission(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={() => {
            setAdmissionToDelete(selectedAdmission);
            setShowApprovalModal(false);
            setShowDeleteWarning(true);
          }}
          applicantName={selectedAdmission.fullName || 'Applicant'}
        />
      )}

      {showDeleteWarning && admissionToDelete && (
        <WarningModal
          isOpen={showDeleteWarning}
          onClose={() => {
            setShowDeleteWarning(false);
            setAdmissionToDelete(null);
          }}
          onConfirm={() => handleDelete(admissionToDelete)}
          title="Delete Application"
          message={`Are you sure you want to delete ${admissionToDelete.fullName}'s application? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      )}

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

export default UserManagement;