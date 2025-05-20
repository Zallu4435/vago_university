import React, { useState, useEffect, useCallback } from 'react';
import { useUserManagement } from '../../../application/hooks/useUserManagement';
import {
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiFileText,
  FiUser,
  FiMail,
  FiChevronDown,
  FiChevronUp,
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiRefreshCw,
} from 'react-icons/fi';
import ApplicantDetails from '../../components/admin/ApplicantDetails';
import ApprovalModal from '../../components/admin/ApprovalModal';
import WarningModal from '../../components/WarningModal';
import { debounce } from 'lodash';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
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
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [admissionToDelete, setAdmissionToDelete] = useState(null);

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
    deleteAdmission,
    rejectAdmission
  } = useUserManagement();

  const programs = [
    'All Programs',
    'Computer Science',
    'Business Administration',
    'Engineering',
    'Medicine',
    'Arts & Social Sciences',
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const debouncedFilterChange = useCallback(
    debounce((field, value) => {
      handleFilterChange(field, value);
    }, 500),
    []
  );

  const handleCustomDateChange = (field, value) => {
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

  const filteredAdmissions = users?.filter((admission) => {
    const fullName = admission.fullName || '';
    const email = admission.email || '';
    const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = email.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  const handleViewDetails = async (admission) => {
    try {
      const details = await getAdmissionDetails(admission._id);
      setSelectedApplicant(details);
      setShowDetails(true);
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  const handleActionClick = (admission) => {
    setSelectedAdmission(admission);
    setShowApprovalModal(true);
  };

  const handleApprove = async (data) => {
    try {
      console.log(data, "data")
      // If data contains admission property, use that
      const admissionId = data.admission?._id || selectedAdmission?._id;

      if (!admissionId) {
        throw new Error('No admission ID found');
      }

      await approveAdmission({
        id: admissionId,
        approvalData: {
          programDetails: data.programDetails || '',
          startDate: data.startDate || '',
          scholarshipInfo: data.scholarshipInfo || '',
          additionalNotes: data.additionalNotes || ''
        }
      });

      setShowApprovalModal(false);
      setSelectedAdmission(null);
    } catch (error) {
      console.error('Error approving admission:', error);
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectAdmission({
        id: selectedAdmission._id,
        reason
      });
      setShowApprovalModal(false);
      setSelectedAdmission(null);
    } catch (error) {
      console.error('Error rejecting admission:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdmission(id);
      // Optionally refresh the list or show a success message
    } catch (error) {
      console.error('Error deleting admission:', error);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handlePrevPage = () => setPage(page - 1);
  const handleNextPage = () => setPage(page + 1);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      program: 'all_programs',
      dateRange: 'all',
      startDate: undefined,
      endDate: undefined
    });
    setCustomDateRange({ startDate: '', endDate: '' });
  };

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
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Admission Management</h1>
        <p className="text-gray-600 mt-1">Review and process student admission applications</p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {/* Header with search and filters */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 border-b">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">Admission Applications</h3>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-64 pl-10 pr-3 py-2 bg-white bg-opacity-20 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${searchQuery ? 'text-black' : 'text-white'
                    } placeholder-blue-100`}
                />
              </div>

              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center space-x-1 px-4 py-2 bg-white bg-opacity-20 border border-blue-300 rounded-md text-white hover:bg-opacity-30"
              >
                <FiFilter size={18} />
                <span className='text-black'>Filters</span>
                {filterOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Filter options */}
          {filterOpen && (
            <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filter Applications</h3>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <FiRefreshCw size={16} />
                  Reset Filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => debouncedFilterChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Program Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Program</label>
                  <select
                    value={filters.program}
                    onChange={(e) => debouncedFilterChange('program', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    {programs.map((program, idx) => (
                      <option 
                        key={idx} 
                        value={program === 'All Programs' ? 'all_programs' : program.toLowerCase().replace(/\s+/g, '_')}
                      >
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Application Date</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => debouncedFilterChange('dateRange', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="all">All Dates</option>
                    <option value="last_week">Last Week</option>
                    <option value="last_month">Last Month</option>
                    <option value="last_3_months">Last 3 Months</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  {/* Custom Date Range Inputs */}
                  {filters.dateRange === 'custom' && (
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={customDateRange.startDate}
                          onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                        <input
                          type="date"
                          value={customDateRange.endDate}
                          onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {(filters.status !== 'all' || filters.program !== 'all_programs' || filters.dateRange !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {filters.status !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Status: {filters.status}
                        <button
                          onClick={() => debouncedFilterChange('status', 'all')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.program !== 'all_programs' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Program: {filters.program.replace(/_/g, ' ')}
                        <button
                          onClick={() => debouncedFilterChange('program', 'all_programs')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.dateRange !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Date: {filters.dateRange === 'custom' 
                          ? `${customDateRange.startDate} to ${customDateRange.endDate}`
                          : filters.dateRange.replace(/_/g, ' ')}
                        <button
                          onClick={() => debouncedFilterChange('dateRange', 'all')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Application list */}
        <div className="px-6 py-4">
          {filteredAdmissions?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Applicant
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Applied On
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions.map((admission) => (
                      <tr key={admission._id} className="hover:bg-blue-50 border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FiUser size={18} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{admission.fullName || 'N/A'}</p>
                              <p className="text-xs text-gray-500">ID: {admission._id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center">
                            <FiMail size={14} className="text-gray-400 mr-2" />
                            {admission.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(admission.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admission.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : admission.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {admission.status === 'pending' && '⏳ '}
                            {admission.status === 'approved' && '✓ '}
                            {admission.status === 'rejected' && '✕ '}
                            {admission.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              className="p-1 border border-gray-300 text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={() => handleViewDetails(admission)}
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </button>

                            <button
                              className={`p-1 border border-gray-300 text-green-600 hover:bg-green-50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${admission.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              onClick={() => handleActionClick(admission)}
                              disabled={admission.status !== 'pending'}
                              title="Take Action"
                            >
                              <FiCheckCircle size={16} />
                            </button>

                            <button
                              className={`p-1 border border-gray-300 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${admission.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              onClick={() => {
                                setAdmissionToDelete(admission);
                                setShowDeleteWarning(true);
                              }}
                              disabled={admission.status !== 'pending'}
                              title="Delete"
                            >
                              <FiXCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredAdmissions.length}</span> applications
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    onClick={handlePrevPage}
                    disabled={page === 1}
                  >
                    <FiArrowLeft size={14} className="mr-1" />
                    Previous
                  </button>

                  <span className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md">
                    Page {page} of {totalPages || 1}
                  </span>

                  <button
                    className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                  >
                    Next
                    <FiArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FiFileText size={32} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Applications Found</h3>
              <p className="text-gray-500 text-center max-w-sm">
                There are no admission applications matching your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Applicant details modal */}
      {showDetails && (
        <ApplicantDetails
          selectedApplicant={selectedApplicant}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          approveAdmission={handleApprove}
          deleteAdmission={handleDelete}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          formatDate={formatDate}
        />
      )}

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedAdmission && (
        <ApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedAdmission(null);
          }}
          onApprove={(data) => {
            approveAdmission({
              admission: selectedAdmission,
              ...data
            });
            setShowApprovalModal(false);
            setShowDetails(false);
          }}
          onReject={(reason) => {
            setShowApprovalModal(false);
          }}
          onDelete={handleDelete}
          applicantName={selectedAdmission.fullName || 'Applicant'}
        />
      )}

      {/* Warning Modal */}
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
    </div>
  );
};

export default UserManagement;