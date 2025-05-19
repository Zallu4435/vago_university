import { useState } from 'react';
import { Search } from 'lucide-react';

export default function UniversityPortal() {
  const [enrolledCredits] = useState(0);
  const [waitlistedCredits] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const courses = [
    {
      code: 'CS401',
      title: 'Advanced Algorithms',
      credits: 3,
      instructor: 'Dr. P. Garcia',
      schedule: 'MWF 10:00-11:45',
      id: 1
    },
    {
      code: 'MATH302',
      title: 'Differential Equations',
      credits: 4,
      instructor: 'Dr. L. Chen',
      schedule: 'TTh 1:00-3:00',
      id: 2
    },
    {
      code: 'PHYS201',
      title: 'Modern Physics',
      credits: 4,
      instructor: 'Dr. R. Smith',
      schedule: 'MWF 2:00-3:30',
      id: 3
    }
  ];

  return (
    <div className="bg-amber-50 min-h-screen pb-8">
      {/* Header - keeping original as mentioned */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700">University Portal</h1>
          <div className="flex items-center gap-3">
            <span>John Smith</span>
            <span className="bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center">JS</span>
            <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
          </div>
        </div>
      </div>

      {/* Navigation - keeping original as mentioned */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <a href="#" className="px-4 py-3 text-gray-600 hover:text-orange-500">Dashboard</a>
            <a href="#" className="px-4 py-3 text-orange-500 border-b-2 border-orange-500 font-medium">Academics</a>
            <a href="#" className="px-4 py-3 text-gray-600 hover:text-orange-500">Financial</a>
            <a href="#" className="px-4 py-3 text-gray-600 hover:text-orange-500">Communication</a>
            <a href="#" className="px-4 py-3 text-gray-600 hover:text-orange-500">Campus Life</a>
          </nav>
        </div>
      </div>

      {/* Academic Information */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-orange-800">Academic Information</h2>
          <p className="text-orange-700 mt-1">
            Current Major: Computer Science | Academic Standing: Good | Advisor: Dr. Emma Wilson
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex border-b border-amber-200">
          <button className="py-2 px-4 font-medium text-orange-800 border-b-2 border-orange-500">
            Course Registration
          </button>
          <button className="py-2 px-4 text-amber-700 hover:text-orange-600">
            Academic Records
          </button>
          <button className="py-2 px-4 text-amber-700 hover:text-orange-600">
            Degree Audit
          </button>
        </div>
      </div>

      {/* Course Registration Portal */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 rounded-t-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Course Registration Portal</h2>
            <span className="text-white font-medium">Fall 2025</span>
          </div>
        </div>

        {/* Registration Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 shadow-md rounded-b-lg mb-6">
          {/* Registration Status */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Registration Status</h3>
            <div className="text-amber-800">
              <p className="mb-1">Time Ticket: May 15, 9:00 AM</p>
              <p>Credits Eligible: 18</p>
            </div>
          </div>
          
          {/* Registration Actions */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Registration Actions</h3>
            <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-200 font-medium">
              Register for Classes
            </button>
          </div>
          
          {/* Current Registration */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Current Registration</h3>
            <div className="text-amber-800">
              <p className="mb-1">Enrolled: {enrolledCredits} credits</p>
              <p>Waitlisted: {waitlistedCredits} credits</p>
            </div>
          </div>
        </div>
        
        {/* Search Courses */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <label htmlFor="search" className="text-orange-800 font-medium mb-2 md:mb-0">Search Courses:</label>
            <div className="flex w-full md:w-2/3 lg:w-1/2">
              <input
                type="text"
                id="search"
                className="border border-amber-300 rounded-l-md py-2 px-3 flex-grow focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter course name or code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-r-md flex items-center">
                <Search size={18} />
                <span className="ml-1 hidden sm:inline">Search</span>
              </button>
            </div>
            <a href="#" className="text-orange-600 hover:text-orange-700 mt-2 md:mt-0 md:ml-4 text-sm">Advanced Search</a>
          </div>
          
          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold border-b-2 border-amber-200">Course</th>
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold border-b-2 border-amber-200">Title</th>
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold border-b-2 border-amber-200">Credits</th>
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold border-b-2 border-amber-200">Instructor</th>
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold border-b-2 border-amber-200">Schedule</th>
                  <th className="py-3 px-4 text-center text-orange-800 font-semibold border-b-2 border-amber-200">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-amber-100 hover:bg-amber-50">
                    <td className="py-3 px-4 text-orange-900 font-medium">{course.code}</td>
                    <td className="py-3 px-4 text-orange-800">{course.title}</td>
                    <td className="py-3 px-4 text-orange-800">{course.credits}</td>
                    <td className="py-3 px-4 text-orange-800">{course.instructor}</td>
                    <td className="py-3 px-4 text-orange-800">{course.schedule}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-3 rounded-md transition duration-200 text-sm">
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
    </div>
  );
}