import React, { useState, useCallback } from 'react';
import { FiPlus, FiEye, FiEdit, FiTrash2, FiBook, FiBriefcase, FiUser, FiHash, FiClock, FiUsers, FiBookOpen, FiClipboard, FiBarChart2 } from 'react-icons/fi';
import { useCourseManagement } from '../../../../application/hooks/useCourseManagement';
import WarningModal from '../../../components/WarningModal';
import Header from '../User/Header';
import Pagination from '../User/Pagination';
import ApplicationsTable from '../User/ApplicationsTable';
import { debounce } from 'lodash';
import CourseDetails from './CourseDetails';
import CourseForm from './CourseForm';

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
  } = useCourseManagement();

  const [activeTab, setActiveTab] = useState<'courses' | 'active' | 'analytics'>('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    specialization: '',
    credits: 0,
    faculty: '',
    schedule: '',
    maxEnrollment: 0,
    prerequisites: [] as string[],
    term: '',
  });

  const filteredCourses = (courses || [])?.filter((course) => {
    // Search filter
    const matchesSearch = searchTerm
      ? course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course._id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Specialization filter
    const matchesSpecialization =
      filters.specialization === 'all' ||
      !filters.specialization ||
      course.specialization?.toLowerCase() === filters.specialization?.toLowerCase();

    // Faculty filter
    const matchesFaculty =
      filters.faculty === 'all' ||
      !filters.faculty ||
      course.faculty?.toLowerCase() === filters.faculty?.toLowerCase();

    // Term filter
    const matchesTerm =
      filters.term === 'all' ||
      !filters.term ||
      course.term?.toLowerCase() === filters.term?.toLowerCase();

    // Active tab filter
    const matchesTab =
      activeTab === 'courses' ||
      (activeTab === 'active' && course.currentEnrollment > 0) ||
      activeTab === 'analytics'; // Analytics tab shows all courses for now

    return matchesSearch && matchesSpecialization && matchesFaculty && matchesTerm && matchesTab;
  });

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      description: '',
      specialization: '',
      credits: 0,
      faculty: '',
      schedule: '',
      maxEnrollment: 0,
      prerequisites: [],
      term: '',
    });
    setShowCourseModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || '',
      specialization: course.specialization,
      credits: course.credits,
      faculty: course.faculty,
      schedule: course.schedule,
      maxEnrollment: course.maxEnrollment,
      prerequisites: course.prerequisites || [],
      term: course.term,
    });
    setShowCourseModal(true);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse._id, data: courseForm });
      } else {
        await createCourse(courseForm);
      }
      setShowCourseModal(false);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteWarning(true);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete._id);
        setShowDeleteWarning(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const debouncedFilterChange = useCallback(
    debounce((field: string, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    }, 300),
    []
  );

  const handleResetFilters = () => {
    setFilters({
      specialization: 'All Specializations',
      faculty: 'All Faculties',
      term: 'All Terms',
    });
  };

  const courseActions = [
    {
      icon: <FiEye size={16} />,
      label: 'View Course',
      onClick: handleViewCourse,
      color: 'blue' as const,
    },
    {
      icon: <FiEdit size={16} />,
      label: 'Edit Course',
      onClick: handleEditCourse,
      color: 'green' as const,
    },
    {
      icon: <FiTrash2 size={16} />,
      label: 'Delete Course',
      onClick: handleDeleteCourse,
      color: 'red' as const,
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
              value: courses?.length || '0',
              change: '+5.2%',
              isPositive: true,
            },
            {
              icon: <FiClipboard />,
              title: 'Active Courses',
              value: courses?.filter((c) => c.currentEnrollment > 0).length || '0',
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
            { label: 'All Courses', icon: <FiBookOpen size={16} />, active: activeTab === 'courses' },
            { label: 'Active', icon: <FiClipboard size={16} />, active: activeTab === 'active' },
            { label: 'Analytics', icon: <FiBarChart2 size={16} />, active: activeTab === 'analytics' },
          ]}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          searchPlaceholder="Search courses..."
          filters={filters}
          filterOptions={{
            specialization: SPECIALIZATIONS,
            faculty: FACULTIES,
            term: TERMS,
          }}
          debouncedFilterChange={debouncedFilterChange}
          handleResetFilters={handleResetFilters}
          onTabClick={(index) => {
            const tabMap = ['courses', 'active', 'analytics'];
            setActiveTab(tabMap[index] as 'courses' | 'active' | 'analytics');
          }}
        />

        <div className="mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="px-6 py-5">
              <button
                onClick={handleAddCourse}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiPlus size={16} />
                Add Course
              </button>
              {filteredCourses.length > 0 ? (
                <>
                  <ApplicationsTable
                    data={filteredCourses}
                    columns={courseColumns}
                    actions={courseActions}
                  />
                  <Pagination
                    page={page}
                    totalPages={totalPages || 1}
                    itemsCount={filteredCourses.length}
                    itemName="courses"
                    onPageChange={(newPage) => setPage(newPage)}
                    onFirstPage={() => setPage(1)}
                    onLastPage={() => setPage(totalPages)}
                  />
                </>
              ) : (
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
          specializations={SPECIALIZATIONS}
          faculties={FACULTIES}
          terms={TERMS}
        />
      )}

      {showCourseDetail && selectedCourse && (
        <CourseDetails
          isOpen={showCourseDetail}
          onClose={() => setShowCourseDetail(false)}
          course={selectedCourse}
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