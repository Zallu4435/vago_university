import React, { useState, useCallback, useMemo } from 'react';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiBookOpen, FiClipboard, FiBarChart2, FiCheck, FiX } from 'react-icons/fi';
import { useCourseManagement } from '../../../../application/hooks/useCourseManagement';
import WarningModal from '../../../components/common/WarningModal';
import Header from '../../../components/admin/management/Header';
import Pagination from '../../../components/admin/management/Pagination';
import ApplicationsTable from '../../../components/admin/management/ApplicationsTable';
import { debounce } from 'lodash';
import CourseDetails from './CourseDetails';
import CourseForm from './CourseForm';
import EnrollmentRequestDetails from './EnrollmentRequestDetails';
import { Course as ManagementCourse, EnrollmentRequest } from '../../../../domain/types/management/coursemanagement';
import { 
  adaptDomainCourseToManagement, 
  adaptDomainEnrollmentRequestToManagement,
  adaptToCourseRequestDetails
} from '../../../../domain/types/courseTypeAdapter';
import { SPECIALIZATIONS, FACULTIES, TERMS, REQUEST_STATUSES, courseColumns, enrollmentRequestColumns } from '../../../../shared/constants/courseManagementConstants';
import LoadingSpinner from '../../../../shared/components/LoadingSpinner';
import ErrorMessage from '../../../../shared/components/ErrorMessage';
import EmptyState from '../../../../shared/components/EmptyState';

const AdminCourseManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ManagementCourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<ManagementCourse | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showApproveWarning, setShowApproveWarning] = useState(false);
  const [showRejectWarning, setShowRejectWarning] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  const debouncedSetSearchTerm = useMemo(() => debounce((value: string) => {
    setDebouncedSearchTerm(value);
  }, 300), []);

  React.useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [searchTerm, debouncedSetSearchTerm]);

  const {
    courses,
    totalPages,
    page,
    setPage,
    filters,
    setFilters,
    isLoading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollmentRequests,
    enrollmentRequestsTotalPages,
    isLoadingRequests,
    approveEnrollmentRequest,
    rejectEnrollmentRequest,
    requestFilters,
    setRequestFilters,
    activeTab,
    handleTabChange,
    courseDetails,
    isLoadingCourseDetails,
    handleViewCourse,
    handleEditCourse,
    requestDetails,
    handleViewRequest,
  } = useCourseManagement(debouncedSearchTerm);


  const handleSaveCourse = async (formData: Partial<ManagementCourse>) => {
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id as string, data: formData });
      } else {
        await createCourse({ 
          ...formData, 
          _id: '',
          specialization: formData.specialization || '',
          faculty: formData.faculty || '',
          title: formData.title || '',
          credits: formData.credits || 0,
          schedule: formData.schedule || '',
          maxEnrollment: formData.maxEnrollment || 0,
          term: formData.term || ''
        });
      }
      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const courseActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Course',
      onClick: (course: ManagementCourse) => {
        handleViewCourse(course.id as string);
        setShowCourseDetail(true);
      },
      color: 'blue' as const,
    },
    {
      icon: <FiEdit size={16} />,
      label: 'Edit Course',
      onClick: (course: ManagementCourse) => {
        handleEditCourse(course.id as string);
        setEditingCourse(courseDetails as unknown as ManagementCourse);
        setShowCourseModal(true);
      },
      color: 'green' as const,
    },
    {
      icon: <FiTrash2 size={16} />,
      label: 'Delete Course',
      onClick: (course: ManagementCourse) => {
        setCourseToDelete(course);
        setShowDeleteWarning(true);
      },
      color: 'red' as const,
    },
  ];

  const enrollmentRequestActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Details',
      onClick: (request: EnrollmentRequest) => {
        handleViewRequest(request.id as string);
        setShowRequestDetails(true);
      },
      color: 'blue' as const,
    },
    {
      icon: <FiCheck size={16} />,
      label: 'Approve',
      onClick: (request: EnrollmentRequest) => {
        setSelectedRequest(request);
        setShowApproveWarning(true);
      },
      color: 'green' as const,
      disabled: (request: EnrollmentRequest) => request.status.toLowerCase() !== 'pending',
    },
    {
      icon: <FiX size={16} />,
      label: 'Reject',
      onClick: (request: EnrollmentRequest) => {
        setSelectedRequest(request);
        setShowRejectWarning(true);
      },
      color: 'red' as const,
      disabled: (request: EnrollmentRequest) => request.status.toLowerCase() !== 'pending',
    },
  ];

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      if (activeTab === 'courses') {
        setFilters((prev) => ({
          ...prev,
          [field]: value,
        }));
      } else {
        setRequestFilters((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
      setPage(1); 
    }, 300),
    [setFilters, setRequestFilters, activeTab]
  );

  const handleResetFilters = () => {
    if (activeTab === 'courses') {
      setFilters({
        specialization: 'All Specializations',
        faculty: 'All Faculties',
        term: 'All Terms',
      });
    } else {
      setRequestFilters({
        status: 'All',
        specialization: 'All Specializations',
        term: 'All Terms',
      });
    }
    setPage(1);
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowCourseModal(true);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete.id as string);
        setShowDeleteWarning(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleConfirmApprove = async () => {
    if (selectedRequest) {
      try {
        await approveEnrollmentRequest(selectedRequest.id as string);
        setShowApproveWarning(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error approving request:', error);
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedRequest && rejectReason) {
      try {
        await rejectEnrollmentRequest({ requestId: selectedRequest.id as string, reason: rejectReason });
        setShowRejectWarning(false);
        setSelectedRequest(null);
        setRejectReason('');
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load courses.'} />;
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
          title="Course Management"
          subtitle="Manage academic courses and enrollments"
          stats={[
            {
              icon: <FiBookOpen />,
              title: 'Total Courses',
              value: courses?.length?.toString() || '0',
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiClipboard />,
              title: 'Active Courses',
              value: courses?.filter((c) => (c).currentEnrollment > 0).length?.toString() || '0',
              change: '+2.1%',
              isPositive: true,
            },
            {
              icon: <FiBarChart2 />,
              title: 'Enrollment Rate',
              value: `${((courses?.reduce((acc: number, c) => acc + c.currentEnrollment, 0) / courses?.reduce((acc: number, c) => acc + c.maxEnrollment, 0)) * 100 || 0).toFixed(2)}%`,
              change: '+3.8%',
              isPositive: true,
            },
          ]}
          tabs={[
            { label: 'Courses', icon: <FiBookOpen size={16} />, active: activeTab === 'courses' },
            { label: 'Requests', icon: <FiClipboard size={16} />, active: activeTab === 'requests' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search courses or requests..."
          filters={activeTab === 'courses' ? filters : requestFilters as any}
          filterOptions={
            activeTab === 'courses'
              ? {
                specialization: SPECIALIZATIONS,
                faculty: FACULTIES,
                term: TERMS,
              }
              : {
                status: REQUEST_STATUSES,
                specialization: SPECIALIZATIONS,
                term: TERMS,
              }
          }
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['courses', 'requests'];
            handleTabChange(tabMap[index] as 'courses' | 'requests');
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              {activeTab === 'courses' && (
                <button
                  onClick={handleAddCourse}
                  className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FiPlus size={16} />
                  Add Course
                </button>
              )}

              {activeTab === 'courses' && (
                isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : courses.length > 0 ? (
                  <>
                    <ApplicationsTable
                      data={courses.map(adaptDomainCourseToManagement)}
                      columns={courseColumns}
                      actions={courseActions}
                    />
                    <Pagination
                      page={page}
                      totalPages={totalPages || 1}
                      itemsCount={courses.length}
                      itemName="courses"
                      onPageChange={(newPage) => setPage(newPage)}
                      onFirstPage={() => setPage(1)}
                      onLastPage={() => setPage(totalPages)}
                    />
                  </>
                ) : (
                  <EmptyState
                    icon={<FiBookOpen size={32} className="text-purple-400" />}
                    title="No Courses Found"
                    message="There are no courses matching your current filters. Try adjusting your search criteria."
                  />
                )
              )}

              {activeTab === 'requests' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-white">Course Enrollment Requests</h3>
                  {isLoadingRequests ? (
                    <LoadingSpinner />
                  ) : enrollmentRequests.length > 0 ? (
                    <>
                      <ApplicationsTable
                        data={enrollmentRequests.map(adaptDomainEnrollmentRequestToManagement)}
                        columns={enrollmentRequestColumns}
                        actions={enrollmentRequestActions}
                      />
                      <Pagination
                        page={page}
                        totalPages={enrollmentRequestsTotalPages}
                        itemsCount={enrollmentRequests.length}
                        itemName="requests"
                        onPageChange={(newPage) => setPage(newPage)}
                        onFirstPage={() => setPage(1)}
                        onLastPage={() => setPage(enrollmentRequestsTotalPages)}
                      />
                    </>
                  ) : (
                    <EmptyState
                      icon={<FiClipboard size={32} className="text-purple-400" />}
                      title="No Requests Found"
                      message="There are no course enrollment requests at the moment."
                    />
                  )}
                </div>
              )}

              {activeTab === 'courses' && courses.length === 0 && (
                <EmptyState
                  icon={<FiBookOpen size={32} className="text-purple-400" />}
                  title="No Courses Found"
                  message="There are no courses matching your current filters. Try adjusting your search criteria."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showCourseModal && (
        <CourseForm
          isOpen={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          onSubmit={(data: unknown) => handleSaveCourse(data as Partial<ManagementCourse>)}
          initialData={editingCourse}
          isEditing={!!editingCourse}
          specializations={SPECIALIZATIONS.filter((s) => s !== 'All Specializations')}
          faculties={FACULTIES.filter((f) => f !== 'All Faculties')}
          terms={TERMS.filter((t) => t !== 'All Terms')}
        />
      )}

      {showCourseDetail && courseDetails && (
        <CourseDetails
          isOpen={showCourseDetail}
          onClose={() => {
            setShowCourseDetail(false);
          }}
          course={adaptDomainCourseToManagement(courseDetails)}
          isLoading={isLoadingCourseDetails}
        />
      )}

      {showRequestDetails && (
        <EnrollmentRequestDetails
          isOpen={showRequestDetails}
          onClose={() => {
            setShowRequestDetails(false);
          }}
          request={requestDetails ? adaptToCourseRequestDetails(requestDetails) : null}
          onApprove={(id: string) => {
            const req = (enrollmentRequests)?.find((r) => r.id === id);
            if (req) {
              setSelectedRequest(adaptDomainEnrollmentRequestToManagement(req));
            }
            setShowApproveWarning(true);
          }}
          onReject={(id: string) => {
            const req = (enrollmentRequests)?.find((r) => r.id === id);
            if (req) {
              setSelectedRequest(adaptDomainEnrollmentRequestToManagement(req));
            }
            setShowRejectWarning(true);
          }}
        />
      )}

      <WarningModal
        isOpen={showDeleteWarning}
        onClose={() => {
          setShowDeleteWarning(false);
          setCourseToDelete(null);
        }}

        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={courseToDelete ? `Are you sure you want to delete "${courseToDelete.title}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <WarningModal
        isOpen={showApproveWarning}
        onClose={() => {
          setShowApproveWarning(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmApprove}
        title="Approve Enrollment Request"
        message={selectedRequest ? `Are you sure you want to approve the enrollment request for ${selectedRequest.studentName}?` : ''}
        confirmText="Approve"
        cancelText="Cancel"
        type="info"
      />

      <WarningModal
        isOpen={showRejectWarning}
        onClose={() => {
          setShowRejectWarning(false);
          setSelectedRequest(null);
          setRejectReason('');
        }}
        onConfirm={handleConfirmReject}
        title="Reject Enrollment Request"
        message={`Are you sure you want to reject the enrollment request for ${selectedRequest?.studentName}?`}
        confirmText="Reject"
        cancelText="Cancel"
        type="danger"
        showInput
        inputLabel="Reason for rejection"
        inputPlaceholder="Provide a clear reason (required)"
        inputValue={rejectReason}
        onInputChange={setRejectReason}
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

export default AdminCourseManagement;