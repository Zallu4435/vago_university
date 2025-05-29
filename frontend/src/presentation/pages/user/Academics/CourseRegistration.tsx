import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useCourseRegistration } from '../../../../application/hooks/useAcademic';
import CourseDetailsModal from './CourseDetailsModal';

interface Course {
  id: number;
  title: string;
  specialization: string;
  faculty: string;
  credits: number;
  schedule: string;
  maxEnrollment: number;
  currentEnrollment: number;
  description?: string;
  prerequisites?: string[];

}

interface CourseRegistrationProps {
  courses: Course[];
  enrolledCredits: number;
  waitlistedCredits: number;
  studentInfo: StudentInfo;
}

interface EnrollmentData {
  reason: string;
}

export default function CourseRegistration({ studentInfo, courses, enrolledCredits, waitlistedCredits }: CourseRegistrationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { registerForCourse, isRegistering } = useCourseRegistration();

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleConfirmEnrollment = async (enrollmentData: EnrollmentData) => {
    if (selectedCourse) {
      try {
        console.log(selectedCourse , 'kaopijoihUSDHaihb')
        await registerForCourse({
          courseId: selectedCourse._id,
          reason: enrollmentData.reason
        });
        setIsModalOpen(false);
        setSelectedCourse(null);
      } catch (error) {
        console.error('Failed to enroll in course:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="relative overflow-hidden rounded-t-2xl shadow-md bg-gradient-to-r from-orange-600 to-amber-500">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-30"></div>
        <div className="relative z-10 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Course Registration Portal</h2>
            <span className="text-white font-medium">Fall 2025</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 shadow-md rounded-b-2xl mb-6">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Registration Status</h3>
          <div className="text-gray-600">
            <p className="mb-1">Time Ticket: May 15, 9:00 AM</p>
            <p>Credits Eligible: 20</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Registration Actions</h3>
          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md transition duration-200 font-medium">
            Register for Classes
          </button>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Registration</h3>
          <div className="text-gray-600">
            <p className="mb-1">Enrolled: {20 - Number(studentInfo.credits)} credits</p>
            <p>Waitlisted: {studentInfo.pendingCredits} credits</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-md bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
        <div className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <label htmlFor="search" className="text-gray-800 font-medium mb-2 md:mb-0">Search Courses:</label>
            <div className="flex w-full md:w-2/3 lg:w-1/2">
              <div className="relative flex-grow">
                <FaSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                <input
                  type="text"
                  id="search"
                  className="w-full pl-10 pr-4 py-2 rounded-l-md border border-amber-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter course name or code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 rounded-r-md flex items-center">
                <FaSearch size={18} />
                <span className="ml-1 hidden sm:inline">Search</span>
              </button>
            </div>
            <a href="#" className="text-orange-600 hover:text-orange-700 mt-2 md:mt-0 md:ml foil:4 text-sm">Advanced Search</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b-2 border-amber-200">Course</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b-2 border-amber-200">Title</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b-2 border-amber-200">Credits</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b-2 border-amber-200">Instructor</th>
                  <th className="py-3 px-4 text-left text-gray-800 font-semibold border-b-2 border-amber-200">Schedule</th>
                  <th className="py-3 px-4 text-center text-gray-800 font-semibold border-b-2 border-amber-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-amber-100 hover:bg-amber-50">
                    <td className="py-3 px-4 text-gray-800 font-medium">{course.specialization}</td>
                    <td className="py-3 px-4 text-gray-600">{course.title}</td>
                    <td className="py-3 px-4 text-gray-600">{course.credits}</td>
                    <td className="py-3 px-4 text-gray-600">{course.faculty}</td>
                    <td className="py-3 px-4 text-gray-600">{course.schedule}</td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => handleEnrollClick(course)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-1 px-3 rounded-md transition duration-200 text-sm"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <CourseDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
          }}
          onConfirm={handleConfirmEnrollment}
          course={selectedCourse}
          isEnrolling={isRegistering}
        />
      )}
    </div>
  );
}