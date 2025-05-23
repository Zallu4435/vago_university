import React, { useState, useEffect, useCallback } from 'react';
import { useUserManagement } from '../../../application/hooks/useUserManagement';
import { FiUsers, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import { debounce } from 'lodash';
import ApplicantDetails from '../../components/admin/ApplicantDetails';
import ApprovalModal from '../../components/admin/ApprovalModal';
import WarningModal from '../../components/WarningModal';
import Header from '../admin/User/Header';
import ApplicationsTable from '../admin/User/ApplicationsTable';
import Pagination from '../admin/User/Pagination';
import { formatDate } from '../../../utils/utils';

const PROGRAMS = [
  'All Programs',
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Medicine',
  'Arts & Social Sciences',
];

const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [admissionToDelete, setAdmissionToDelete] = useState(null);
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

  const filteredAdmissions = users?.filter((admission) => {
    const fullName = admission.fullName || '';
    const email = admission.email || '';
    const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = email.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = filters.status === 'all' || admission.status === filters.status;
    const programMatch =
      filters.program === 'all_programs' ||
      admission.program?.toLowerCase().replace(/\s+/g, '_') === filters.program;
    const dateMatch =
      filters.dateRange === 'all' ||
      (filters.startDate &&
        filters.endDate &&
        new Date(admission.createdAt) >= new Date(filters.startDate) &&
        new Date(admission.createdAt) <= new Date(filters.endDate));
    return nameMatch && emailMatch && statusMatch && programMatch && dateMatch;
  });

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    }, 500),
    []
  );

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setCustomDateRange((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (filters.dateRange === 'custom' && customDateRange.startDate && customDateRange.endDate) {
      setFilters((prev) => ({
        ...prev,
        startDate: customDateRange.startDate,
        endDate: customDateRange.endDate,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }
  }, [customDateRange, filters.dateRange, setFilters]);

  const handleViewDetails = async (admission: any) => {
    try {
      const details = await getAdmissionDetails(admission._id);
      setSelectedApplicant(details);
      setShowDetails(true);
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  const handleActionClick = (admission: any) => {
    setSelectedAdmission(admission);
    setShowApprovalModal(true);
  };

  const handleApprove = async (data: any) => {
    try {
      const admissionId = selectedAdmission?._id;
      if (!admissionId) {
        throw new Error('No admission ID found');
      }
      await approveAdmission({
        id: admissionId,
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

  const handleReject = async (data: any) => {
    try {
      const admissionId = selectedAdmission?._id;
      if (!admissionId) {
        throw new Error('No admission ID found');
      }
      await rejectAdmission({
        id: admissionId,
        reason: data.reason || 'Application rejected',
      });
      setShowApprovalModal(false);
      setShowDetails(false);
      setSelectedAdmission(null);
    } catch (error) {
      console.error('Error rejecting admission:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdmission(id);
      setShowDeleteWarning(false);
      setAdmissionToDelete(null);
    } catch (error) {
      console.error('Error deleting admission:', error);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      program: 'all_programs',
      dateRange: 'all',
      startDate: undefined,
      endDate: undefined,
    });
    setCustomDateRange({ startDate: '', endDate: '' });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
              animation: `floatingMist ${Math.random() * 15 + 20}s ease-in-out infinite ${
                Math.random() * 5
              }s`,
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
              value: users?.filter((u) => u.status === 'pending').length || '0',
              change: '-2.1%',
              isPositive: true,
            },
            {
              icon: <FiBarChart2 />,
              title: 'Approval Rate',
              value: `${
                ((users?.filter((u) => u.status === 'approved').length / users?.length) * 100).toFixed(
                  2
                ) || '0'
              }%`,
              change: '+3.8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'All Applications', icon: <FiUsers size={16} />, active: true },
            { label: 'Pending', icon: <FiClipboard size={16} />, active: false },
            { label: 'Analytics', icon: <FiBarChart2 size={16} />, active: false },
          ]}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search by name or email..."
          filters={filters}
          filterOptions={{
            program: PROGRAMS,
          }}
          debouncedFilterChange={debouncedFilterChange}
          customDateRange={customDateRange}
          handleCustomDateChange={handleCustomDateChange}
          handleResetFilters={handleResetFilters}
          filterField="program"
        />

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
          <div className="px-6 py-5">
            {filteredAdmissions?.length > 0 ? (
              <>
                <ApplicationsTable
                  filteredAdmissions={filteredAdmissions}
                  formatDate={formatDate}
                  handleViewDetails={handleViewDetails}
                  handleActionClick={handleActionClick}
                  setAdmissionToDelete={setAdmissionToDelete}
                  setShowDeleteWarning={setShowDeleteWarning}
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
                  There are no admission applications matching your current filters. Try adjusting your
                  search criteria.
                </p>
              </div>
            )}
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
          applicantName={selectedAdmission?.fullName || 'Applicant'}
        />
      )}

      {showDeleteWarning && admissionToDelete && (
        <WarningModal
          isOpen={showDeleteWarning}
          onClose={() => {
            setShowDeleteWarning(false);
            setAdmissionToDelete(null);
          }}
          onConfirm={() => {
            handleDelete(admissionToDelete._id);
            setShowDeleteWarning(false);
            setAdmissionToDelete(null);
          }}
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