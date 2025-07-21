import React, { useState, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiBook, FiUsers, FiPercent, FiCheck, FiX } from 'react-icons/fi';
import { useAdminDiplomaManagement } from '../../../../application/hooks/useAdminDiplomaManagement';
import WarningModal from '../../../components/common/WarningModal';
import Header from '../../../components/admin/management/Header';
import Pagination from '../../../components/admin/management/Pagination';
import ApplicationsTable from '../../../components/admin/management/ApplicationsTable';
import DiplomaForm from './DiplomaForm';
import DiplomaDetails from './DiplomaDetails';
import EnrollmentDetails from './EnrollmentDetails';
import { debounce } from 'lodash';
import { Diploma, Enrollment } from '../../../../domain/types/management/diplomamanagement';
import { CATEGORIES, diplomaColumns, enrollmentColumns } from '../../../../shared/constants/diplomaManagementConstants';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorMessage from '../../../../shared/components/ErrorMessage';
import EmptyState from '../../../../shared/components/EmptyState';

const DiplomaManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const debouncedSetSearch = useMemo(() => debounce((val: string) => setDebouncedSearch(val), 400), []);
    const DATE_RANGES = [
        'All',
        'last_week',
        'last_month',
        'last_3_months',
        'custom',
    ];
    const [filters, setFilters] = useState({
        category: 'All Categories',
        status: 'All',
        dateRange: 'All',
        startDate: '',
        endDate: '',
    });
    const {
        diplomas,
        totalPages,
        page,
        setPage,
        filters: hookFilters,
        setFilters: setHookFilters,
        isLoading,
        error,
        createDiploma,
        updateDiploma,
        deleteDiploma,
        enrollments,
        enrollmentTotalPages,
        isLoadingEnrollments,
        approveEnrollment,
        rejectEnrollment,
        resetProgress,
        diplomaDetails,
        isLoadingDiplomaDetails,
        handleViewDiploma,
        handleEditDiploma,
        enrollmentDetails,
        isLoadingEnrollmentDetails,
        handleViewEnrollment,
        activeTab,
        handleTabChange,
    } = useAdminDiplomaManagement(debouncedSearch, filters);

    const [showDiplomaModal, setShowDiplomaModal] = useState(false);
    const [showDiplomaDetail, setShowDiplomaDetail] = useState(false);
    const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);
    const [diplomaToDelete, setDiplomaToDelete] = useState<Diploma | null>(null);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [showApproveWarning, setShowApproveWarning] = useState(false);
    const [showRejectWarning, setShowRejectWarning] = useState(false);
    const [showResetWarning, setShowResetWarning] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showEnrollmentDetails, setShowEnrollmentDetails] = useState(false);

    const debouncedFilterChange = debounce((field: string, value: string) => {
        setFilters((prev) => {
            if (field === 'dateRange' && value !== 'custom') {
                return { ...prev, dateRange: value, startDate: '', endDate: '' };
            }
            return { ...prev, [field]: value };
        });
        setPage(1);
    }, 300);

    const handleResetFilters = () => {
        setFilters({
            category: 'All Categories',
            status: 'All',
            dateRange: 'All',
            startDate: '',
            endDate: '',
        });
        setPage(1);
        setSearchTerm('');
    };

    const handleAddDiploma = () => {
        setEditingDiploma(null);
        setShowDiplomaModal(true);
    };

    const handleSaveDiploma = async (formData: Partial<Diploma>) => {
        try {
            if (editingDiploma) {
                await updateDiploma({ id: editingDiploma.id, data: formData });
            } else {
                await createDiploma({
                    ...formData,
                    videoIds: [],
                } as Omit<Diploma, 'id' | 'createdAt' | 'updatedAt'>);
            }
            setShowDiplomaModal(false);
            setEditingDiploma(null);
        } catch (error) {
            console.error('Error saving diploma:', error);
        }
    };

    const handleConfirmDelete = async () => {
        if (diplomaToDelete) {
            await deleteDiploma(diplomaToDelete.id);
            setShowDeleteWarning(false);
            setDiplomaToDelete(null);
        }
    };

    const handleConfirmApprove = async () => {
        if (selectedEnrollment) {
            await approveEnrollment(selectedEnrollment.id);
            setShowApproveWarning(false);
            setSelectedEnrollment(null);
        }
    };

    const handleConfirmReject = async () => {
        if (selectedEnrollment && rejectReason) {
            await rejectEnrollment({ requestId: selectedEnrollment.id, reason: rejectReason });
            setShowRejectWarning(false);
            setSelectedEnrollment(null);
            setRejectReason('');
        }
    };

    const handleConfirmReset = async () => {
        if (selectedEnrollment) {
            await resetProgress(selectedEnrollment.id);
            setShowResetWarning(false);
            setSelectedEnrollment(null);
        }
    };

    const diplomaActions = [
        {
            icon: <FiEye size={16} />,
            label: 'View Diploma',
            onClick: (diploma: Diploma) => {
                handleViewDiploma(diploma.id);
                setShowDiplomaDetail(true);
            },
            color: 'blue' as const,
        },
        {
            icon: <FiEdit size={16} />,
            label: 'Edit Diploma',
            onClick: (diploma: Diploma) => {
                handleEditDiploma(diploma.id);
                setEditingDiploma(diploma);
                setShowDiplomaModal(true);
            },
            color: 'green' as const,
        },
        {
            icon: <FiTrash2 size={16} />,
            label: 'Delete Diploma',
            onClick: (diploma: Diploma) => {
                setDiplomaToDelete(diploma);
                setShowDeleteWarning(true);
            },
            color: 'red' as const,
        },
    ];

    const enrollmentActions = [
        {
            icon: <FiEye size={16} />,
            label: 'View Details',
            onClick: (enrollment: Enrollment) => {
                handleViewEnrollment(enrollment.id);
                setShowEnrollmentDetails(true);
            },
            color: 'blue' as const,
        },
        {
            icon: <FiCheck size={16} />,
            label: 'Approve',
            onClick: (enrollment: Enrollment) => {
                setSelectedEnrollment(enrollment);
                setShowApproveWarning(true);
            },
            color: 'green' as const,
            disabled: (enrollment: Enrollment) => enrollment.status !== 'Pending',
        },
        {
            icon: <FiX size={16} />,
            label: 'Reject',
            onClick: (enrollment: Enrollment) => {
                setSelectedEnrollment(enrollment);
                setShowRejectWarning(true);
            },
            color: 'red' as const,
            disabled: (enrollment: Enrollment) => enrollment.status !== 'Pending',
        },
        {
            icon: <FiTrash2 size={16} />,
            label: 'Reset Progress',
            onClick: (enrollment: Enrollment) => {
                setSelectedEnrollment(enrollment);
                setShowResetWarning(true);
            },
            color: 'yellow' as const,
            disabled: (enrollment: Enrollment) => enrollment.progress === 0,
        },
    ];

    if (error) {
        return <ErrorMessage message={error.message} />;
    }

    const filteredDiplomas = diplomas;
    const filteredEnrollments = enrollments;

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
                    title="Diploma Course Management"
                    subtitle="Manage diploma courses and student enrollments"
                    stats={[
                        {
                            icon: <FiBook />,
                            title: 'Total Diplomas',
                            value: filteredDiplomas.length.toString(),
                            change: '+3.5%',
                            isPositive: true,
                        },
                        {
                            icon: <FiUsers />,
                            title: 'Active Enrollments',
                            value: filteredEnrollments.filter((e) => e.status === 'Approved').length.toString(),
                            change: '+2.8%',
                            isPositive: true,
                        },
                        {
                            icon: <FiPercent />,
                            title: 'Avg. Progress',
                            value: `${Math.round(filteredEnrollments.reduce((acc, e) => acc + e.progress, 0) / (filteredEnrollments.length || 1))}%`,
                            change: '+4.2%',
                            isPositive: true,
                        },
                    ]}
                    tabs={[
                        { label: 'Diplomas', icon: <FiBook size={16} />, active: activeTab === 'diplomas' },
                        { label: 'Enrollments', icon: <FiUsers size={16} />, active: activeTab === 'enrollments' },
                    ]}
                    searchQuery={searchTerm}
                    setSearchQuery={(val) => {
                        setSearchTerm(val);
                        debouncedSetSearch(val);
                    }}
                    searchPlaceholder="Search diplomas or enrollments..."
                    filters={filters}
                    filterOptions={{
                        category: CATEGORIES,
                        status: activeTab === 'diplomas' ? ['All', 'Active', 'Inactive'] : ['All', 'Pending', 'Approved', 'Rejected'],
                        dateRange: DATE_RANGES,
                    }}
                    debouncedFilterChange={debouncedFilterChange}
                    handleResetFilters={handleResetFilters}
                    onTabClick={(index) => handleTabChange(index === 0 ? 'diplomas' : 'enrollments')}
                />

                {/* Show custom date pickers if custom dateRange is selected */}
                {filters.dateRange === 'custom' && (
                    <div className="flex gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
                                value={filters.startDate}
                                onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">End Date</label>
                            <input
                                type="date"
                                className="px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
                                value={filters.endDate}
                                onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
                        <div className="px-6 py-5">
                            {activeTab === 'diplomas' && (
                                <button
                                    onClick={handleAddDiploma}
                                    className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <FiPlus size={16} />
                                    Add Diploma
                                </button>
                            )}

                            {activeTab === 'diplomas' && (
                                isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <LoadingSpinner />
                                    </div>
                                ) : filteredDiplomas.length > 0 ? (
                                    <>
                                        <ApplicationsTable
                                            data={filteredDiplomas}
                                            columns={diplomaColumns}
                                            actions={diplomaActions}
                                        />
                                        <Pagination
                                            page={page}
                                            totalPages={totalPages}
                                            itemsCount={filteredDiplomas.length}
                                            itemName="diplomas"
                                            onPageChange={(newPage) => setPage(newPage)}
                                            onFirstPage={() => setPage(1)}
                                            onLastPage={() => setPage(totalPages)}
                                        />
                                    </>
                                ) : (
                                    <EmptyState
                                        icon={<FiBook size={32} className="text-purple-400" />}
                                        title="No Diplomas Found"
                                        message="There are no diploma courses matching your current filters."
                                    />
                                )
                            )}

                            {activeTab === 'enrollments' && (
                                <div className="space-y-8">
                                    <h3 className="text-lg font-medium text-white">Diploma Enrollment Requests</h3>
                                    {isLoadingEnrollments ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                                        </div>
                                    ) : filteredEnrollments.length > 0 ? (
                                        <>
                                            <ApplicationsTable
                                                data={filteredEnrollments}
                                                columns={enrollmentColumns}
                                                actions={enrollmentActions}
                                            />
                                            <Pagination
                                                page={page}
                                                totalPages={enrollmentTotalPages}
                                                itemsCount={filteredEnrollments.length}
                                                itemName="enrollments"
                                                onPageChange={(newPage) => setPage(newPage)}
                                                onFirstPage={() => setPage(1)}
                                                onLastPage={() => setPage(enrollmentTotalPages)}
                                            />
                                        </>
                                    ) : (
                                        <EmptyState
                                            icon={<FiUsers size={32} className="text-purple-400" />}
                                            title="No Enrollments Found"
                                            message="There are no enrollment requests matching your current filters."
                                        />
                                    )}
                                </div>
                            )}

                            {activeTab === 'diplomas' && filteredDiplomas.length === 0 && (
                                <EmptyState
                                    icon={<FiBook size={32} className="text-purple-400" />}
                                    title="No Diplomas Found"
                                    message="There are no diploma courses matching your current filters."
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDiplomaModal && (
                <DiplomaForm
                    isOpen={showDiplomaModal}
                    onClose={() => setShowDiplomaModal(false)}
                    onSubmit={handleSaveDiploma}
                    initialData={editingDiploma}
                    isEditing={!!editingDiploma}
                    categories={CATEGORIES.filter((c) => c !== 'All Categories')}
                />
            )}

            {showDiplomaDetail && diplomaDetails && (
                <DiplomaDetails
                    isOpen={showDiplomaDetail}
                    onClose={() => setShowDiplomaDetail(false)}
                    diploma={diplomaDetails}
                    isLoading={isLoadingDiplomaDetails}
                />
            )}

            {showEnrollmentDetails && enrollmentDetails && (
                <EnrollmentDetails
                    isOpen={showEnrollmentDetails}
                    onClose={() => setShowEnrollmentDetails(false)}
                    enrollment={enrollmentDetails}
                    isLoading={isLoadingEnrollmentDetails}
                />
            )}

            <WarningModal
                isOpen={showDeleteWarning}
                onClose={() => setShowDeleteWarning(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Diploma"
                message={diplomaToDelete ? `Are you sure you want to delete "${diplomaToDelete.title}"? This will also delete associated videos and enrollments.` : ''}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            <WarningModal
                isOpen={showApproveWarning}
                onClose={() => setShowApproveWarning(false)}
                onConfirm={handleConfirmApprove}
                title="Approve Enrollment"
                message={selectedEnrollment ? `Approve enrollment for ${selectedEnrollment.studentName} in "${selectedEnrollment.courseTitle}"?` : ''}
                confirmText="Approve"
                cancelText="Cancel"
                type="success"
            />

            <WarningModal
                isOpen={showRejectWarning}
                onClose={() => {
                    setShowRejectWarning(false);
                    setRejectReason('');
                }}
                onConfirm={handleConfirmReject}
                title="Reject Enrollment"
                message={
                    <div className="space-y-4">
                        <p>Reject enrollment for {selectedEnrollment?.studentName} in "{selectedEnrollment?.courseTitle}"?</p>
                        <div>
                            <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-300 mb-1">
                                Reason for Rejection
                            </label>
                            <textarea
                                id="rejectReason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={3}
                                placeholder="Enter reason for rejection..."
                                required
                            />
                        </div>
                    </div>
                }
                confirmText="Reject"
                cancelText="Cancel"
                type="danger"
                disabled={!rejectReason.trim()}
            />

            <WarningModal
                isOpen={showResetWarning}
                onClose={() => setShowResetWarning(false)}
                onConfirm={handleConfirmReset}
                title="Reset Progress"
                message={selectedEnrollment ? `Reset progress for ${selectedEnrollment.studentName} in "${selectedEnrollment.courseTitle}"? This will set their progress to 0%.` : ''}
                confirmText="Reset"
                cancelText="Cancel"
                type="warning"
            />

            <style jsx>{`
        @keyframes floatingMist {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
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

export default DiplomaManagement;