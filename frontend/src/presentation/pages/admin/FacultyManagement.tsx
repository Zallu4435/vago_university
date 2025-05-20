// src/presentation/pages/admin/FacultyManagement.tsx
import React, { useState, useCallback } from 'react';
import { useFacultyManagement } from '../../../application/hooks/useFacultyManagement';
import {
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
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import { debounce } from 'lodash';
import WarningModal from '../../components/WarningModal';
import ApprovalModal from '../../components/admin/ApprovalModal';
import FacultyDetailsModal from '../../components/admin/FacultyDetailsModal';

const FacultyManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' });
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
    updateFacultyStatus
  } = useFacultyManagement();

  const departments = [
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

  const handleViewDetails = async (faculty) => {
    try {
      const details = await getFacultyDetails(faculty._id);
      setSelectedFaculty(details);
      setIsDetailsModalOpen(true);
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  const handleActionClick = (faculty) => {
    setSelectedFaculty(faculty);
    setShowApprovalModal(true);
  };

  const handleApprove = async (data) => {
    try {
      await approveFaculty({
        id: selectedFaculty._id,
        approvalData: {
          department: data.department || '',
          role: data.role || '',
          startDate: data.startDate || '',
          additionalNotes: data.additionalNotes || ''
        }
      });
      setShowApprovalModal(false);
      setSelectedFaculty(null);
    } catch (error) {
      console.error('Error approving faculty:', error);
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectFaculty({
        id: selectedFaculty._id,
        reason
      });
      setShowApprovalModal(false);
      setSelectedFaculty(null);
    } catch (error) {
      console.error('Error rejecting faculty:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFaculty(id);
      setShowDeleteWarning(false);
      setFacultyToDelete(null);
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handlePrevPage = () => setPage(page - 1);
  const handleNextPage = () => setPage(page + 1);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      department: 'all_departments',
      dateRange: 'all',
      startDate: undefined,
      endDate: undefined
    });
    setCustomDateRange({ startDate: '', endDate: '' });
  };

  const filteredFaculty = faculty?.filter((member) => {
    const fullName = member.fullName || '';
    const email = member.email || '';
    const nameMatch = fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = email.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
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
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">Faculty Management</h1>
        <p className="text-gray-600 mt-1">Manage faculty applications and members</p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        {/* Header with search and filters */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 border-b">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">Faculty Applications</h3>

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
                  className={`w-64 pl-10 pr-3 py-2 bg-white bg-opacity-20 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                    searchQuery ? 'text-black' : 'text-white'
                  } placeholder-blue-100`}
                />
              </div>

              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center space-x-1 px-4 py-2 bg-white bg-opacity-20 border border-blue-300 rounded-md text-white hover:bg-opacity-30"
              >
                <FiFilter size={18} />
                <span className="text-black">Filters</span>
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

                {/* Department Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => debouncedFilterChange('department', e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    {departments.map((dept, idx) => (
                      <option
                        key={idx}
                        value={dept === 'All Departments' ? 'all_departments' : dept.toLowerCase().replace(/\s+/g, '_')}
                      >
                        {dept}
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
              {(filters.status !== 'all' || filters.department !== 'all_departments' || filters.dateRange !== 'all') && (
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
                    {filters.department !== 'all_departments' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Department: {filters.department.replace(/_/g, ' ')}
                        <button
                          onClick={() => debouncedFilterChange('department', 'all_departments')}
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

        {/* Faculty list */}
        <div className="px-6 py-4">
          {filteredFaculty?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Faculty
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 bg-gray-50 border-b">
                        Department
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
                    {filteredFaculty.map((faculty) => (
                      <tr key={faculty._id} className="hover:bg-blue-50 border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                              <FiUser size={18} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{faculty.fullName}</p>
                              <p className="text-xs text-gray-500">ID: {faculty._id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center">
                            <FiMail size={14} className="text-gray-400 mr-2" />
                            {faculty.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{faculty.department}</td>
                        <td className="px-4 py-3 text-gray-600">{formatDate(faculty.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              faculty.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : faculty.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {faculty.status === 'pending' && '⏳ '}
                            {faculty.status === 'approved' && '✓ '}
                            {faculty.status === 'rejected' && '✕ '}
                            {faculty.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              className="p-1 border border-gray-300 text-blue-600 hover:bg-blue-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onClick={() => handleViewDetails(faculty)}
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </button>

                            <button
                              className={`p-1 border border-gray-300 text-green-600 hover:bg-green-50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                faculty.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={() => handleActionClick(faculty)}
                              disabled={faculty.status !== 'pending'}
                              title="Take Action"
                            >
                              <FiCheckCircle size={16} />
                            </button>

                            <button
                              className={`p-1 border border-gray-300 text-red-600 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                faculty.status !== 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={() => {
                                setFacultyToDelete(faculty);
                                setShowDeleteWarning(true);
                              }}
                              disabled={faculty.status !== 'pending'}
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
                  Showing <span className="font-medium">{filteredFaculty.length}</span> applications
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                      page === 1 ? 'opacity-50 cursor-not-allowed' : ''
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
                    className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                      page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
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
                There are no faculty applications matching your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedFaculty && (
        <ApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedFaculty(null);
          }}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          applicantName={selectedFaculty.fullName || 'Applicant'}
        />
      )}

      {/* Warning Modal */}
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

      {/* FacultyDetailsModal */}
      <FacultyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedFaculty(null);
        }}
        faculty={selectedFaculty?.faculty}
      />
    </div>
  );
};

export default FacultyManagement;