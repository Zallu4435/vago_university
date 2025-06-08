import React, { useState, useCallback } from 'react';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiBook, FiBriefcase, FiUser, FiHash, FiClock, FiUsers, FiBookOpen, FiClipboard, FiBarChart2, FiCheck, FiX } from 'react-icons/fi';
import { useCourseManagement } from '../../../../application/hooks/useCourseManagement';
import WarningModal from '../../../components/WarningModal';
import Header from '../User/Header';
import Pagination from '../User/Pagination';
import ApplicationsTable from '../User/ApplicationsTable';
import { debounce } from 'lodash';
import CourseDetails from './CourseDetails';
import CourseForm from './CourseForm';
import EnrollmentRequestDetails from './EnrollmentRequestDetails';

interface Course {
  _id: string;
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  prerequisites?: string[];
  term: string;
}

interface EnrollmentRequest {
  _id: string;
  studentName: string;
  courseTitle: string;
  requestedAt: string;
  status: string;
  specialization: string;
  term: string;
  studentId: string;
  studentEmail: string;
  studentPhone?: string;
  reason?: string;
  previousCourses?: {
    courseId: string;
    courseName: string;
    grade: string;
    term: string;
  }[];
  academicStanding?: {
    gpa: number;
    creditsCompleted: number;
    standing: 'Good' | 'Warning' | 'Probation';
  };
  additionalNotes?: string;
  lastUpdatedAt: string;
  updatedBy?: string;
}

const SPECIALIZATIONS = [
  'All Specializations',
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Web Development',
  'Mobile Development',
  'Database Management',
  'Cloud Computing',
  'Network Engineering',
  'Game Development',
];

const FACULTIES = ['All Faculties', 'Dr. Sarah Johnson', 'Dr. Michael Chen'];
const TERMS = ['All Terms', 'Fall 2024', 'Spring 2024', 'Summer 2024'];
const REQUEST_STATUSES = ['All', 'Pending', 'Approved', 'Rejected'];

const courseColumns = [
  {
    header: 'Title',
    key: 'title',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiBook size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.title || 'N/A'}</span>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Specialization',
    key: 'specialization',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiBriefcase size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.specialization || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Faculty',
    key: 'faculty',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiUser size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.faculty || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Credits',
    key: 'credits',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiHash size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.credits ?? 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Schedule',
    key: 'schedule',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiClock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{course.schedule || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Enrollment',
    key: 'currentEnrollment',
    render: (course: Course) => (
      <div className="flex items-center text-gray-300">
        <FiUsers size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{`${course.currentEnrollment}/${course.maxEnrollment}`}</span>
      </div>
    ),
  },
];

const enrollmentRequestColumns = [
  {
    header: 'Student Name',
    key: 'studentName',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiUser size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.studentName || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Course',
    key: 'courseTitle',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiBook size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.courseTitle || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Specialization',
    key: 'specialization',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiBriefcase size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.specialization || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Term',
    key: 'term',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiClock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{request.term || 'N/A'}</span>
      </div>
    ),
  },
  {
    header: 'Requested At',
    key: 'requestedAt',
    render: (request: EnrollmentRequest) => (
      <div className="flex items-center text-gray-300">
        <FiClock size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{new Date(request.requestedAt).toLocaleDateString()}</span>
      </div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (request: EnrollmentRequest) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          request.status === 'Pending'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
            : request.status === 'Approved'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {request.status}
      </span>
    ),
  },
];

const AdminCourseManagement: React.FC = () => {
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
    getEnrollmentRequestDetails,
    requestFilters,
    setRequestFilters,
    activeTab,
    handleTabChange,
    courseDetails,
    isLoadingCourseDetails,
    handleViewCourse,
    handleEditCourse,
    requestDetails,
    isLoadingRequestDetails,
    handleViewRequest,
  } = useCourseManagement();

  console.log(courseDetails, "ppppp")

  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showApproveWarning, setShowApproveWarning] = useState(false);
  const [showRejectWarning, setShowRejectWarning] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  const handleSaveCourse = async (formData: Partial<Course>) => {
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, data: formData });
      } else {
        await createCourse(formData as Omit<Course, 'id' | 'currentEnrollment'>);
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
      onClick: (course: Course) => {
        handleViewCourse(course.id);
        setShowCourseDetail(true);
      },
      color: 'blue' as const,
    },
    {
      icon: <FiEdit size={16} />,
      label: 'Edit Course',
      onClick: (course: Course) => {
        handleEditCourse(course.id);
        setEditingCourse(courseDetails?.props);
        setShowCourseModal(true);
      },
      color: 'green' as const,
    },
    {
      icon: <FiTrash2 size={16} />,
      label: 'Delete Course',
      onClick: (course: Course) => {
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
        handleViewRequest(request.id);
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
      setPage(1); // Reset to first page on filter change
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
        await deleteCourse(courseToDelete.id);
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
        await approveEnrollmentRequest(selectedRequest.id);
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
        await rejectEnrollmentRequest({ requestId: selectedRequest.id, reason: rejectReason });
        setShowRejectWarning(false);
        setSelectedRequest(null);
        setRejectReason('');
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
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
              value: courses?.length.toString() || '0',
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiClipboard />,
              title: 'Active Courses',
              value: courses?.filter((c) => c.currentEnrollment > 0).length.toString() || '0',
              change: '+2.1%',
              isPositive: true,
            },
            {
              icon: <FiBarChart2 />,
              title: 'Enrollment Rate',
              value: `${((courses?.reduce((acc, c) => acc + c.currentEnrollment, 0) / courses?.reduce((acc, c) => acc + c.maxEnrollment, 0)) * 100 || 0).toFixed(2)}%`,
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
          filters={activeTab === 'courses' ? filters : requestFilters}
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

              {activeTab === 'courses' && courses.length > 0 && (
                <>
                  <ApplicationsTable
                    data={courses}
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
              )}

              {activeTab === 'requests' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-white">Course Enrollment Requests</h3>
                  {isLoadingRequests ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                  ) : enrollmentRequests.length > 0 ? (
                    <>
                      <ApplicationsTable
                        data={enrollmentRequests}
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
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                        <FiClipboard size={32} className="text-purple-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">No Requests Found</h3>
                      <p className="text-gray-400 text-center max-w-sm">
                        There are no course enrollment requests at the moment.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'courses' && courses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                    <FiBookOpen size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Courses Found</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    There are no courses matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCourseModal && (
        <CourseForm
          isOpen={showCourseModal}
          onClose={() => setShowCourseModal(false)}
          onSubmit={handleSaveCourse}
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
          course={courseDetails?.props}
          isLoading={isLoadingCourseDetails}
        />
      )}

      {showRequestDetails && (
        <EnrollmentRequestDetails
          isOpen={showRequestDetails}
          onClose={() => {
            setShowRequestDetails(false);
          }}
          request={requestDetails?.data}
          isLoading={isLoadingRequestDetails}
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
        type="success"
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
        message={
          <div className="space-y-4">
            <p>Are you sure you want to reject the enrollment request for {selectedRequest?.studentName}?</p>
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

export default AdminCourseManagement;