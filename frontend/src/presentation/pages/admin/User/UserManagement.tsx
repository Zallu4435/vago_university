import React, { useState, useEffect, useCallback } from 'react';
import { useUserManagement } from '../../../../application/hooks/useUserManagement';
import { debounce } from 'lodash';
import { FiRefreshCw, FiAlertCircle, FiUsers, FiClipboard, FiBarChart2 } from 'react-icons/fi';

// Component imports
import Header from './Header';
import ApplicationsTable from './ApplicationsTable';
import EmptyState from './EmptyState';
import Pagination from './Pagination';
import ApplicantDetails from '../../../components/admin/ApplicantDetails';
import ApprovalModal from '../../../components/admin/ApprovalModal';
import WarningModal from '../../../components/WarningModal';

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
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

    const handleReject = async (data) => {
        try {
            const admissionId = data.id || selectedAdmission?._id;
            if (!admissionId) {
                throw new Error('No admission ID found');
            }
            await rejectAdmission({
                id: admissionId,
                reason: data.reason || 'Application rejected'
            });
            setShowApprovalModal(false);
            setSelectedAdmission(null);
        } catch (error) {
            console.error('Error rejecting admission:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAdmission(id);
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
            endDate: undefined
        });
        setCustomDateRange({ startDate: '', endDate: '' });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
    };

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="flex flex-col items-center space-y-6">
                    {/* Ghost-themed loader */}
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-300/30 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-purple-500 rounded-full animate-spin"></div>
                        {/* Ghost particles */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-purple-400/60 rounded-full blur-sm"
                                style={{
                                    top: `${50 + Math.cos(i * 60 * Math.PI / 180) * 150}%`,
                                    left: `${50 + Math.sin(i * 60 * Math.PI / 180) * 150}%`,
                                    animation: `float${i % 3 + 1} ${2 + i * 0.3}s infinite ease-in-out`,
                                    animationDelay: `${i * 0.2}s`
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-purple-300 font-medium">Loading applications<span className="animate-ellipsis">...</span></p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden max-w-lg w-full p-8 border-l-4 border-red-500 relative">
                    {/* Error state ghost particles */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>

                    <div className="flex items-start space-x-4">
                        <div className="bg-red-900/30 p-3 rounded-full">
                            <FiAlertCircle size={28} className="text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Data</h3>
                            <p className="text-gray-300">{error.message || 'An unexpected error occurred. Please try again later.'}</p>
                            <button
                                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-800 text-white 
                           rounded-lg hover:from-red-500 hover:to-red-700 transition-all duration-300
                           shadow-lg hover:shadow-red-500/20 border border-red-500/20 flex items-center justify-center gap-2"
                                onClick={() => window.location.reload()}
                            >
                                <FiRefreshCw size={18} className="animate-spin-slow" />
                                <span>Retry</span>
                            </button>
                        </div>
                    </div>
                </div>
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
                            animation: `floatingMist ${Math.random() * 15 + 20}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <Header
                    title="Admission Management"
                    subtitle="Review and process student applications efficiently"
                    stats={[
                        { icon: <FiUsers />, title: "Total", value: users?.length || "0", change: "+12.5%", isPositive: true },
                        { icon: <FiClipboard />, title: "Pending", value: users?.filter((user) => user.status === 'pending')?.length || "0", change: "-8.3%", isPositive: true },
                        { icon: <FiBarChart2 />, title: "Approval Rate", value: `${((users?.filter((user) => user.status === 'approved').length / users?.length) * 100).toFixed(2)}%`, change: "+5.2%", isPositive: true }
                    ]}
                    tabs={[
                        { label: "All Applications", icon: <FiUsers size={16} />, active: true },
                        { label: "Pending", icon: <FiClipboard size={16} />, active: false },
                        { label: "Analytics", icon: <FiBarChart2 size={16} />, active: false }
                    ]}
                    searchPlaceholder="Search applicants..."
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    programs={programs}
                    debouncedFilterChange={debouncedFilterChange}
                    customDateRange={customDateRange}
                    handleCustomDateChange={handleCustomDateChange}
                    handleResetFilters={handleResetFilters}
                    filterField="program" // Optional, as it’s the default
                // onTabClick={handleTabChange} // Optional
                />

                <div className="mt-8">
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
                                        itemName="Users"
                                        onPageChange={(newPage) => setPage(newPage)}
                                        onFirstPage={() => setPage(1)}
                                        onLastPage={() => setPage(totalPages)}
                                    />
                                </>
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDetails && (
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

            {showApprovalModal && (
                <ApprovalModal
                    isOpen={showApprovalModal}
                    onClose={() => setShowApprovalModal(false)}
                    onApprove={(data) => {
                        handleApprove({
                            admission: selectedAdmission,
                            ...data
                        });
                    }}
                    onReject={(reason) => {
                        handleReject({
                            id: selectedAdmission._id,
                            reason: reason || 'Application rejected'
                        });
                    }}
                    onDelete={() => {
                        setShowApprovalModal(false);
                        setShowDeleteWarning(true);
                    }}
                    applicantName={selectedAdmission?.fullName}
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
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(5px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(-7px); }
        }
        
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
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-ellipsis::before {
          content: '';
          animation: ellipsis 1.5s infinite;
        }
        
        @keyframes ellipsis {
          0% { content: '.'; }
          33% { content: '..'; }
          66% { content: '...'; }
          100% { content: '.'; }
        }
      `}</style>
        </div>
    );
};

export default UserManagement;