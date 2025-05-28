import { StudentInfo, ProgramInfo, ProgressInfo, RequirementsInfo } from '../../../../application/services/academicService';

interface DegreeAuditProps {
  studentInfo: StudentInfo;
  programInfo: ProgramInfo;
  progressInfo: ProgressInfo;
  requirementsInfo: RequirementsInfo;
}

export default function DegreeAudit({ studentInfo, programInfo, progressInfo, requirementsInfo }: DegreeAuditProps) {
    return (
      <div className="container mx-auto px-4 mt-6">
        <div className="relative overflow-hidden rounded-t-2xl shadow-md bg-gradient-to-r from-orange-600 to-amber-500">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-30"></div>
          <div className="relative z-10 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Degree Audit</h2>
              <span className="text-white font-medium">Fall 2025</span>
            </div>
          </div>
        </div>
  
        <div className="relative overflow-hidden rounded-b-2xl shadow-md bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-white opacity-95"></div>
          <div className="relative z-10 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200 pb-2">Program Information</h3>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div className="text-gray-600">
                    <span className="font-medium text-gray-800">Degree:</span> {programInfo.degree}
                  </div>
                  <div className="text-gray-600 mt-2 md:mt-0">
                    <span className="font-medium text-gray-800">Catalog Year:</span> {programInfo.catalogYear}
                  </div>
                </div>
              </div>
            </div>
  
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200 pb-2">Progress Summary</h3>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-800 font-medium">Overall Degree Progress:</span>
                    <span className="text-gray-600">{progressInfo.completedCredits}/{progressInfo.totalCredits} credits</span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full" 
                      style={{ width: `${progressInfo.overallProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600 text-sm">{progressInfo.overallProgress}% Complete</span>
                    <span className="text-gray-600 text-sm">{progressInfo.remainingCredits} Credits Remaining</span>
                  </div>
                </div>
                <div className="flex justify-between px-2 py-1 bg-white rounded border border-amber-200">
                  <span className="text-gray-800 font-medium">Estimated Graduation:</span>
                  <span className="text-gray-600">{progressInfo.estimatedGraduation}</span>
                </div>
              </div>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-amber-200 pb-2">Degree Requirements</h3>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800 font-medium">Core Requirements:</span>
                      <span className="text-gray-600">{requirementsInfo.core.completed}/{requirementsInfo.core.total} credits</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full" 
                        style={{ width: `${requirementsInfo.core.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-gray-600 text-sm">{requirementsInfo.core.percentage}% Complete</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800 font-medium">Elective Requirements:</span>
                      <span className="text-gray-600">{requirementsInfo.elective.completed}/{requirementsInfo.elective.total} credits</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full" 
                        style={{ width: `${requirementsInfo.elective.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-gray-600 text-sm">{requirementsInfo.elective.percentage}% Complete</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-800 font-medium">General Education Requirements:</span>
                      <span className="text-gray-600">{requirementsInfo.general.completed}/{requirementsInfo.general.total} credits</span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-4 rounded-full" 
                        style={{ width: `${requirementsInfo.general.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-gray-600 text-sm">{requirementsInfo.general.percentage}% Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button className="bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-md transition duration-200">
                View Detailed Requirements
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md transition duration-200">
                Download Degree Audit
              </button>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md transition duration-200">
                Meet with Advisor
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }