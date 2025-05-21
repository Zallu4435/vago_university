import React, { useState, useCallback } from 'react';
import { useFacultyManagement } from '../../../application/hooks/useFacultyManagement';
import {
  FiFileText,
  FiUsers,
  FiClipboard,
  FiBarChart2,
} from 'react-icons/fi';
import { debounce } from 'lodash';
import WarningModal from '../../components/WarningModal';
import FacultyDetailsModal from '../../components/admin/FacultyDetailsModal';
import Header from '../admin/User/Header';
import Pagination from '../admin/User/Pagination';
import ApplicationsTable from '../admin/User/ApplicationsTable'; // Import ApplicationsTable

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
    setShowApproveWarning(true);
  };

  const handleApprove = () => {
    if (!selectedFaculty) return;

    const approvalData = {
      department: selectedFaculty.department || '',
      role: 'Faculty',
      startDate: new Date().toISOString(),
      additionalNotes: ''
    };

    approveFaculty.mutate({
      id: selectedFaculty._id,
      approvalData
    });
    setShowApproveWarning(false);
    setSelectedFaculty(null);
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
  }).map((member) => ({
    ...member,
    program: member.department // Map department to program for ApplicationsTable
  }));

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
      {/* Background ghost effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-purple-500/10 blur-md"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationName: 'floatingMist',
              animationDuration: `${Math.random() * 15 + 20}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Header
          title="Faculty Management"
          subtitle="Manage faculty applications and members"
          stats={[
            { icon: <FiUsers />, title: "Total", value: faculty?.length || "0", change: "+5.2%", isPositive: true },
            { icon: <FiClipboard />, title: "Pending", value: faculty?.filter(f => f.status === 'pending').length || "0", change: "-2.1%", isPositive: true },
            { icon: <FiBarChart2 />, title: "Approval Rate", value: `${((faculty?.filter(f => f.status === 'approved').length / faculty?.length) * 100).toFixed(2)}%`, change: "+3.8%", isPositive: true }
          ]}
          tabs={[
            { label: "All Faculty", icon: <FiUsers size={16} />, active: true },
            { label: "Pending", icon: <FiClipboard size={16} />, active: false },
            { label: "Departments", icon: <FiBarChart2 size={16} />, active: false }
          ]}
          searchPlaceholder="Search faculty..."
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          programs={departments}
          debouncedFilterChange={debouncedFilterChange}
          customDateRange={customDateRange}
          handleCustomDateChange={handleCustomDateChange}
          handleResetFilters={handleResetFilters}
          filterField="department" // Specify department for FacultyManagement
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {filteredFaculty?.length > 0 ? (
                <>
                  <ApplicationsTable
                    filteredAdmissions={filteredFaculty}
                    formatDate={formatDate}
                    handleViewDetails={handleViewDetails}
                    handleActionClick={handleActionClick}
                    setAdmissionToDelete={setFacultyToDelete}
                    setShowDeleteWarning={setShowDeleteWarning}
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

      {/* Approval Confirmation Modal */}
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