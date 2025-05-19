import { useState } from 'react';

export default function AcademicRecords() {
  const [studentInfo] = useState({
    name: "John Smith",
    id: "123456789",
    major: "Computer Science",
    academicStanding: "Good",
    advisor: "Dr. Emma Wilson"
  });
  
  const [gradeInfo] = useState({
    cumulativeGPA: "3.75",
    termGPA: "3.82",
    termName: "Spring 2025",
    creditsEarned: "75",
    creditsInProgress: "0"
  });
  
  const [academicHistory] = useState([
    {
      term: "Spring 2025",
      credits: "15",
      gpa: "3.82",
      id: 1
    },
    {
      term: "Fall 2024",
      credits: "18",
      gpa: "3.70",
      id: 2
    },
    {
      term: "Spring 2024",
      credits: "15",
      gpa: "3.75",
      id: 3
    }
  ]);
  
  return (
    <div className="bg-amber-50 min-h-screen pb-8">
      {/* Header - keeping original structure */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">University Portal</h1>
          <div className="flex items-center gap-3">
            <span>{studentInfo.name}</span>
            <span className="bg-amber-200 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center font-medium">JS</span>
            <span className="bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Dashboard</a>
            <a href="#" className="px-4 py-3 bg-orange-700 text-white font-medium">Academics</a>
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Financial</a>
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Communication</a>
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Campus Life</a>
          </nav>
        </div>
      </div>

      {/* Academic Information */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-orange-800">Academic Information</h2>
          <p className="text-orange-700 mt-1">
            Current Major: {studentInfo.major} | Academic Standing: {studentInfo.academicStanding} | Advisor: {studentInfo.advisor}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex bg-gray-100 rounded-t-lg overflow-hidden">
          <a href="#" className="py-3 px-6 text-amber-700 hover:text-orange-600 hover:bg-amber-50">
            Course Registration
          </a>
          <a href="#" className="py-3 px-6 font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500">
            Academic Records
          </a>
          <a href="#" className="py-3 px-6 text-amber-700 hover:text-orange-600 hover:bg-amber-50">
            Degree Audit
          </a>
        </div>
      </div>

      {/* Academic Records */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 rounded-t-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Academic Records</h2>
            <span className="text-white font-medium">Fall 2025</span>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white p-6 shadow-md">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2 border-b border-amber-200 pb-2">Student Information</h3>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <p className="text-orange-800">
                Name: {studentInfo.name} | ID: {studentInfo.id} | Major: {studentInfo.major} | Academic Standing: {studentInfo.academicStanding}
              </p>
            </div>
          </div>

          {/* Grade Summary and Academic History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grade Summary */}
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2 border-b border-amber-200 pb-2">Grade Summary</h3>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-orange-800 font-medium">Cumulative GPA:</span>
                    <span className="text-orange-900">{gradeInfo.cumulativeGPA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-800 font-medium">Term GPA ({gradeInfo.termName}):</span>
                    <span className="text-orange-900">{gradeInfo.termGPA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-800 font-medium">Credits Earned:</span>
                    <span className="text-orange-900">{gradeInfo.creditsEarned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-800 font-medium">Credits In Progress:</span>
                    <span className="text-orange-900">{gradeInfo.creditsInProgress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic History */}
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-2 border-b border-amber-200 pb-2">Academic History</h3>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                <div className="space-y-2">
                  {academicHistory.map((term) => (
                    <div key={term.id} className="bg-white p-3 rounded border border-amber-200 hover:shadow-sm transition duration-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-orange-800">{term.term}</span>
                        <div className="flex space-x-2">
                          <span className="text-orange-700">{term.credits} Credits</span>
                          <span className="text-orange-900">|</span>
                          <span className="text-orange-700">GPA: {term.gpa}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transcript Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-md transition duration-200">
              View Unofficial Transcript
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-200">
              Request Official Transcript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}