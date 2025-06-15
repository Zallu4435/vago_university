import React, { useState } from 'react';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiBook, FiBriefcase, FiUser, FiClock, FiUsers, FiPercent, FiCheck, FiX } from 'react-icons/fi';
import { useDiplomaManagement } from '../../../../application/hooks/useDiplomaManagement';
import WarningModal from '../../../components/WarningModal';
import Header from '../User/Header';
import Pagination from '../User/Pagination';
import ApplicationsTable from '../User/ApplicationsTable';
import DiplomaForm from './DiplomaForm';
import DiplomaDetails from './DiplomaDetails';
import EnrollmentDetails from './EnrollmentDetails';
import { debounce } from 'lodash';

interface Diploma {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    duration: string;
    prerequisites: string[];
    status: boolean;
    createdAt: string;
    updatedAt: string;
    videoIds: string[];
    videoCount: number; // Derived from videoIds.length
}

interface Enrollment {
    id: string;
    studentName: string;
    studentEmail: string;
    courseTitle: string;
    enrollmentDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    progress: number;
}

const CATEGORIES = ['All Categories', 'Programming', 'Data Science', 'Business', 'Design', 'Marketing'];
const STATUSES = ['All', 'Active', 'Inactive', 'Pending', 'Approved', 'Rejected'];

const diplomaColumns = [
    {
        header: 'Title',
        key: 'title',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiBook size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.title}</span>
            </div>
        ),
        width: '25%',
    },
    {
        header: 'Category',
        key: 'category',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiBriefcase size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.category}</span>
            </div>
        ),
    },
    {
        header: 'Price',
        key: 'price',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <span className="text-sm">${diploma.price.toFixed(2)}</span>
            </div>
        ),
    },
    {
        header: 'Duration',
        key: 'duration',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiClock size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.duration}</span>
            </div>
        ),
    },
    {
        header: 'Videos',
        key: 'videoCount',
        render: (diploma: Diploma) => (
            <div className="flex items-center text-gray-300">
                <FiBook size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{diploma.videoCount}</span>
            </div>
        ),
    },
    {
        header: 'Status',
        key: 'status',
        render: (diploma: Diploma) => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${diploma.status ? 'bg-green-900/30 text-green-400 border-green-500/30' : 'bg-red-900/30 text-red-400 border-red-500/30'
                    }`}
            >
                <span className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}></span>
                {diploma.status ? 'Active' : 'Inactive'}
            </span>
        ),
    },
];

const enrollmentColumns = [
    {
        header: 'Student',
        key: 'studentName',
        render: (enrollment: Enrollment) => (
            <div className="flex items-center text-gray-300">
                <FiUser size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{enrollment.studentName}</span>
            </div>
        ),
        width: '20%',
    },
    {
        header: 'Course',
        key: 'courseTitle',
        render: (enrollment: Enrollment) => (
            <div className="flex items-center text-gray-300">
                <FiBook size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{enrollment.courseTitle}</span>
            </div>
        ),
    },
    {
        header: 'Progress',
        key: 'progress',
        render: (enrollment: Enrollment) => (
            <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-300">{enrollment.progress}%</span>
                        <span className="text-xs text-gray-400">
                            {enrollment.progress === 100 ? 'Complete' :
                                enrollment.progress >= 75 ? 'Almost Done' :
                                    enrollment.progress >= 50 ? 'In Progress' :
                                        enrollment.progress > 0 ? 'Getting Started' : 'Not Started'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ease-out relative ${enrollment.progress === 100
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                    : enrollment.progress >= 75
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                        : enrollment.progress >= 50
                                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                            : enrollment.progress > 0
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                : 'bg-gray-600'
                                }`}
                            style={{ width: `${enrollment.progress}%` }}
                        >
                            {enrollment.progress > 0 && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${enrollment.progress === 100
                            ? 'bg-green-500/20 text-green-400 border-green-500/50'
                            : enrollment.progress >= 75
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                                : enrollment.progress >= 50
                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                    : enrollment.progress > 0
                                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }`}>
                        {enrollment.progress === 100 ? '✓' : Math.round(enrollment.progress)}
                    </div>
                </div>
            </div>
        ),
    },
    {
        header: 'Status',
        key: 'status',
        render: (enrollment: Enrollment) => (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${enrollment.status === 'Approved'
                        ? 'bg-green-900/30 text-green-400 border-green-500/30'
                        : enrollment.status === 'Pending'
                            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-900/30 text-red-400 border-red-500/30'
                    }`}
            >
                <span className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}></span>
                {enrollment.status}
            </span>
        ),
    },
    {
        header: 'Enrollment Date',
        key: 'enrollmentDate',
        render: (enrollment: Enrollment) => (
            <div className="flex items-center text-gray-300">
                <FiClock size={14} className="text-purple-400 mr-2" />
                <span className="text-sm">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</span>
            </div>
        ),
    },
];

const DiplomaManagement: React.FC = () => {
    const {
        diplomas,
        totalPages,
        page,
        setPage,
        filters,
        setFilters,
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
    } = useDiplomaManagement();

    const [searchTerm, setSearchTerm] = useState('');
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
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
        setPage(1);
    }, 300);

    const handleResetFilters = () => {
        setFilters({
            category: 'All Categories',
            status: 'All',
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

    const filteredDiplomas = diplomas.filter((diploma) =>
        diploma.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEnrollments = enrollments.filter((enrollment) =>
        enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    setSearchQuery={setSearchTerm}
                    searchPlaceholder="Search diplomas or enrollments..."
                    filters={filters}
                    filterOptions={{
                        category: CATEGORIES,
                        status: activeTab === 'diplomas' ? ['All', 'Active', 'Inactive'] : ['All', 'Pending', 'Approved', 'Rejected'],
                    }}
                    debouncedFilterChange={debouncedFilterChange}
                    handleResetFilters={handleResetFilters}
                    onTabClick={(index) => handleTabChange(index === 0 ? 'diplomas' : 'enrollments')}
                />

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

                            {activeTab === 'diplomas' && filteredDiplomas.length > 0 && (
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
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                                                <FiUsers size={32} className="text-purple-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white mb-1">No Enrollments Found</h3>
                                            <p className="text-gray-400 text-center max-w-sm">
                                                There are no enrollment requests matching your current filters.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'diplomas' && filteredDiplomas.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                                        <FiBook size={32} className="text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1">No Diplomas Found</h3>
                                    <p className="text-gray-400 text-center max-w-sm">
                                        There are no diploma courses matching your current filters.
                                    </p>
                                </div>
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