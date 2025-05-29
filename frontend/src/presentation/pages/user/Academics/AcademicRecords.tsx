import { StudentInfo, GradeInfo, AcademicHistory } from '../../../../application/services/academicService';

interface AcademicRecordsProps {
  studentInfo: StudentInfo;
  gradeInfo: GradeInfo;
  academicHistory: AcademicHistory[];
}

export default function AcademicRecords({ studentInfo, gradeInfo, academicHistory }: AcademicRecordsProps) {
    
  return (
      <div className="container mx-auto px-4 mt-6">
        <div className="relative overflow-hidden rounded-t-2xl shadow-md bg-gradient-to-r from-orange-600 to-amber-500">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-30"></div>
          <div className="relative z-10 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Academic Records</h2>
              <span className="text-white font-medium">Fall 2025</span>
            </div>
          </div>
        </div>
  
        <div className="relative overflow-hidden rounded-b-2xl shadow-md bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
          <div className="relative z-10 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200 pb-2">Student Information</h3>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <p className="text-gray-600">
                  Name: {studentInfo.name} | Email: {studentInfo.email} | Major: {studentInfo.major} | Academic Standing: {studentInfo.academicStanding}
                </p>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200 pb-2">Grade Summary</h3>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Cumulative GPA:</span>
                      <span className="text-gray-600">{gradeInfo.cumulativeGPA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Term GPA ({gradeInfo.termName}):</span>
                      <span className="text-gray-600">{gradeInfo.termGPA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Credits Earned:</span>
                      <span className="text-gray-600">{gradeInfo.creditsEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-medium">Credits In Progress:</span>
                      <span className="text-gray-600">{gradeInfo.creditsInProgress}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200 pb-2">Academic History</h3>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                  <div className="space-y-2">
                    {academicHistory.map((term) => (
                      <div key={term.id} className="bg-white p-3 rounded border border-amber-200 hover:shadow-sm transition duration-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">{term.term}</span>
                          <div className="flex space-x-2">
                            <span className="text-gray-600">{term.credits} Credits</span>
                            <span className="text-gray-600">|</span>
                            <span className="text-gray-600">GPA: {term.gpa}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  
            <div className="mt-6 flex justify-end space-x-3">
              <button className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-md transition duration-200">
                View Unofficial Transcript
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md transition duration-200">
                Request Official Transcript
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }