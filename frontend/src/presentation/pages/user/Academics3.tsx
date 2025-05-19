import { useState } from 'react';

export default function DegreeAudit() {
  const [studentInfo] = useState({
    name: "John Smith",
    id: "123456789",
    major: "Computer Science",
    academicStanding: "Good",
    advisor: "Dr. Emma Wilson"
  });
  
  const [programInfo] = useState({
    degree: "Bachelor of Science in Computer Science",
    catalogYear: "2023-2024"
  });
  
  const [progressInfo] = useState({
    overallProgress: 70, // percentage
    totalCredits: 120,
    completedCredits: 85,
    remainingCredits: 35,
    estimatedGraduation: "May 2026"
  });
  
  const [requirementsInfo] = useState({
    core: {
      percentage: 80,
      completed: 48,
      total: 60
    },
    elective: {
      percentage: 50,
      completed: 15,
      total: 30
    },
    general: {
      percentage: 73,
      completed: 22,
      total: 30
    }
  });
  
  return (
    <div className="bg-amber-50 min-h-screen pb-8">
      {/* Header */}
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
          <a href="#" className="py-3 px-6 text-amber-700 hover:text-orange-600 hover:bg-amber-50">
            Academic Records
          </a>
          <a href="#" className="py-3 px-6 font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500">
            Degree Audit
          </a>
        </div>
      </div>

      {/* Degree Audit */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 rounded-t-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Degree Audit</h2>
            <span className="text-white font-medium">Fall 2025</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 shadow-md rounded-b-lg">
          {/* Program Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2 border-b border-amber-200 pb-2">Program Information</h3>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="text-orange-800">
                  <span className="font-medium">Degree:</span> {programInfo.degree}
                </div>
                <div className="text-orange-800 mt-2 md:mt-0">
                  <span className="font-medium">Catalog Year:</span> {programInfo.catalogYear}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2 border-b border-amber-200 pb-2">Progress Summary</h3>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-orange-800 font-medium">Overall Degree Progress:</span>
                  <span className="text-orange-800">{progressInfo.completedCredits}/{progressInfo.totalCredits} credits</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-4 rounded-full" 
                    style={{ width: `${progressInfo.overallProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-orange-800 text-sm">{progressInfo.overallProgress}% Complete</span>
                  <span className="text-orange-800 text-sm">{progressInfo.remainingCredits} Credits Remaining</span>
                </div>
              </div>
              <div className="flex justify-between px-2 py-1 bg-white rounded border border-amber-200">
                <span className="text-orange-800 font-medium">Estimated Graduation:</span>
                <span className="text-orange-800">{progressInfo.estimatedGraduation}</span>
              </div>
            </div>
          </div>

          {/* Degree Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2 border-b border-amber-200 pb-2">Degree Requirements</h3>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="space-y-4">
                {/* Core Requirements */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-orange-800 font-medium">Core Requirements:</span>
                    <span className="text-orange-800">{requirementsInfo.core.completed}/{requirementsInfo.core.total} credits</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-4">
                    <div 
                      className="bg-orange-500 h-4 rounded-full" 
                      style={{ width: `${requirementsInfo.core.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-orange-800 text-sm">{requirementsInfo.core.percentage}% Complete</span>
                  </div>
                </div>
                
                {/* Elective Requirements */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-orange-800 font-medium">Elective Requirements:</span>
                    <span className="text-orange-800">{requirementsInfo.elective.completed}/{requirementsInfo.elective.total} credits</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-4">
                    <div 
                      className="bg-orange-500 h-4 rounded-full" 
                      style={{ width: `${requirementsInfo.elective.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-orange-800 text-sm">{requirementsInfo.elective.percentage}% Complete</span>
                  </div>
                </div>
                
                {/* General Education Requirements */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-orange-800 font-medium">General Education Requirements:</span>
                    <span className="text-orange-800">{requirementsInfo.general.completed}/{requirementsInfo.general.total} credits</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-4">
                    <div 
                      className="bg-orange-500 h-4 rounded-full" 
                      style={{ width: `${requirementsInfo.general.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-orange-800 text-sm">{requirementsInfo.general.percentage}% Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-md transition duration-200">
              View Detailed Requirements
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-200">
              Download Degree Audit
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition duration-200">
              Meet with Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}