import { Fragment, useState, useEffect } from 'react';

interface CourseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (enrollmentData: {
    term: string;
    section: string;
    reason: string;
  }) => void;
  course: {
    title: string;
    specialization: string;
    faculty: string;
    credits: number;
    schedule: string;
    maxEnrollment: number;
    currentEnrollment: number;
    description?: string;
    prerequisites?: string[];
  };
  isEnrolling: boolean;
}

export default function CourseDetailsModal({
  isOpen,
  onClose,
  onConfirm,
  course,
  isEnrolling
}: CourseDetailsModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    term: 'Fall 2025',
    section: '01',
    reason: ''
  });

  console.log(course);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowConfirmation(false);
      setEnrollmentData({
        term: 'Fall 2025',
        section: '01',
        reason: ''
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setShowConfirmation(false);
    }, 300);
  };

  const handleEnrollClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmEnrollment = () => {
    onConfirm(enrollmentData);
  };

  const handleBackToDetails = () => {
    setShowConfirmation(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnrollmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  const availableSpots = course.maxEnrollment - course.currentEnrollment;
  const isFullyBooked = availableSpots <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative w-full max-w-lg transform transition-all duration-300 ${
            isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Main Modal */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 px-8 py-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 leading-tight">{course.title}</h2>
                    <div className="flex items-center space-x-4 text-orange-100">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {course.credits} Credits
                      </span>
                      <span className="text-sm">
                        {availableSpots > 0 ? `${availableSpots} spots left` : 'Fully booked'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {!showConfirmation ? (
                // Course Details View
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Specialization</p>
                      <p className="text-lg font-semibold text-gray-900">{course.specialization}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Faculty</p>
                      <p className="text-lg font-semibold text-gray-900">{course.faculty}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Schedule</p>
                    <p className="text-lg font-semibold text-gray-900">{course.schedule}</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Enrollment Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isFullyBooked 
                          ? 'bg-red-100 text-red-800' 
                          : availableSpots <= 5 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {isFullyBooked ? 'Full' : availableSpots <= 5 ? 'Almost Full' : 'Available'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                          style={{ width: `${(course.currentEnrollment / course.maxEnrollment) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {course.currentEnrollment} / {course.maxEnrollment}
                      </span>
                    </div>
                  </div>

                  {course.description && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Description</p>
                      <p className="text-gray-700 leading-relaxed">{course.description}</p>
                    </div>
                  )}

                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Prerequisites</p>
                      <div className="space-y-2">
                        {course.prerequisites.map((prereq, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEnrollClick}
                      disabled={isFullyBooked || isEnrolling}
                      className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isFullyBooked 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      {isFullyBooked ? 'Course Full' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              ) : (
                // Confirmation View
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Confirm Enrollment</h3>
                    <p className="text-gray-600">
                      Please review and confirm your enrollment details for <strong>{course.title}</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
                        Term
                      </label>
                      <select
                        id="term"
                        name="term"
                        value={enrollmentData.term}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="Fall 2025">Fall 2025</option>
                        <option value="Spring 2026">Spring 2026</option>
                        <option value="Summer 2026">Summer 2026</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                        Section
                      </label>
                      <select
                        id="section"
                        name="section"
                        value={enrollmentData.section}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="01">Section 01</option>
                        <option value="02">Section 02</option>
                        <option value="03">Section 03</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Enrollment
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={enrollmentData.reason}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Please provide a brief reason for enrolling in this course..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleBackToDetails}
                      className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmEnrollment}
                      disabled={isEnrolling || !enrollmentData.reason.trim()}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isEnrolling ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Enrolling...</span>
                        </div>
                      ) : (
                        'Confirm Enrollment'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
